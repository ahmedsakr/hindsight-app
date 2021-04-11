import { Grid, makeStyles, ThemeProvider } from '@material-ui/core';
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Login from './views/Login';
import theme from './theme';

const styles = makeStyles(theme => ({
  root: {
    width: "100%",
    minHeight: "100vh",
    backgroundColor: theme.palette.background.main,
    justifyContent: "center",
    alignItems: "center"
  },
  content: props => {
    const css = {
      margin: "5% 0px",
    };

    // No size limitations on content if we're on electron app.
    if (props.electron) {
      return {
        ...css,
        maxWidth: "80%"
      };
    }

    return {
      ...css,
      minWidth: "550px",
      maxWidth: "40%",
      maxHeight: "80%",
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
        <Login />
      </AppContainer>
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
