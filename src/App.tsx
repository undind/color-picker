import React, { useState } from 'react';
import Colorpicker from './components/Colorpicker';

function App() {
  const [color, setColor] = useState('#ffffff');
  const [color2, setColor2] = useState('#ffffff');
  console.log(color);
  console.log(color2);
  const onChange = (value: string) => {
    setColor(value);
  };

  const onChange2 = (value: string) => {
    setColor2(value);
  };

  return (
    <div style={{ display: 'flex' }}>
      <div style={{ background: color, width: '267px', height: '267px', marginBottom: '30px' }}></div>
      <Colorpicker value={color} onChange={onChange} solid={true} gradient={true} />

      <Colorpicker value={color2} onChange={onChange2} solid={false} gradient={true} />
    </div>
  );
}

export default App;
