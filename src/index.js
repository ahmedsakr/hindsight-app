import { Grid, makeStyles, ThemeProvider } from '@material-ui/core';
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Login from './views/login';
import theme from './theme';

const styles = makeStyles(theme => ({
  root: props => {
    console.log(props)
    const css = {
      width: "100%",
      height: "100vh",
    };

    // we need to position the content in the middle if we're on the web
    // Otherwise (on electron app), we simply use the whole canvas.
    if (!props.electron) {
      css.justifyContent = "center";
      css.alignItems = "center";
    }

    return css;
  },
  content: props => {

    // No size limitations on content if we're on electron app.
    if (props.electron) {
      return {};
    }

    return {
      maxWidth: "40%",
      minHeight: "60%",
      maxHeight: "80%"
    };
  }
}));

const AppContainer = (props) => {
  
  const classes = styles(props);

  return (
    <Grid container className={classes.root}>
      <Grid container className={classes.content}>
        {props.children}
      </Grid>
    </Grid>
  );
};

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <AppContainer electron={process.env.REACT_APP_DESKTOP_APP === 'true'}>
        <Login />
      </AppContainer>
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
