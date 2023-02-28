import React from 'react';
import ot_logo from '../images/ot_logo.png';


function Header() {
  return (
    <div>
      <img src={ot_logo} height={100} alt="OSINT Toolkit logo"/>
    </div>
  )
}

export default Header