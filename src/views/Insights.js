import React from 'react';
import {
  makeStyles,
  Grid,
  Typography,
  Button,
  Divider,
} from '@material-ui/core';
import AuthenticatedView from '../helpers/authentication';
import { SideLogo } from '../components/Logo';

const styles = makeStyles(theme => ({
  root: {
    width: "100%",
    height: "100%",
    flexDirection: "column"
  },
  header: {
    justifyContent: "space-between",
    alignItems: "center"
  },
  headerTitle: {
    display: 'flex',
    alignItems: 'center'
  },
  headerUserName: {
    fontWeight: 700,
    marginLeft: theme.spacing(1),
  },
  navigatingButton: {
    border: `solid 1px ${theme.palette.primary.main}`,
    minWidth: 0,
    fontWeight: 700,
    fontSize: 20,
    padding: `${theme.spacing(0.25)}px ${theme.spacing(1)}px`,
    margin: `0px ${theme.spacing(0.5)}px`
  },
  divider: {
    height: 2,
    width: "100%",
    backgroundColor: theme.palette.secondary.dark,
    marginTop: theme.spacing(4)
  }
}));

const Header = (props) => {
  const classes = styles(props);
  return (
    <Grid container className={classes.header}>
      <SideLogo />
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

      <Grid item>
        <Button
          color="secondary"
          variant="outlined"
          className={classes.navigatingButton}
        >
          {`<`}
        </Button>
        <Button
          color="secondary"
          variant="outlined"
          className={classes.navigatingButton}
        >
          {`>`}
        </Button>
      </Grid>
    </Grid>
  );
}

const Insights = AuthenticatedView(props => {
  const classes = styles(props);

  return (
    <Grid container className={classes.root}>
      <Header { ...props } />
      <Divider className={classes.divider} />
    </Grid>
  )
});

export default Insights;