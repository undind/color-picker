import React, { useState } from 'react';
import Colorpicker from './components/Colorpicker';

function App() {
  const [color, setColor] = useState('radial-gradient(circle at right, rgba(0, 0, 0) 0.00%,rgba(183, 62, 62) 100.00%)');
  // const [color, setColor] = useState('linear-gradient(to top left, rgba(0, 0, 0) 0.00%,rgba(183, 62, 62) 100.00%)');

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
