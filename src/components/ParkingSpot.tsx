
import React, { useState, useRef, useEffect } from 'react';
import { cn } from "@/lib/utils";
import { CircleCheck, CircleX } from 'lucide-react';

interface ParkingSpotProps {
  spotNumber: number;
  isOccupied: boolean;
  onClick: () => void;
  levelColor: string;
  level: number;
  index: number;
}

const ParkingSpot: React.FC<ParkingSpotProps> = ({ 
  spotNumber, 
  isOccupied, 
  onClick, 
  levelColor,
  level,
  index
}) => {
  const [isHovering, setIsHovering] = useState(false);
  const [registrationNumber, setRegistrationNumber] = useState<string | null>(null);
  const spotRef = useRef<HTMLButtonElement>(null);
  
  // Generate a random registration number when the spot becomes occupied
  useEffect(() => {
    if (isOccupied) {
      // Format: 1 capital letter (A-Z) followed by 4 numbers (0-9)
      const letter = String.fromCharCode(65 + Math.floor(Math.random() * 26)); // A-Z
      const numbers = Array.from({ length: 4 }, () => Math.floor(Math.random() * 10)).join('');
      setRegistrationNumber(`${letter}${numbers}`);
    } else {
      setRegistrationNumber(null);
    }
  }, [isOccupied]);
  
  return (
    <button
      ref={spotRef}
      onClick={onClick}
      className={cn(
        "relative flex flex-col items-center justify-center w-16 h-20 md:w-24 md:h-28 rounded-md transition-all duration-300 shadow-md border-2 hover:shadow-lg",
        isOccupied 
          ? "bg-gray-100 border-gray-300" 
          : "bg-white hover:bg-opacity-90 border-2",
        isHovering && !isOccupied && "bg-green-50"
      )}
      style={{
        borderColor: !isOccupied ? levelColor : undefined
      }}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
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
      
      {/* Registration Number (only shown when occupied) */}
      {isOccupied && registrationNumber && (
        <div className="bg-yellow-300 px-2 py-0.5 text-xs font-mono font-bold rounded-sm mt-1 shadow-sm">
          {registrationNumber}
        </div>
      )}
      
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
