import React, { useState } from 'react';
import Colorpicker from './components/Colorpicker';

function App() {
  // const [color, setColor] = useState('radial-gradient(circle at right, rgb(255, 255, 255) 0.00%,rgb(0, 0, 0) 50.00%,red 100.00%)');
  // const [color, setColor] = useState('linear-gradient(90deg, #fff 0.00%, #000 50.00%, #000 70.00%, red 100.00%)');
  const [color, setColor] = useState('hsla(0, 100%, 50%, 0.5)');

  const onChange = (value: string) => {
    setColor(value);
    console.log(value);
  };

  return (
    <div style={{ display: 'flex' }}>
      <div style={{ background: color, width: '267px', height: '267px', marginBottom: '30px' }}></div>
      <Colorpicker value={color} onChange={onChange} solid={true} gradient={true} />
    </div>
  );
}

export default App;
