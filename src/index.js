import { Grid, makeStyles, ThemeProvider } from '@material-ui/core';
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Login from './views/Login';
import OTP from './views/OTP';
import theme from './theme';

import {
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom';
import Insights from './views/Insights';
import { useScreenSize } from './helpers/screen';
import Loading from './views/Loading';

const styles = makeStyles(theme => ({
  root: props => {

    const css = {
      minHeight: "100vh",
      flexDirection: "column",
      backgroundColor: theme.palette.background.main,
      alignItems: "center",
    };

    if (!props.electron) {
      css.justifyContent = "center";
    }

    return css;
  },
  content: props => {
    const css = {
      margin: "5% 0px",
      position: "absolute",
      backgroundColor: theme.palette.background.main,
    };

    // No size limitations on content if we're on electron app.
    if (props.electron) {
      return {
        ...css,
        width: "85%",
        height: "85%"
      };
    }

    // we're on tablet or mobile phone
    if (props.screen === 'small') {
      return {
        ...css,
        padding: `0px ${theme.spacing(4)}px`,
        minHeight: "100%",
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center'
      }
    }

    // we're on a big screen
    return {
      ...css,
      maxWidth: 1000,
      minWidth: 700,
      padding: theme.spacing(3),
      border: 'dotted 2px gray'
    };
  }
}));

const AppContainer = (props) => {
  const screen = useScreenSize();
  const classes = styles({...props, screen });

  return (
    <Grid container className={classes.root}>
      <Grid className={classes.content}>
        {props.children}
      </Grid>
    </Grid>
  );
};

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <AppContainer electron={process.env.REACT_APP_DESKTOP_APP === 'true'}>

        <Router>
          <Switch>
            <Route path="/insights" component={Insights} />
            <Route path="/loading" component={Loading} />
            <Route path="/otp" component={OTP} />
            <Route path="/" component={Login} />
          </Switch>
        </Router>

      </AppContainer>
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
