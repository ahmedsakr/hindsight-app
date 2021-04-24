import React from 'react';
import {
  makeStyles,
  Grid,
  Typography
} from '@material-ui/core';
import { useScreenSize } from '../../../helpers/screen';

const styles = makeStyles(theme => ({
  root: props => ({
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: "center",
    flex: 1,
    padding: props.screen === 'small' ? `${theme.spacing(4)}px 0px` : 0,
  }),
}));

const StackedActivities = (props) => {
  const screen = useScreenSize();
  const classes = styles({ ...props, screen });

  return (
    <Grid container className={classes.root}>
      <Typography
        variant="h4"
        color="secondary"
      >
        Welcome to StackedActivities!
      </Typography>
    </Grid>
  );
}

export default StackedActivities;