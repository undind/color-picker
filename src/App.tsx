import React, { useState } from 'react';
import Colorpicker from './components/Colorpicker';

function App() {
  // const [color, setColor] = useState('linear-gradient(180deg, rgba(0, 0, 0, 1) 0.00%,rgba(35, 64, 202, 1) 100.00%)');
  const [color, setColor] = useState('linear-gradient(to top left,#fff 0%,#000 50%,#000 70%,#000 100%)');
  // const [color, setColor] = useState('#1d0c93');

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
