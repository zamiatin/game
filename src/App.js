import React, { useState, useMemo } from 'react';
import './App.css';
import { generateLayout, updateLayout, openHoles, HOLE_TYPE, SIMPLE_TYPE } from './utils';

const width = 5;
const height = 5;
const blackHoles = 5;

const cellSize = 50;

function App() {
  const [layout, setLayout] = useState(generateLayout(width, height, blackHoles));

  const handleClick = (obj) => {
    if (Object.values(obj)[0].type === SIMPLE_TYPE) {
      setLayout((layout) => updateLayout(layout, obj));
    } else {
      setLayout((layout) => openHoles(layout));
    }
  }

  const renderLayout = useMemo(() => layout.map((item) => {
      const obj = Object.values(item)[0];
      return (
        <div
          className={`item ${obj.isOpen ? 'open' : ''}`}
          key={Object.keys(item)[0]}
          onClick={() => handleClick(item)}>
            {obj.type === HOLE_TYPE ? 'H' : obj.adjacentCount}
        </div>)
    }), [layout]);

  return (
      <div className="App">
        <div
          className="Grid"
          style={{ width: width * cellSize, height: height * cellSize }}>
            {renderLayout}
        </div>
      </div>
  );
}

export default App;
