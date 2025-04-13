
import React from 'react';
import { CircleCheck, CircleX } from 'lucide-react';

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
      <div className="w-full bg-gray-200 rounded-full h-6 mb-3 overflow-hidden">
        <div 
          className="h-6 rounded-full transition-all duration-300 flex items-center justify-end pr-2"
          style={{ 
            width: `${percentage}%`,
            backgroundColor: levelColor,
          }}
        >
          {percentage > 15 && (
            <span className="text-xs font-bold text-white">{Math.round(percentage)}%</span>
          )}
        </div>
      </div>
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-1">
          <CircleCheck className="w-4 h-4 text-green-500" />
          <span className="text-sm">Available: <strong>{availableSpots}</strong></span>
        </div>
        <div className="flex items-center gap-1">
          <CircleX className="w-4 h-4 text-red-500" />
          <span className="text-sm">Occupied: <strong>{totalSpots - availableSpots}</strong></span>
        </div>
      </div>
    </div>
  );
};

export default ParkingIndicator;
