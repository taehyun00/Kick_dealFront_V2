'use client'

import Header from "./components/header";
import React, { useState, useEffect } from 'react';
import Blank from "./components/blank";
import Main from "./Main/page";

const App = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 1051);
    };


    checkScreenSize();

    window.addEventListener('resize', checkScreenSize);

    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);


  return isMobile ? <Blank /> : <Main />;
};

export default App;