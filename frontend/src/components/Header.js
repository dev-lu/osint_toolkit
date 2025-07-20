import React from 'react';
import ot_logo_light from '../images/ot_logo_light.png';
import ot_logo_dark from '../images/ot_logo_dark.png';
import { useTheme } from '@mui/material/styles';

function Header() {
  const theme = useTheme();

  return (
    <div>
      <img
        src={theme.palette.mode === 'dark' ? ot_logo_dark : ot_logo_light}
        height={60}
        alt="OSINT Toolkit logo"
      />
    </div>
  )
}

export default Header
