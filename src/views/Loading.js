import React from 'react';
import {
  makeStyles,
  Grid,
  Typography,
  Divider
} from '@material-ui/core';
import { SideLogo } from '../components/Logo';
import { isElectron, useScreenSize } from '../helpers/screen';

const styles = makeStyles(theme => ({
  root: props => ({
    width: "100%",
    height: "100%",
    justifyContent: props.screen === 'small' ? 'center' : 'flex-start',
  }),
  content: {
    alignItems: "center",
    flexDirection: "column",
    marginTop: !isElectron ? theme.spacing(4) : 0,
  },
  progressBar: {
    height: 5,
    backgroundColor: theme.palette.secondary.main,
    width: "50%",
    margin: `${theme.spacing(4)}px 0px`
  }
}));

const Loading = (props) => {
  const screen = useScreenSize();
  const classes = styles({ ...props, screen });

  return (
    <Grid container className={classes.root}>
      <SideLogo />
      <Grid container className={classes.content}>
        <Typography
          variant="h4"
          color="secondary"
        >
          Getting things ready
        </Typography>
        <Divider className={classes.progressBar} />
        <Typography
          variant="body2"
          color="textSecondary"
          className={classes.contentBody}
        >
          We're fetching the data we need to generate pretty graphs
          for you!
        </Typography>
      </Grid>
    </Grid>
  );
}

export default Loading;