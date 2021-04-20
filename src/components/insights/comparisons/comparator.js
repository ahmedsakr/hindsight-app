// Rounds an number to the specified decimal points
const roundTo = (num, digits) => Math.round((num + Number.EPSILON) * (10^digits)) / (10^digits);

/**
 * Synchronize the two lists by guaranteeing that the start and end of both lists
 * have matching dates. This means trimming off some entries that aren't found in both.
 */
const synchronizeData = (account, target) => {

  // make a copy of the arrays
  let [ accountData, targetData ] = [ [ ...account], [ ...target ] ];

  // the user does not have 1 year of performance on this account. We must
  // shrink the targetData list down to the appropriate size.
  if (accountData[0].date !== targetData[0].date) {
    const startingDate = targetData.findIndex((day) => day.date === accountData[0].date);
    targetData = targetData.slice(startingDate, targetData.length);
  }

  // The ending doesn't match. Need to find out whether to trim account list or target list.
  if (accountData[accountData.length - 1].date !== targetData[targetData.length - 1].date) {
    const adjustAccount = accountData.findIndex((day) => day.date === targetData[targetData.length - 1].date);
    const adjustTarget = targetData.findIndex((day) => day.date === accountData[accountData.length - 1].date);

    if (adjustAccount > -1) {
      accountData = accountData.slice(0, adjustAccount + 1);
    } else {
      targetData = targetData.slice(0, adjustTarget + 1);
    }
  }

  return { accountData, targetData };
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
    return dayPercentGain * accountData[index].net_deposits.amount;
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