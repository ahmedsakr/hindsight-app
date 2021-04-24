// Rounds an number to the specified decimal points
const roundTo = (num, digits) => Math.round((num + Number.EPSILON) * (10^digits)) / (10^digits);

/**
 * Calculates number of days between the dates provided
 */
const daysBetween = (date1, date2) => {
  const startDate = new Date(date1).getTime();
  const endDate = new Date(date2).getTime();
  return (endDate - startDate) / (1000 * 60 * 60 * 24);
}

/**
 * Given a list of objects with dates, determine the rate at which the
 * date is increasing from one object to the next.
 */
const determineDateRate = (data) => {
  if (data.length === 1) {
    return 1;
  }

  const daysDiff = daysBetween(data[0].date, data[data.length - 1].date);
  return Math.ceil(daysDiff / data.length);
}

const alignDateRate = (account, target) => {
  const accountRate = determineDateRate(account);
  const targetRate = determineDateRate(target);

  if (accountRate === targetRate) {
    return [ account, target ];
  }

  /* Pulling quote history for securities from Wealthsimple for 5 years
   * yields a list of quotes separated by 1 week. While the account performance
   * list comes back as a list of performance for every day since account was opened.
   * We need to speed up the account performance to match the security quotes.
   * 
   * For now, we will only handle the situation were targetRate = 7, accountRate = 1.
   */
  if (targetRate > accountRate) {
    // find an appropriate starting point for the target
    const startingIndex = target.findIndex((day) => daysBetween(account[0].date, day.date) >= 0 && daysBetween(account[0].date, day.date) <= 7);
    let alignedTarget = target.slice(startingIndex, target.length);

    let alignedAccount = account;

    // need to adjust the start of the account list to match the target
    if (alignedTarget[0].date !== alignedAccount[0].date) {
      const adjustAccount = alignedAccount.findIndex((day) => day.date === alignedTarget[0].date);
      alignedAccount = alignedAccount.slice(adjustAccount, alignedAccount.length);
    }



    // speed up account rate by transforming the account data from 1-day spaced to 7-days spaced.
    alignedAccount = alignedAccount.filter((day) => {
      return alignedTarget.findIndex((target) => target.date === day.date) >= 0
    });

    return [ alignedAccount, alignedTarget ];
  }

  // To be implemented: how do we align the dates properly?
  return [ account, target ];
}

/**
 * Synchronize the two lists by guaranteeing that the start and end of both lists
 * have matching dates. This means trimming off some entries that aren't found in both.
 */
const synchronizeData = (account, target) => {

  // make a copy of the arrays
  let [ accountData, targetData ] = alignDateRate(account, target);

  const accountStart = new Date(accountData[0].date);
  const targetStart = new Date(targetData[0].date);

  if (accountStart > targetStart) {
    const adjustTarget = targetData.findIndex((day) => day.date === accountData[0].date);
    targetData = targetData.slice(adjustTarget, targetData.length);
  } else if (targetStart > accountStart) {
    const adjustAccount = accountData.findIndex((day) => day.date === targetData[0].date);
    accountData = accountData.slice(adjustAccount, accountData.length);
  }

  const accountEnd = new Date(accountData[accountData.length - 1].date);
  const targetEnd = new Date(targetData[targetData.length - 1].date);

  if (accountEnd > targetEnd) {
    const adjustAccount = accountData.findIndex((day) => day.date === targetData[targetData.length - 1].date);
    accountData = accountData.slice(0, adjustAccount + 1);
  } else if (targetEnd > accountEnd) {
    const adjustTarget = targetData.findIndex((day) => day.date === accountData[accountData.length - 1].date);
    targetData = targetData.slice(0, adjustTarget + 1);
  }


  return { accountData, targetData };
}

/**
 * Wealthsimple Trade data counts a deposit as part of the total net deposits
 * when they have accepted it. However, that is usually not when the user can
 * actually start trading with that money. This needs to be accounted for
 * when computing the gain the person would have experienced with the target
 * security.
 * 
 * We do this by providing an allowance of 2 days after wealthsimple has accepted
 * their deposit. That means in this grace period, the target gains to do not include
 * the deposit funds that are waiting to be cleared.
 */
const determineDeposits = (data, index, depositRecords) => {
  const inProgressDeposits = depositRecords.filter((record) => {
    if (record.object === 'deposit') {
      const daysDiff = daysBetween(record.accepted_at.split("T")[0], data[index].date);
      return daysDiff >= 0 && daysDiff <= 2;
    } else if (record.object === 'institutional_transfer') {
      // need to investigate institutional transfer state when it is in progress
      // to find out when then amount gets applied to net deposits of the account.
      // For now, we return false for all transfers, meaning we won't provide
      // allowances for them.
      return false;
    }

    return false;
  });

  const allowance = inProgressDeposits.reduce((total, deposit) => {
    total += (deposit.value.amount - deposit.instant_value.amount)
    return total;
  }, 0);

  return data[index].net_deposits.amount - allowance;
}

/*
 * Generates a Recharts.js data list that compares the performance
 * of the user's accounts to a what-if scenario of the user having
 * 100% of their portfolio in the target security instead.
 */
export default function buildComparison(account, target) {

  // Synchronize account and target lists by making sure the date ranges
  // line up.
  const { accountData, targetData } = synchronizeData(account.data, target.data);

  const targetDayGain = (index) => {
    // we dont register any target gains on the first day or if the user
    // has no investments on this day (equity value === 0)
    if (index === 0 || accountData[index].equity_value.amount <= 0) {
      return 0;
    }

    const dayPercentGain = (targetData[index].adjusted_price - targetData[index - 1].adjusted_price) / targetData[index - 1].adjusted_price;
    return dayPercentGain * determineDeposits(accountData, index, account.deposits);
  }

  let targetTotalGain = 0, accountTotalGain = 0;
  let startingPortfolioGain = accountData[0].value.amount - accountData[0].net_deposits.amount;

  return accountData.map((day, i) => {
    targetTotalGain += targetDayGain(i);
    accountTotalGain = (day.value.amount - day.net_deposits.amount) - startingPortfolioGain;
    
    return {
      name: day.date,
      [account.key]: roundTo(accountTotalGain, 2),
      [target.key]: roundTo(targetTotalGain, 2)
    }
  });
}