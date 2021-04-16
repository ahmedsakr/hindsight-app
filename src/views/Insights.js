import React from 'react';
import {
  makeStyles,
  Grid,
  Typography
} from '@material-ui/core';
import { Redirect } from 'react-router';

const styles = makeStyles(theme => ({
  root: {
    width: "100%",
    height: "100%",
  },
}));

const Insights = (props) => {
  const classes = styles(props);

  // Move back to the login page if we don't have tokens
  // (user might have manually navigated to this view)
  if (!props.location.state) {
    return (
      <Redirect
        to={{
          pathname: "/"
        }}
      />
    );
  }

  return (
    <Grid container className={classes.root}>
      <Typography
        variant="h2"
        color="secondary"
      >
        Welcome, {props.location.state.user.first_name}!
      </Typography>
    </Grid>
  )
}

export default Insights;