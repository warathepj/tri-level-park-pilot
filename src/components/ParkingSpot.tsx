
import React from 'react';
import { cn } from "@/lib/utils";

interface ParkingSpotProps {
  spotNumber: number;
  isOccupied: boolean;
  onClick: () => void;
  levelColor: string;
}

const ParkingSpot: React.FC<ParkingSpotProps> = ({ 
  spotNumber, 
  isOccupied, 
  onClick, 
  levelColor 
}) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "relative flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-md transition-all duration-300 shadow-md",
        isOccupied 
          ? "bg-gray-300 text-gray-600" 
          : `bg-white hover:bg-opacity-90 text-gray-800 border-2`,
        !isOccupied && `border-${levelColor}`
      )}
      style={{
        borderColor: !isOccupied ? levelColor : undefined
      }}
    >
      <span className="text-lg font-bold">{spotNumber}</span>
      {isOccupied && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 rounded-md">
          <span className="text-xs font-bold text-white">OCCUPIED</span>
        </div>
      )}
    </button>
  );
};

export default ParkingSpot;
