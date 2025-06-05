
import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from './ui/button';

const FlipClock = ({ onClose }) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatNumber = (num) => {
    return num.toString().padStart(2, '0');
  };

  const hours = formatNumber(time.getHours());
  const minutes = formatNumber(time.getMinutes());
  const seconds = formatNumber(time.getSeconds());

  const FlipCard = ({ value, label }) => {
    return (
      <div className="flex flex-col items-center">
        <div className="relative">
          <div className="bg-gray-900 rounded-lg shadow-2xl overflow-hidden border-4 border-gray-700">
            <div className="bg-gray-800 text-white text-center py-8 px-6 text-6xl md:text-8xl font-mono font-bold min-w-[120px] md:min-w-[160px]">
              {value}
            </div>
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-700"></div>
          </div>
        </div>
        <div className="mt-4 text-gray-400 text-lg font-medium uppercase tracking-wider">
          {label}
        </div>
      </div>
    );
  };

  const Separator = () => (
    <div className="flex flex-col justify-center items-center h-32 md:h-40">
      <div className="w-3 h-3 bg-gray-600 rounded-full mb-4"></div>
      <div className="w-3 h-3 bg-gray-600 rounded-full"></div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-95 flex items-center justify-center z-50">
      <Button
        variant="ghost"
        size="sm"
        onClick={onClose}
        className="absolute top-4 right-4 text-white hover:bg-white/10"
      >
        <X className="h-6 w-6" />
      </Button>
      
      <div className="text-center">
        <div className="mb-8">
          <h1 className="text-4xl md:text-6xl font-light text-white mb-2">
            {time.toLocaleDateString('en-US', { 
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </h1>
        </div>
        
        <div className="flex items-center justify-center space-x-4 md:space-x-8">
          <FlipCard value={hours} label="Hours" />
          <Separator />
          <FlipCard value={minutes} label="Minutes" />
          <Separator />
          <FlipCard value={seconds} label="Seconds" />
        </div>
        
        <div className="mt-12">
          <p className="text-gray-400 text-lg">
            Press ESC or click the X to close
          </p>
        </div>
      </div>
    </div>
  );
};

export default FlipClock;
