import React from 'react';
import {
  makeStyles,
  Typography,
  Grid
} from '@material-ui/core';
import SVGLogo from '../assets/tradingreflections-logo-png.png';


const styles = makeStyles(theme => ({
  logo: props => ({
    width: props.full ? '80%': 156,
    height: props.full ? '26%': 69
  }),
  sideLogo: {
    flexDirection: 'column',
    width: "auto"
  },
  logoText: {
    margin: 0,
    lineHeight: 1,
    fontWeight: 700,
    textAlign: "center"
  }
}));

const Logo = (props) => {
  const classes = styles(props);

  return (
    <>
      <img src={SVGLogo} className={classes.logo}/>
      <Typography
        color="primary"
        variant={props.full ? "h2" : "h6"}
        className={classes.logoText}
      >
        Hindsight
      </Typography>
    </>
  )
}

export const SideLogo = (props) => {
  const classes = styles(props);

  return (
    <Grid container className={classes.sideLogo}>
      <Logo {...props} />
    </Grid>
  );
}

export default Logo;