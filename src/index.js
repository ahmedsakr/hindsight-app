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
      maxHeight: "80%",
    };

    // No size limitations on content if we're on electron app.
    if (props.electron) {
      return {
        ...css,
        width: "85%",
        height: "85%"
      };
    }

    return {
      ...css,
      minWidth: "550px",
      minHeight: "310px",
      maxWidth: "40%",
      padding: theme.spacing(3),
      border: 'dotted 2px gray'
    };
  }
}));

const AppContainer = (props) => {
  
  const classes = styles(props);

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
      <AppContainer electron={true}>

        <Router>
          <Switch>
            <Route path="/otp">
              <OTP />
            </Route>
            <Route path="/">
              <Login />
            </Route>
          </Switch>
        </Router>

      </AppContainer>
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
