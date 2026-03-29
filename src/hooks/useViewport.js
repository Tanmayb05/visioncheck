import { useEffect, useState } from 'react';

function getViewportState() {
  if (typeof window === 'undefined') {
    return {
      width: 480,
      height: 800,
      isSmallPhone: false,
      isPhone: true,
      isTablet: false,
      isDesktop: false,
      shellMaxWidth: 480,
    };
  }

  const width = window.innerWidth;
  const height = window.innerHeight;
  const isSmallPhone = width < 360;
  const isPhone = width < 768;
  const isTablet = width >= 768 && width < 1200;
  const isDesktop = width >= 1200;

  let shellMaxWidth = 480;
  if (isTablet) {
    shellMaxWidth = 720;
  } else if (isDesktop) {
    shellMaxWidth = 960;
  }

  return {
    width,
    height,
    isSmallPhone,
    isPhone,
    isTablet,
    isDesktop,
    shellMaxWidth,
  };
}

export function useViewport() {
  const [viewport, setViewport] = useState(getViewportState);

  useEffect(() => {
    const handleResize = () => {
      setViewport(getViewportState());
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, []);

  return viewport;
}
