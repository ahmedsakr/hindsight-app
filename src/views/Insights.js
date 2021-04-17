import React from 'react';
import {
  makeStyles,
  Grid,
  Typography
} from '@material-ui/core';
import AuthenticatedView from '../helpers/authentication';

const styles = makeStyles(theme => ({
  root: {
    width: "100%",
    height: "100%",
  },
}));

const Insights = AuthenticatedView(props => {
  const classes = styles(props);

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
});

export default Insights;