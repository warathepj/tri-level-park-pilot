
import React from 'react';
import { cn } from "@/lib/utils";
import { CircleCheck, CircleX } from 'lucide-react';

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
        "relative flex flex-col items-center justify-center w-16 h-20 md:w-24 md:h-28 rounded-md transition-all duration-300 shadow-md border-2 hover:shadow-lg",
        isOccupied 
          ? "bg-gray-100 border-gray-300" 
          : "bg-white hover:bg-opacity-90 border-2"
      )}
      style={{
        borderColor: !isOccupied ? levelColor : undefined
      }}
    >
      {/* Occupancy Indicator */}
      <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center shadow-sm">
        {isOccupied ? (
          <CircleX className="w-5 h-5 text-red-500" />
        ) : (
          <CircleCheck className="w-5 h-5 text-green-500" />
        )}
      </div>
      
      {/* Parking Lines */}
      <div className="absolute inset-1 border-2 border-dashed opacity-30" 
        style={{ borderColor: levelColor }}></div>
      
      {/* Space Number */}
      <div className="mt-1 text-xl font-bold">
        {spotNumber}
      </div>
      
      {/* Status Text */}
      <div className={cn(
        "text-xs mt-1 font-medium",
        isOccupied ? "text-red-500" : "text-green-500"
      )}>
        {isOccupied ? "OCCUPIED" : "VACANT"}
      </div>
    </button>
  );
};

export default ParkingSpot;
