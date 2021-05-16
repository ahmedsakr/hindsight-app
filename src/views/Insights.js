import React, {
  useCallback,
  useEffect,
  useState,
} from 'react';
import {
  makeStyles,
  Grid,
  Typography,
  Button,
  Divider,
} from '@material-ui/core';
import AuthenticatedView from '../helpers/authentication';
import { SideLogo } from '../components/Logo';
import { supportedInsights } from '../components/insights/supported';
import { useScreenSize } from '../helpers/screen';
import Dropdown from '../stories/input/Dropdown';

const styles = makeStyles(theme => ({
  root: {
    width: "100%",
    height: "100%",
    flexDirection: "column"
  },
  header: props => ({
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: props.screen === 'small' ? 'column' : 'row',
    '& > *': {
      margin: props.screen === 'small' ? `${theme.spacing(1)}px 0px` : 0,
    }
  }),
  headerMiddle: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    flex: 4,
  },
  headerTitle: {
    display: 'flex',
    alignItems: 'center',
  },
  headerUserName: {
    fontWeight: 700,
    marginLeft: theme.spacing(1),
  },
  navigation: {
    flex: 1,
    display: 'flex',
    justifyContent: 'flex-end',
  },
  navigatingButton: {
    border: `solid 1px ${theme.palette.primary.main}`,
    backgroundColor: theme.palette.primary.main,
    minWidth: 0,
    fontWeight: 700,
    fontSize: 20,
    padding: `${theme.spacing(0.25)}px ${theme.spacing(1)}px`,
    margin: `0px ${theme.spacing(0.5)}px`,
  },
  navigationDisabled: {
    backgroundColor: theme.palette.text.secondary,
  },
  divider: {
    height: 2,
    width: "100%",
    backgroundColor: theme.palette.secondary.dark,
    margin: `${theme.spacing(4)}px 0px`
  },
  dropdown: {
    border: `solid 2px ${theme.palette.secondary.dark}`,
    borderRadius: 6,
    padding: `0px ${theme.spacing(1.5)}px`,
    marginTop: theme.spacing(1),
    color: theme.palette.secondary.main
  },
  dropdownOverride: {
    backgroundColor: theme.palette.background.light,
    color: theme.palette.secondary.main
  },
  selectIcon: {
    color: theme.palette.secondary.main
  },
  dropdowns: {
    display: 'flex',
    '& > *': {
      margin: `0px ${theme.spacing(0.5)}px`
    }
  }
}));

const allowedDateRanges = {
  'tfsa': [ '1m', '3m', '1y', 'all'],
  'personal': [ '1m', '3m', '1y', 'all' ],
  'rrsp': [ '1m', '3m', '1y', 'all' ],
  'crypto': [ '1m', '3m', '1y' ]
}

const accountNames = {
  'tfsa': 'TFSA',
  'personal': 'Personal',
  'rrsp': 'RRSP',
  'crypto': 'Crypto'
};

const Header = (props) => {
  const screen = useScreenSize();
  const classes = styles({ ...props, screen });
  const displayAccounts = Object.keys(props.location.state.performance).map((account) => accountNames[account]);

  return (
    <Grid container className={classes.header}>
      <Grid item style={{ flex: 1, }}>
        <SideLogo />
      </Grid>

      <Grid item className={classes.headerMiddle}>
        <Grid item className={classes.headerTitle}>
          <Typography
            variant="h5"
            color="secondary"
          >
            Insights for
          </Typography>
          <Typography
            color="primary"
            variant="h5"
            className={classes.headerUserName}
          >
            {props.location.state.user.first_name}
          </Typography>
        </Grid>
        <Grid item className={classes.dropdowns}>
          <Dropdown
            options={displayAccounts}
            selected={props.account}
            onSelect={(event) => props.setAccount(event.target.value)}
          />
          <Dropdown
            options={allowedDateRanges[props.account.toLowerCase()]}
            selected={props.dateRange}
            onSelect={(event) => props.setDateRange(event.target.value)}
          />
        </Grid>
      </Grid>
      <Grid item className={classes.navigation}>
        <Button
          color="secondary"
          variant="outlined"
          className={classes.navigatingButton}
          disabled={!props.navigation.current.back}
          classes={{ disabled: classes.navigationDisabled }}
          onClick={props.navigation.previous}
        >
          {`<`}
        </Button>
        <Button 
          color="secondary"
          variant="outlined"
          className={classes.navigatingButton}
          disabled={!props.navigation.current.forward}
          classes={{ disabled: classes.navigationDisabled }}
          onClick={props.navigation.next}
        >
          {`>`}
        </Button>
      </Grid>
    </Grid>
  );
}

// Render the appropriate insight based on the index we're at.
const Insight = (props) => React.cloneElement(supportedInsights[props.index], props);

/**
 * useNavigation hook controls the state of selected insight and
 * restricts whether the user can go back or next in the list
 * of insights.
 */
const useNavigation = () => {
  const [ navigation, setNavigation ] = useState({
    index: 0,
    back: false,
    forward: supportedInsights.length > 1
  });

  const next = useCallback(
    () => setNavigation({
      index: navigation.index + 1,
      back: true,
      forward: navigation.index + 1 !== supportedInsights.length - 1
    }),
    [navigation.index]
  );

  const previous = useCallback(
    () => setNavigation({
      index: navigation.index - 1,
      back: navigation.index - 1 !== 0,
      forward: true
    }),
    [navigation.index]
  );

  return {
    current: navigation,
    next,
    previous
  };
}

const Insights = AuthenticatedView(props => {
  const classes = styles(props);
  const data = props.location.state;

  const [ account, setAccount ] = useState(accountNames[Object.keys(data.performance)[0]]);
  const [ dateRange, setDateRange ] = useState('1y');
  const navigation = useNavigation();

  useEffect(() => {
    // we don't allow 'all-time' for crypto yet.
    if (account === 'Crypto' && dateRange === 'all') {
      setDateRange('1y');
    }
  }, [ account, dateRange ]);

  return (
    <Grid container className={classes.root}>
      <Header
        account={account}
        dateRange={dateRange}
        setAccount={setAccount}
        setDateRange={setDateRange}
        navigation={navigation}
        { ...props }
      />
      <Divider className={classes.divider} />
      <Insight
        index={navigation.current.index}
        account={account.toUpperCase()}
        dateRange={dateRange}
        {...props}/>
    </Grid>
  )
});

export default Insights;