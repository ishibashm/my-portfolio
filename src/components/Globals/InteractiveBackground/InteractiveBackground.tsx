'use client';
import React from 'react';
import './InteractiveBackground.css';

export const InteractiveBackground = () => {
  return (
    <div className="mesh-container">
      <div className="gradient-blob gradient-blob-1"></div>
      <div className="gradient-blob gradient-blob-2"></div>
      <div className="gradient-blob gradient-blob-3"></div>
      <div className="gradient-blob gradient-blob-4"></div>
      <div className="gradient-blob gradient-blob-5"></div>
      <div className="noise-overlay"></div>
    </div>
  );
};