import React from 'react';
import {
  makeStyles,
  Grid,
  Typography,
  TextField
} from '@material-ui/core';
import Logo, { SideLogo } from '../components/Logo';

const styles = makeStyles(theme => ({
  root: {
    width: "100%",
    height: "100%"
  },
  content: {
    flexDirection: 'column',
    alignItems: "center"
  },
  contentBody: {
    width: "60%",
    textAlign: "center",
    marginTop: theme.spacing(2),
  },
  otp: {
    flexWrap: "nowrap",
    width: "50%",
    marginTop: theme.spacing(4)
  },
  otpField: {
    flexShrink: 1,
    margin: `0px ${theme.spacing(1)}px`,
    '& input': {
      color: theme.palette.secondary.main,
      fontSize: '1.5rem',
      padding: `${theme.spacing(2.5)}px ${theme.spacing(1.25)}px`,
      border: `solid 2px ${theme.palette.secondary.dark}`,
      borderRadius: 6,
      textAlign: "center"
    },
  }
}));

const CursorFocusableOtpField = (props) => {
  const classes = styles(props);
  const ref = React.useRef();

  React.useEffect(() => {
    if (props.otpFocus.state.enabled && props.otpFocus.state.index === props.idx) {
      ref.current.focus();
    }
  }, [ props.otpFocus ]);

  return (
    <TextField
      inputRef={ref}
      variant="outlined"
      className={classes.otpField}
      value={props.otp.current[props.idx]}
      onChange={(event) => props.otp.update(props.idx, event.target.value)}
      onMouseDown={() => {
        if (props.otpFocus.state.enabled) {
          props.otpFocus.disable();
        }
      }}
    />
  );
};

const Form = (props) => {
  const classes = styles(props);
  return (
    <Grid container className={classes.otp}>
      {
        [...Array(props.otp.current.length).keys()].map((idx) => <CursorFocusableOtpField idx={idx} {...props} />)
      }
    </Grid>
  );
}

const Content = (props) => {
  const classes = styles(props);

  return (
    <Grid container className={classes.content}>
      <Typography
        variant="h4"
        color="secondary"
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
      <Form otp={props.otp} otpFocus={props.otpFocus} />
    </Grid>
  )
}


const OTP = (props) => {
  const classes = styles(props);
  const [ otp, setOtp ] = React.useState(['', '', '', '', '', '']);
  const [ otpFocus, setOtpFocus ] = React.useState({ enabled: true, index: 0 });
  return (
    <Grid container className={classes.root}>
      <SideLogo />
      <Content
        otp={{
          current: otp,
          update: (index, value) => {
            if (value === '' || (otp[index] === '' && value.match(/[0-9]/))) {
              const copy = [...otp];
              copy[index] = value;

              setOtp(copy);

              if (otpFocus.enabled) {
                setOtpFocus({ ...otpFocus, index: otpFocus.index + 1 });
              }
            }
          }
        }}

        otpFocus={{
          state: otpFocus,
          disable: () => setOtpFocus({ ...otpFocus, enabled: false })
        }}
      />
    </Grid>
  );
};

export default OTP;