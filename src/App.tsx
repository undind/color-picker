import React from 'react';
import Colorpicker from './components/Colorpicker';

function App() {
  const onChange = (value: string) => {
    console.log(value);
  };

  return (
    <div>
      <Colorpicker value='#ffffff' onChange={onChange} />
    </div>
  );
}

export default App;
