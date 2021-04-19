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
    backgroundColor: theme.palette.primary.main,
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
    margin: `${theme.spacing(4)}px 0px`
  }
}));

const Header = (props) => {
  const screen = useScreenSize();
  const classes = styles({ ...props, screen });
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

// Render the appropriate insight based on the index we're at.
const Insight = (props) => React.cloneElement(supportedInsights[props.index], props)

const Insights = AuthenticatedView(props => {
  const classes = styles(props);

  // we will start off on the first insight
  const [ insight, setInsight ] = React.useState(0);

  return (
    <Grid container className={classes.root}>
      <Header setInsight={setInsight} { ...props } />
      <Divider className={classes.divider} />
      <Insight index={insight} {...props}/>
    </Grid>
  )
});

export default Insights;