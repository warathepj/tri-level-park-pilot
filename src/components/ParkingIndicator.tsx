
import React from 'react';

interface ParkingIndicatorProps {
  level: number;
  availableSpots: number;
  totalSpots: number;
  levelColor: string;
}

const ParkingIndicator: React.FC<ParkingIndicatorProps> = ({
  level,
  availableSpots,
  totalSpots,
  levelColor
}) => {
  const percentage = (availableSpots / totalSpots) * 100;
  
  return (
    <div className="flex flex-col items-center bg-white rounded-lg shadow-md p-4 w-full max-w-xs">
      <h2 className="text-2xl font-bold mb-2" style={{ color: levelColor }}>Level {level}</h2>
      <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
        <div 
          className="h-4 rounded-full transition-all duration-300" 
          style={{ 
            width: `${percentage}%`,
            backgroundColor: levelColor,
          }}
        ></div>
      </div>
      <div className="text-lg">
        <span className="font-bold">{availableSpots}</span> / {totalSpots} spots available
      </div>
    </div>
  );
};

export default ParkingIndicator;
