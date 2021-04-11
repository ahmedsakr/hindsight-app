import React from 'react';
import { makeStyles, Grid } from '@material-ui/core';
import Logo from '../components/Logo';

const styles = makeStyles(theme => ({
  root: {
    display: 'flex',
    backgroundColor: theme.palette.background.main,
    justifyContent: 'center'
  }
}));



const Login = (props) => {
  const classes = styles(props);

  return (
    <Grid container className={classes.root}>
      Hello World! {process.env.REACT_APP_DESKTOP_APP}
      <Logo />
    </Grid> 
  )
};

export default Login;