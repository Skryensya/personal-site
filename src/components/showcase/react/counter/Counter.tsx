import React, { useState } from 'react';
import './counter.css';

interface CounterProps {
  initialValue?: number;
  step?: number;
  min?: number;
  max?: number;
}

export function Counter({ 
  initialValue = 0, 
  step = 1, 
  min = -Infinity, 
  max = Infinity 
}: CounterProps) {
  const [count, setCount] = useState(initialValue);

  const increment = () => {
    setCount(prev => Math.min(prev + step, max));
  };

  const decrement = () => {
    setCount(prev => Math.max(prev - step, min));
  };

  const reset = () => {
    setCount(initialValue);
  };

  return (
    <div className="showcase-counter">
      <div className="showcase-counter__display">
        <span className="showcase-counter__value">{count}</span>
      </div>
      
      <div className="showcase-counter__controls">
        <button 
          className="showcase-counter__button showcase-counter__button--decrement"
          onClick={decrement}
          disabled={count <= min}
        >
          −
        </button>
        
        <button 
          className="showcase-counter__button showcase-counter__button--reset"
          onClick={reset}
        >
          Reset
        </button>
        
        <button 
          className="showcase-counter__button showcase-counter__button--increment"
          onClick={increment}
          disabled={count >= max}
        >
          +
        </button>
      </div>
      
      <div className="showcase-counter__info">
        <span>Step: {step}</span>
        {min !== -Infinity && <span>Min: {min}</span>}
        {max !== Infinity && <span>Max: {max}</span>}
      </div>
    </div>
  );
}