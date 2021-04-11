import React from 'react';
import { makeStyles, SvgIcon } from '@material-ui/core';
import SVGLogo from '../assets/tradingreflections-logo.svg';


const styles = makeStyles(theme => ({
  logo: props => ({

  })
}));

const Logo = (props) => {
  const classes = styles(props);

  return (
    <SvgIcon component={SVGLogo} className={classes.logo}/>
  )
}

export default Logo;