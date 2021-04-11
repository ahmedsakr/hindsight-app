import React from 'react';
import {
  makeStyles,
  Grid,
  Typography
} from '@material-ui/core';
import Logo from '../components/Logo';

const styles = makeStyles(theme => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column'
  },
  header: {
    alignItems: "center",
    flexDirection: "column"
  },
  headerText: {
    margin: 0,
    lineHeight: 1
  }
}));

const Header = (props) => {
  const classes = styles(props);

  return (
    <Grid container className={classes.header}>
      <Typography
        color="primary"
        variant="h2"
        className={classes.headerText}
      >
        TradingReflections
      </Typography>
      <Typography
        color="secondary"
        variant="h6"
        className={classes.headerText}
      >
        Insight into your trading behaviour
      </Typography>
    </Grid>
  );
}

const WealthsimpleConnect = (props) => {
  
}

const Login = (props) => {
  const classes = styles(props);

  return (
    <Grid container className={classes.root}>
      <Logo full />
      <Header />
    </Grid> 
  )
};

export default Login;