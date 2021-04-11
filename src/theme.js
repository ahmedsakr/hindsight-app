import { createMuiTheme } from '@material-ui/core';

const Theme = createMuiTheme({
  palette: {
    background: {
      main: '#0F0F0F'
    },
    primary: {
      main: 'rgb(19,211,142, 0.7)'
    },
    secondary: {
      main: '#fff',
      dark: '#2A2A2A'
    }
  },
});

export default Theme;