import React from 'react';
import {
  makeStyles,
  Grid,
  Typography
} from '@material-ui/core';

const styles = makeStyles(theme => ({
  root: {
    width: "100%",
    height: "100%",
  },
}));

const Insights = (props) => {
  const classes = styles(props);

  return (
    <Grid container className={classes.root}>
      <Typography
        variant="h2"
        color="secondary"
      >
        Logged in Successfully!
      </Typography>
    </Grid>
  )
}

export default Insights;