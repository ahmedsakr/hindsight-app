import React from 'react';
import {
  makeStyles,
  Grid,
  Typography,
  TextField,
  Button,
  useTheme
} from '@material-ui/core';
import { SideLogo } from '../components/Logo';
import sendLogin from '../services/login';
import { Redirect } from 'react-router';
import { isElectron, useScreenSize } from '../helpers/screen';
import { isMobile } from 'react-device-detect';
import AuthenticatedView from '../helpers/authentication';
import { useOTP } from '../components/login/otp';

const styles = makeStyles(theme => ({
  root: props => ({
    width: "100%",
    height: "100%",
    justifyContent: props.screen === 'small' ? 'center' : 'flex-start',
    padding: `0px ${theme.spacing(4)}px`,
  }),
  content: props => ({
    flexDirection: 'column',
    alignItems: "center",
    marginTop: !isElectron ? theme.spacing(4) : 0,
  }),
  contentBody: props => ({
    width: props.screen === 'small' ? "75%" : "60%",
    textAlign: "center",
    marginTop: theme.spacing(2),
  }),
  otp: props => ({
    flexWrap: "nowrap",
    width: props.screen === 'small' ? "100%" : "75%",
    marginTop: theme.spacing(6)
  }),
  otpField: props => ({
      flexShrink: 1,
      margin: `0px ${theme.spacing(1)}px`,
      '& input': {
        color: theme.palette.secondary.main,
        fontSize: '1.5rem',
        padding: `${theme.spacing(2.5)}px ${theme.spacing(props.screen === 'small' ? 0 : 1.25)}px`,
        borderRadius: 6,
        textAlign: "center"
      },
  }),
  textfieldOverride: {
    border: 'none',
  }
}));

/*
 * React hook for determing the appropriate border color for OTP fields
 * based on the login state.
 */
const useOTPBoxBorder = (login) => {
  const theme = useTheme();
  const [ border, setBorder ] = React.useState(theme.palette.secondary.dark);

  React.useEffect(() => {
    if (login === 'invalid') {
      setBorder('red');
    } else if (login === 'valid') {
      setBorder(theme.palette.primary.main);
    } else {
      setBorder(theme.palette.secondary.dark);
    }
  }, [ login, theme.palette ]);

  return border;
}

const CursorFocusableOtpField = (props) => {
  const screen = useScreenSize();
  const classes = styles({ ...props, screen });
  const ref = React.useRef();

  React.useEffect(() => {
    if (props.otp.focus.state.enabled && props.otp.focus.state.index === props.idx) {
      ref.current.focus();
    }
  }, [ props.otp.focus, props.idx ]);

  return (
    <TextField
      inputRef={ref}
      variant="outlined"
      type={isMobile ? 'number' : 'text' }
      value={props.otp.current[props.idx]}
      onChange={(event) => props.otp.update(props.idx, event.target.value)}
      disabled={props.login !== 'waiting'}
      onFocus={() => {
        if (props.otp.focus.state.enabled && props.otp.focus.state.index !== props.idx) {
          props.otp.focus.disable();
        }
      }}
      InputProps={{
        classes: {
          root: classes.otpField
        },
        style: {
          border: `solid 1px ${props.border}`,
        }
      }}
    />
  );
};

const Form = (props) => {
  const screen = useScreenSize();
  const border = useOTPBoxBorder(props.login);
  const classes = styles({ ...props, screen });

  return (
    <Grid container className={classes.otp}>
      {
        [...Array(props.otp.current.length).keys()].map((idx) => {
          return (
            <CursorFocusableOtpField
              idx={idx}
              key={idx}
              border={border}
              {...props}
            />
          );
        })
      }
    </Grid>
  );
}

const Content = (props) => {
  const screen = useScreenSize();
  const classes = styles({ ...props, screen });

  return (
    <Grid container className={classes.content}>
      <Typography
        variant="h4"
        color="secondary"
        style={{ textAlign: "center" }}
      >
        One-Time Password (OTP)
      </Typography>
      <Typography
        variant="body2"
        color="textSecondary"
        className={classes.contentBody}
      >
        Enter the 6-digit temporary code you received from
        Wealthsimple to complete the login.
      </Typography>
      <Form {...props}/>
      <Button
        variant="outlined"
        color="secondary"
        style={{ marginTop: "5%" }}
        onClick={props.cancel}
      >
        ← Cancel
      </Button>
    </Grid>
  )
}

const OTP = AuthenticatedView(props => {
  const screen = useScreenSize();
  const classes = styles({ ...props, screen });

  const [ login, setLogin ] = React.useState('waiting');
  const [ tokens, setTokens ] = React.useState(null);
  const [ cancel, setCancel ] = React.useState(false);

  // Hook for managing OTP input from user and currently focused box
  const otp = useOTP();

  React.useEffect(() => {
    const otpString = otp.current.join('');

    // Dispatch a login attempt with OTP to finalize the login process
    // A successful login will return the tokens we need to proceed to the
    // loading page.
    const attemptLogin = async () => {
      setLogin('in-progress');
      const credentials = props.location.state;
  
      try {
        const result = await sendLogin(credentials.email, credentials.password, otpString);
        const body = await result.json();
  
        // our login attempt did not succeed
        if (!body.access || !body.refresh || !body.expires) {
          throw new Error("login failed")
        }
  
        setLogin('valid');
        // Wait a second before setting the tokens and moving to loading page
        // this is to allow the user to visually understand the login was successful
        // with the green borders
        setTimeout(() => setTokens(body), 1000);
      } catch {
        // Set invalid login attempt
        setLogin('invalid');
        // Revert back to waiting state after 1 second
        setTimeout(() => {
          otp.reset();
          setLogin('waiting');
        }, 1000);
      }
    }

    // We will only attempt a login when the user has provided a full
    // OTP and no other login is in progress
    if (otpString.length === 6 && login === 'waiting') {
      attemptLogin();
    }
  }, [ otp, login, props.location.state ]);

  // Redirect back to login page if user has cancelled.
  if (cancel) {
    return (
      <Redirect to={{
        pathname: "/",
        state: null
      }}
      />
    );
  }

  // Redirect to insights page on successful login
  if (login === 'valid' && tokens !== null) {
    return (
      <Redirect to={{
        pathname: "/loading",
        state: tokens
      }}
      />
    );
  }

  return (
    <Grid container className={classes.root}>
      <SideLogo />
      <Content
        otp={otp}
        login={login}
        cancel={() => setCancel(true)}
      />
    </Grid>
  );
});

export default OTP;