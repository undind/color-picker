import React from 'react';

const GradientPanel = () => {
  return (
    <div className='gradient-interaction'>
      <div className='gradient-result' style={{ background: 'linear-gradient(rgb(0, 0, 0) 0%, rgb(255, 255, 255) 100%)' }}>
        <div data-mode='linear' className='gradient-mode'></div>
        <div className='gradient-angle'>
          <div style={{ transform: 'rotate(90deg)' }}></div>
        </div>
        <div className='gradient-pos'>
          <div data-pos='tl'></div>
          <div data-pos='tm'></div>
          <div data-pos='tr'></div>
          <div data-pos='l'></div>
          <div data-pos='m'></div>
          <div data-pos='r'></div>
          <div data-pos='bl'></div>
          <div data-pos='bm'></div>
          <div data-pos='br'></div>
        </div>
      </div>
      <div className='gradient-stops'>
        <div
          className='gradient-stop-preview'
          style={{ background: 'linear-gradient(to right, rgb(0, 0, 0) 0%, rgb(255, 255, 255) 100%)' }}
        ></div>
        <div className='gradient-stop-marker'>
          <div className='gradient-marker' style={{ left: '0%', color: 'rgb(0, 0, 0)' }}></div>
          <div className='gradient-marker focused-stop' style={{ left: '100%', color: 'rgb(255, 255, 255)' }}></div>
        </div>
      </div>
    </div>
  );
};

export default GradientPanel;
