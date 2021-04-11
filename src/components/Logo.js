import React from 'react';
import {
  makeStyles,
  Typography
} from '@material-ui/core';
import SVGLogo from '../assets/tradingreflections-logo-png.png';


const styles = makeStyles(theme => ({
  logo: props => ({
    width: props.full ? '80%': 128,
    height: props.full ? '26%': 56
  }),
  logoText: {
    margin: 0,
    lineHeight: 1
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
        style={{ fontWeight: 700 }}
      >
        TradingReflections
      </Typography>
    </>
  )
}

export default Logo;