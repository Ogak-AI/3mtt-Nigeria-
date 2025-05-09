import { useState } from 'react';

const ClickCounter = () => {
  // State to track the counter value
  const [count, setCount] = useState(0);
  // State to track if threshold is reached
  const [thresholdReached, setThresholdReached] = useState(false);
  
  // Threshold value
  const threshold = 10;
  
  // Handler for increasing the count
  const handleIncrease = () => {
    const newCount = count + 1;
    setCount(newCount);
    
    // Check if threshold is reached
    if (newCount >= threshold) {
      setThresholdReached(true);
    }
  };
  
  // Handler for decreasing the count
  const handleDecrease = () => {
    // Prevent counter from going below zero
    if (count > 0) {
      const newCount = count - 1;
      setCount(newCount);
      
      // Reset threshold message if count goes below threshold
      if (newCount < threshold) {
        setThresholdReached(false);
      }
    }
  };
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white rounded-lg shadow-lg">
        <h1 className="mb-6 text-3xl font-bold text-center text-blue-600">Click Counter</h1>
        
        <div className="mb-6 text-6xl font-bold text-center">{count}</div>
        
        <div className="flex justify-center space-x-4">
          <button 
            onClick={handleDecrease}
            className="px-6 py-2 font-bold text-white transition-colors bg-red-500 rounded hover:bg-red-600 disabled:bg-red-300"
            disabled={count === 0}
          >
            Decrease
          </button>
          
          <button 
            onClick={handleIncrease}
            className="px-6 py-2 font-bold text-white transition-colors bg-green-500 rounded hover:bg-green-600"
          >
            Increase
          </button>
        </div>
        
        {thresholdReached && (
          <div className="mt-4 text-center text-red-500 font-medium">
            You've reached the limit!
          </div>
        )}
      </div>
    </div>
  );
};

export default ClickCounter;
