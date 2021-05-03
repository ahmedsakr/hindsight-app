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
import sendLogin from '../services/login';
import { useScreenSize } from '../helpers/screen';

const styles = makeStyles(theme => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: "center",
    padding: `0px ${theme.spacing(4)}px`,
  },
  header: {
    alignItems: "center",
    flexDirection: "column",
  },
  headerText: {
    margin: 0,
    lineHeight: 1
  },
  wealthsimpleConnect: props => ({
    flexDirection: props.screen === 'small' ? 'column' : 'row',
    alignItems: 'center',
    justifyContent: "center",
  }),
  wsLogo: props => ({
    marginLeft: props.screen === 'small' ? 0 : theme.spacing(2),
  }),
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
  form: props => ({
    marginTop: theme.spacing(2),
    justifyContent: "center",
    flexDirection: props.screen === 'small' ? 'column' : 'row',
  }),
  formTextfield: props => ({
    margin: props.screen === 'small' ? `${theme.spacing(1)}px 0px` : `0px ${theme.spacing(1)}px`,
    '& input': {
      color: theme.palette.secondary.main,
      fontSize: props.screen === 'small' ? 16 : 12,
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
  }),
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
        Discover your trading behaviours
      </Typography>
    </Grid>
  );
}

const WealthsimpleConnect = (props) => {
  const screen = useScreenSize();
  const classes = styles({ ...props, screen });

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
        className={classes.wsLogo}
      >
        <img src={WSIcon} className={classes.wsLogoIcon} alt="Wealthsimple Trade circle logo" />
        <img src={WSLogoText} className={classes.wsLogoText} alt="Wealthsimple Trade text logo" />
      </Grid>
    </Grid>
  );
}

const Form = (props) => {
  const screen = useScreenSize();
  const classes = styles({ ...props, screen });

  return (
    <Grid container>
      <WealthsimpleConnect />
      <Grid container className={classes.form}> 
        <TextField
          autoFocus
          variant="outlined"
          type="email"
          placeholder="jane@doe.ca"
          color="primary"
          className={classes.formTextfield}
          value={props.credentials.email.value}
          onChange={props.credentials.email.update}
          error={props.loginState === 'invalid'}
          disabled={props.loginState === 'in-progress'}
        />
        <TextField
          variant="outlined"
          type="password"
          placeholder="password"
          color="primary"
          className={classes.formTextfield}
          value={props.credentials.password.value}
          onChange={props.credentials.password.update}
          disabled={props.loginState === 'in-progress'}
          onKeyPress={(event) => {
            if (event.key === 'Enter') {
              props.login();
            }
          }}
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
  const [ loginState, setLoginState ] = React.useState('waiting');

  // trivial redirect to OTP view until the backend service
  // is hooked up to the frontend
  if (loginState === 'done') {
    return (
      <Redirect to={{
        pathname: "/otp",
        state: {
          email,
          password
        }
      }}
      />
    );
  }

  return (
    <Grid container className={classes.root}>
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

        login={async () => {

          // check emaill format validity
          if (!email.match(/.+@.+\..+/)) {
            setLoginState('invalid');
            setTimeout(() => setLoginState('waiting'), 1000);
            return;
          }

          // start login process
          setLoginState('in-progress');
          // this will always fail because OTP is not being provided; however,
          // this must be done to trigger an OTP dispatch from Wealthsimple
          await sendLogin(email, password).catch(() => {});
          // move the user to the OTP page
          setLoginState('done');
        }}

        loginState={loginState}
      />
    </Grid> 
  )
};

export default Login;