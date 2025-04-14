
import React, { useState, useRef } from 'react';
import { cn } from "@/lib/utils";
import { CircleCheck, CircleX } from 'lucide-react';

interface ParkingSpotProps {
  spotNumber: number;
  isOccupied: boolean;
  onClick: () => void;
  levelColor: string;
  onCarParked?: () => void;
  level: number;
  index: number;
}

const ParkingSpot: React.FC<ParkingSpotProps> = ({ 
  spotNumber, 
  isOccupied, 
  onClick, 
  levelColor,
  onCarParked,
  level,
  index
}) => {
  const [isHovering, setIsHovering] = useState(false);
  const spotRef = useRef<HTMLButtonElement>(null);
  
  // This function will be used to determine if a car is over this spot
  const isPointInElement = (x: number, y: number) => {
    if (!spotRef.current) return false;
    
    const rect = spotRef.current.getBoundingClientRect();
    return (
      x >= rect.left &&
      x <= rect.right &&
      y >= rect.top &&
      y <= rect.bottom
    );
  };
  
  // Make the parking spot available for the Car component
  React.useEffect(() => {
    if (!spotRef.current) return;
    
    // Add data attributes for the car to detect
    spotRef.current.dataset.parkingSpot = 'true';
    spotRef.current.dataset.spotIndex = String(index);
    spotRef.current.dataset.spotLevel = String(level);
    
    // Listen for custom car-parking events
    const handleCarParking = (e: CustomEvent) => {
      const { x, y } = e.detail;
      if (isPointInElement(x, y) && !isOccupied) {
        if (onCarParked) onCarParked();
        // Acknowledge the parking
        window.dispatchEvent(new CustomEvent('spot-park-accepted', { 
          detail: { 
            spotIndex: index, 
            spotLevel: level,
            rect: spotRef.current?.getBoundingClientRect()
          } 
        }));
      }
    };
    
    window.addEventListener('car-park-attempt' as any, handleCarParking as any);
    
    return () => {
      window.removeEventListener('car-park-attempt' as any, handleCarParking as any);
    };
  }, [index, level, isOccupied, onCarParked]);
  
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
