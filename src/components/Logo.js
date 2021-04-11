import React from 'react';
import { makeStyles } from '@material-ui/core';
import SVGLogo from '../assets/tradingreflections-logo-png.png';


const styles = makeStyles(theme => ({
  logo: props => ({
    width: props.full ? '80%': 128,
    height: props.full ? '26%': 56
  })
}));

const Logo = (props) => {
  const classes = styles(props);

  return (
    <img src={SVGLogo} className={classes.logo}/>
  )
}

export default Logo;