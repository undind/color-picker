import React, { useState } from 'react';
import Colorpicker from './components/Colorpicker';

function App() {
  const [color, setColor] = useState('#ffffff');

  const onChange = (value: string) => {
    setColor(value);
  };

  return (
    <div>
      <div style={{ background: color, width: '267px', height: '267px', marginBottom: '30px' }}></div>
      <Colorpicker value={color} onChange={onChange} solid={true} gradient={true} />
    </div>
  );
}

export default App;
