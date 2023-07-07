import React, { useEffect, useContext } from 'react';
import alanBtn from '@alan-ai/alan-sdk-web';

import { ColorModeContext } from '../utils/ToggleColorMode';
import { fetchToken } from '../utils';

const useAlan = () => {
  const { setMode } = useContext(ColorModeContext);

  useEffect(() => {
    alanBtn({
      key: '00152b199e239d45b1c70f624b3ef88b2e956eca572e1d8b807a3e2338fdd0dc/stage',
      onCommand: ({ command, mode }) => {
        if (command === 'changeMode') {
          if (mode === 'light') {
            setMode('light');
          } else {
            setMode('dark');
          }
        }
        if (command === 'login') {
          fetchToken();
        } else if (command === 'logout') {
          localStorage.clear();

          window.location.href = '/';
        }
      },
    });
  }, []);
};

export default useAlan;
