'use client'

import { useState, useEffect } from 'react';
import Blank from "./components/blank";
import "../app/globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isMobile, setIsMobile] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 1051);
      setIsLoading(false);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);


  if (isLoading) {
    return (
      <html lang="ko">
        <body>
          <div/>
        </body>
      </html>
    );
  }

  return (
    <html lang="ko">
      <body>
        {isMobile ? <Blank /> : children}
      </body>
    </html>
  );
}