import React from 'react';
import {
  makeStyles,
  Grid,
  Typography,
  LinearProgress
} from '@material-ui/core';
import { SideLogo } from '../components/Logo';
import { isElectron, useScreenSize } from '../helpers/screen';
import { Redirect } from 'react-router';
import fetchInsightsData from '../services/insights';
import AuthenticatedView from '../helpers/authentication';

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
  title: {
    textAlign: "center"
  },
  contentBody: props => ({
    width: props.screen === 'small' ? "75%" : "40%",
    textAlign: "center"
  }),
  progressBar: props => ({
    height: 5,
    width: props.screen === 'small' ? "75%" : "50%",
    marginBottom: theme.spacing(4),
    marginTop: theme.spacing(2),
    backgroundColor: theme.palette.primary.main
  }),
}));

const Loading = AuthenticatedView(props => {
  const screen = useScreenSize();
  const classes = styles({ ...props, screen });
  const [ accountData, setAccountData ] = React.useState(null);

  // Fetch all data we require to generate insights from Wealthsimple Trade servers
  React.useEffect(() => {
    fetchInsightsData(props.location.state)
    .then((response) => response.json())
    .then(setAccountData)
  }, [ props.location.state ]);

  // redirect to insights once we have received the payload from Wealthsimple
  if (accountData) {
    return (
      <Redirect
        to={{
          pathname: "/insights",
          state: accountData
        }}
      />
    );
  }

  return (
    <Grid container className={classes.root}>
      <SideLogo />
      <Grid container className={classes.content}>
        <Typography
          variant="h4"
          color="secondary"
          className={classes.title}
        >
          Preparing your insights
        </Typography>
        <LinearProgress color="primary" className={classes.progressBar} />
        <Typography
          variant="body2"
          color="textSecondary"
          className={classes.contentBody}
        >
          Hang tight! We are fetching the data we need to generate pretty graphs
          for you!
        </Typography>
      </Grid>
    </Grid>
  );
});

export default Loading;