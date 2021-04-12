import React from 'react';
import {
  makeStyles,
  Grid,
  Typography,
  useTheme,
  Divider,
  TextField,
  Button
} from '@material-ui/core';
import Logo from '../components/Logo';
import WSIcon from '../assets/ws_logo_green.png';
import WSLogoText from '../assets/ws_text_logo.png';
import { Redirect } from 'react-router';

const styles = makeStyles(theme => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
  },
  header: {
    alignItems: "center",
    flexDirection: "column",
  },
  headerText: {
    margin: 0,
    lineHeight: 1
  },
  wealthsimpleConnect: {
    justifyContent: "center",
  },
  wsLogoIcon: {
    width: 36,
    height: 36,
    borderRadius: 50,
  },
  wsLogoText: {
    height: 36
  },
  divider: {
    height: 1,
    width: "100%",
    backgroundColor: '#3D3939',
    margin: "5% 0px",
  },
  form: {
    marginTop: theme.spacing(2),
    justifyContent: "center"
  },
  formTextfield: {
    margin: `0px ${theme.spacing(1)}px`,
    '& input': {
      color: theme.palette.secondary.main,
      fontSize: 12,
      padding: theme.spacing(1.25),
      border: `solid 2px ${theme.palette.secondary.dark}`,
      borderRadius: 6,
    },
    '& .MuiInputLabel-root': {
      color: theme.palette.secondary.main,
    },
    '& .Mui-focused': {
      color: theme.palette.primary.main
    }
  },
  loginButton: {
    borderRadius: 10,
    color: theme.palette.secondary.main,
    fontWeight: 700,
  },
  loginDisabled: {
    backgroundColor: `${theme.palette.secondary.dark} !important`,
    color: `${theme.palette.secondary.main} !important`
  }
}));

const Header = (props) => {
  const classes = styles(props);
  const theme = useTheme();

  return (
    <Grid container className={classes.header}>
      <Logo full />
      <Typography
        color="secondary"
        variant="h6"
        className={classes.headerText}
        style={{ marginTop: theme.spacing(1) }}
      >
        Insight into your trading behaviours
      </Typography>
    </Grid>
  );
}

const WealthsimpleConnect = (props) => {
  const classes = styles(props);
  const theme = useTheme();

  return (
    <Grid container className={classes.wealthsimpleConnect}>
      <Typography
        variant="h6"
        color='secondary'
      >
        Connect with
      </Typography>
      <Grid
        item
        style={{ marginLeft: theme.spacing(2) }}
      >
        <img src={WSIcon} className={classes.wsLogoIcon} />
        <img src={WSLogoText} className={classes.wsLogoText} />
      </Grid>
    </Grid>
  );
}

const Form = (props) => {

  const classes = styles(props);

  return (
    <Grid container>
      <WealthsimpleConnect />
      <Grid container className={classes.form}> 
        <TextField
          autoFocus
          variant="outlined"
          placeholder="jane@doe.ca"
          color="primary"
          className={classes.formTextfield}
          value={props.credentials.email.value}
          onChange={props.credentials.email.update}
        />
        <TextField
          variant="outlined"
          type="password"
          placeholder="password"
          color="primary"
          className={classes.formTextfield}
          value={props.credentials.password.value}
          onChange={props.credentials.password.update}
        />
        <Button
          variant="contained"
          color="primary"
          className={classes.loginButton}
          disabled={props.credentials.password.value === '' || props.credentials.email.value === ''}
          classes={{
            disabled: classes.loginDisabled
          }}
          onClick={props.login}
        >
          Login ➔
        </Button>
      </Grid>
    </Grid>
  );
}

const Login = (props) => {
  const classes = styles(props);
  const [ email, setEmail ] = React.useState('');
  const [ password, setPassword ] = React.useState('');
  const [ loggedIn, setLoggedIn ] = React.useState(false);

  // trivial redirect to OTP view until the backend service
  // is hooked up to the frontend
  if (loggedIn) {
    return (
      <Redirect to="/otp" />
    );
  }

  return (
    <>
      <Header />
      <Divider className={classes.divider}/>
      <Form
        credentials={{
          email: {
            value: email,
            update: (event) => setEmail(event.target.value),
          },
          password: {
            value: password,
            update: (event) => setPassword(event.target.value),
          }
        }}

        login={() => setLoggedIn(true)}
      />
    </> 
  )
};

export default Login;