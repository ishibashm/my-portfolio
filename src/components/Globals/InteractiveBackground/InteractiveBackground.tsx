'use client';

import { useEffect } from 'react';

export const InteractiveBackground = () => {
  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      const { clientX, clientY } = event;
      const x = clientX / window.innerWidth;
      const y = clientY / window.innerHeight;

      document.documentElement.style.setProperty('--mouse-x', x.toString());
      document.documentElement.style.setProperty('--mouse-y', y.toString());
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return null; // このコンポーネントはUIを描画しない
};