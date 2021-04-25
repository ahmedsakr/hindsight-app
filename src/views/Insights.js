import React from 'react';
import {
  makeStyles,
  Grid,
  Typography,
  Button,
  Divider,
  Select,
  MenuItem,
} from '@material-ui/core';
import AuthenticatedView from '../helpers/authentication';
import { SideLogo } from '../components/Logo';
import { supportedInsights } from '../components/insights/supported';
import { useScreenSize } from '../helpers/screen';

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
          <Select
              value={props.account}
              onChange={(event) => props.setAccount(event.target.value)}
              className={classes.dropdown}
              classes={{
                icon: classes.selectIcon
              }}
            >
              {
                Object.keys(props.location.state.performance).map((account, id) => {
                  return (
                    <MenuItem
                      selected={true}
                      key={id}
                      value={account}
                    >
                      {accountNames[account]}
                    </MenuItem>
                  );
                })
              }
          </Select>
          <Select
              value={props.dateRange}
              onChange={(event) => props.setDateRange(event.target.value)}
              className={classes.dropdown}
              classes={{
                icon: classes.selectIcon
              }}
            >
              {
                allowedDateRanges[props.account].map((date, id) => {
                  return (
                    <MenuItem
                      selected={true}
                      key={id}
                      value={date}
                    >
                      {date}
                    </MenuItem>
                  );
                })
              }
          </Select>
        </Grid>

      </Grid>
      <Grid item className={classes.navigation}>
        <Button
          color="secondary"
          variant="outlined"
          className={classes.navigatingButton}
          disabled={!props.navigation.current.back}
          classes={{ disabled: classes.navigationDisabled }}
          onClick={props.navigation.previousInsight}
        >
          {`<`}
        </Button>
        <Button
          color="secondary"
          variant="outlined"
          className={classes.navigatingButton}
          disabled={!props.navigation.current.forward}
          classes={{ disabled: classes.navigationDisabled }}
          onClick={props.navigation.nextInsight}
        >
          {`>`}
        </Button>
      </Grid>
    </Grid>
  );
}

// Render the appropriate insight based on the index we're at.
const Insight = (props) => React.cloneElement(supportedInsights[props.index], props)

const Insights = AuthenticatedView(props => {
  const classes = styles(props);
  const data = props.location.state;

  // we will start off on the first insight
  const [ insight, setInsight ] = React.useState(0);
  const [ account, setAccount ] = React.useState(Object.keys(data.performance)[0]);
  const [ dateRange, setDateRange ] = React.useState('1y');
  const [ navigation, setNavigation ] = React.useState({
    back: false,
    forward: supportedInsights.length - 1 > insight
  });

  React.useEffect(() => {
    // we don't allow 'all-time' for crypto yet.
    if (account === 'crypto' && dateRange === 'all') {
      setDateRange('1y');
    }
  }, [ account, dateRange ]);

  return (
    <Grid container className={classes.root}>
      <Header
        account={account}
        dateRange={dateRange}
        setAccount={setAccount}
        setInsight={setInsight}
        setDateRange={setDateRange}
        navigation={{
          current: navigation,
          nextInsight: () => {
            setInsight(insight + 1);
            setNavigation({
              back: true,
              forward: insight + 1 !== supportedInsights.length - 1
            });
          },
          previousInsight: () => {
            setInsight(insight - 1);
            setNavigation({
              back: insight - 1 !== 0,
              forward: true
            });  
          }
        }}
        { ...props }
      />
      <Divider className={classes.divider} />
      <Insight
        index={insight}
        account={account.toUpperCase()}
        dateRange={dateRange}
        {...props}/>
    </Grid>
  )
});

export default Insights;