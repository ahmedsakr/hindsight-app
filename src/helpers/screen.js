import { useMediaQuery } from '@material-ui/core';
import { useState } from 'react';

export const isElectron = process.env.REACT_APP_DESKTOP_APP === 'true';

/**
 * Tracks the size of the screen on a bimodal level: small or regular.
 * This is good enough for the application.
 *
 * @returns 'small' if the width is smaller than 1024px; 'regular' otherwise.
 */
export const useScreenSize = () => {
  const isBigScreen = useMediaQuery('(min-width:1024px');
  const [ screen, setScreen ] = useState(isElectron ? 'regular' : 'small');

  if (isElectron && screen === 'regular') {
    return screen;
  }

  if (isElectron && screen !== 'regular') {
    setScreen('regular');
  } else if (screen !== 'regular' && isBigScreen) {
    setScreen('regular');
  } else if (screen !== 'small' && !isBigScreen) {
    setScreen('small');
  }

  return screen;
}
