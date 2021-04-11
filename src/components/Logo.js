import React from 'react';
import { makeStyles } from '@material-ui/core';
import SVGLogo from '../assets/tradingreflections-logo.svg';


const styles = makeStyles(theme => ({
  logo: props => ({
    width: '60%',
    height: 'auto'
  })
}));

const Logo = (props) => {
  const classes = styles(props);

  return (
    <img src={SVGLogo} className={classes.logo}/>
  )
}

export default Logo;