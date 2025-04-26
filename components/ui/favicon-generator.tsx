"use client";

import React, { useEffect, useRef, useState } from 'react';

// This component is only for development to generate favicon files
// It's not meant to be rendered in the actual app
export function FaviconGenerator() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [dataUrl, setDataUrl] = useState<string>('');
  
  const generateFavicon = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const padding = width * 0.2;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Set background
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, width, height);
    
    // Line styling
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = width * 0.06;
    ctx.lineCap = 'round';
    
    // Draw left angle bracket
    ctx.beginPath();
    ctx.moveTo(padding + width * 0.1, centerY - width * 0.15);
    ctx.lineTo(padding - width * 0.05, centerY);
    ctx.lineTo(padding + width * 0.1, centerY + width * 0.15);
    ctx.stroke();
    
    // Draw right angle bracket
    ctx.beginPath();
    ctx.moveTo(width - padding - width * 0.1, centerY - width * 0.15);
    ctx.lineTo(width - padding + width * 0.05, centerY);
    ctx.lineTo(width - padding - width * 0.1, centerY + width * 0.15);
    ctx.stroke();
    
    // Draw slash in the middle
    ctx.beginPath();
    ctx.moveTo(centerX + width * 0.1, padding - width * 0.1);
    ctx.lineTo(centerX - width * 0.1, height - padding + width * 0.1);
    ctx.stroke();
    
    // Get the image data as a data URL
    const url = canvas.toDataURL('image/png');
    setDataUrl(url);
    
    // Display instructions to save the favicon
    console.log('Favicon generated! Right-click the image and save as favicon.ico');
    
    return url;
  };
  
  useEffect(() => {
    if (canvasRef.current) {
      generateFavicon();
    }
  }, []);
  
  const handleDownload = () => {
    if (!dataUrl) return;
    
    const link = document.createElement('a');
    link.download = 'apple-touch-icon.png';
    link.href = dataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '2rem' }}>
      <h1>Favicon Generator</h1>
      <p>Right-click on the image below and save to use as favicon</p>
      <canvas 
        ref={canvasRef} 
        width={180} 
        height={180} 
        style={{ border: '1px solid #ccc', margin: '2rem 0' }}
      />
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
        <button 
          onClick={generateFavicon}
          style={{
            padding: '0.5rem 1rem',
            background: '#0070f3',
            color: 'white',
            border: 'none',
            borderRadius: '0.25rem',
            cursor: 'pointer'
          }}
        >
          Regenerate Favicon
        </button>
        <button 
          onClick={handleDownload}
          style={{
            padding: '0.5rem 1rem',
            background: '#10b981',
            color: 'white',
            border: 'none',
            borderRadius: '0.25rem',
            cursor: 'pointer'
          }}
        >
          Download PNG
        </button>
      </div>
      <div>
        <p>Instructions:</p>
        <ol>
          <li>Right-click the image above or use the Download PNG button</li>
          <li>Save in your public/icons folder as apple-touch-icon.png</li>
          <li>For favicon.ico, save in your public folder</li>
        </ol>
      </div>
    </div>
  );
} 