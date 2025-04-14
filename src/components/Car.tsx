
import React, { useState, useRef, useEffect } from 'react';
import { cn } from "@/lib/utils";
import { toast } from 'sonner';

interface CarProps {
  onParked: (spotIndex: number, levelIndex: number) => void;
}

const Car: React.FC<CarProps> = ({ onParked }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 20, y: 20 });
  const [isParked, setIsParked] = useState(false);
  const [parkAnimationActive, setParkAnimationActive] = useState(false);
  const [targetPosition, setTargetPosition] = useState({ x: 0, y: 0 });
  const [showParkFeedback, setShowParkFeedback] = useState(false);
  
  const dragRef = useRef<{
    startX: number;
    startY: number;
    initialX: number;
    initialY: number;
  }>({ startX: 0, startY: 0, initialX: 0, initialY: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    if (isParked) return;
    
    const { clientX, clientY } = e;
    dragRef.current = {
      startX: clientX,
      startY: clientY,
      initialX: position.x,
      initialY: position.y
    };
    setIsDragging(true);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (isParked) return;
    
    const touch = e.touches[0];
    dragRef.current = {
      startX: touch.clientX,
      startY: touch.clientY,
      initialX: position.x,
      initialY: position.y
    };
    setIsDragging(true);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    
    const { clientX, clientY } = e;
    const deltaX = clientX - dragRef.current.startX;
    const deltaY = clientY - dragRef.current.startY;
    
    setPosition({
      x: dragRef.current.initialX + deltaX,
      y: dragRef.current.initialY + deltaY
    });
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!isDragging) return;
    
    const touch = e.touches[0];
    const deltaX = touch.clientX - dragRef.current.startX;
    const deltaY = touch.clientY - dragRef.current.startY;
    
    setPosition({
      x: dragRef.current.initialX + deltaX,
      y: dragRef.current.initialY + deltaY
    });
  };

  const handleMouseUp = (e: MouseEvent) => {
    if (!isDragging) return;
    
    setIsDragging(false);
    
    // Check if car is over a parking spot
    window.dispatchEvent(new CustomEvent('car-park-attempt', {
      detail: { x: e.clientX, y: e.clientY }
    }));
  };
  
  const handleTouchEnd = (e: TouchEvent) => {
    if (!isDragging) return;
    
    setIsDragging(false);
    
    if (e.changedTouches.length > 0) {
      const touch = e.changedTouches[0];
      
      // Check if car is over a parking spot
      window.dispatchEvent(new CustomEvent('car-park-attempt', {
        detail: { x: touch.clientX, y: touch.clientY }
      }));
    }
  };
  
  // Listen for parking spot acceptances
  useEffect(() => {
    const handleSpotAccepted = (e: CustomEvent) => {
      const { spotIndex, spotLevel, rect } = e.detail;
      
      if (!rect) return;
      
      // Calculate center position of the parking spot
      const targetX = rect.left + rect.width / 2 - 10; // Adjust for car width
      const targetY = rect.top + rect.height / 2 - 14; // Adjust for car height
      
      setTargetPosition({ x: targetX, y: targetY });
      setParkAnimationActive(true);
      
      // After animation completes
      setTimeout(() => {
        setIsParked(true);
        setParkAnimationActive(false);
        onParked(spotIndex, spotLevel);
        
        // Show success feedback
        setShowParkFeedback(true);
        setTimeout(() => setShowParkFeedback(false), 2000);
      }, 500); // Duration of the parking animation
    };
    
    window.addEventListener('spot-park-accepted' as any, handleSpotAccepted as any);
    
    return () => {
      window.removeEventListener('spot-park-accepted' as any, handleSpotAccepted as any);
    };
  }, [onParked]);
  
  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchmove', handleTouchMove);
      window.addEventListener('touchend', handleTouchEnd as any);
    } else {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd as any);
    }
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd as any);
    };
  }, [isDragging]);

  return (
    <div 
      className={cn(
        "absolute z-50 cursor-grab transition-all duration-500",
        isDragging && "cursor-grabbing scale-105",
        isParked && "cursor-not-allowed opacity-90",
        parkAnimationActive && "ease-out-quart"
      )}
      style={{
        left: parkAnimationActive ? `${targetPosition.x}px` : `${position.x}px`,
        top: parkAnimationActive ? `${targetPosition.y}px` : `${position.y}px`,
        touchAction: "none"
      }}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
    >
      {/* Simple 2D car model */}
      <div className="relative w-14 h-24 md:w-20 md:h-28 bg-blue-500 rounded-lg shadow-lg">
        {/* Car body */}
        <div className="absolute inset-0 bg-blue-500 rounded-lg">
          {/* Windows */}
          <div className="absolute top-4 left-1 right-1 h-8 bg-blue-700 rounded-sm"></div>
          
          {/* Headlights */}
          <div className="absolute top-1 left-1 w-2 h-2 bg-yellow-300 rounded-full"></div>
          <div className="absolute top-1 right-1 w-2 h-2 bg-yellow-300 rounded-full"></div>
          
          {/* Taillights */}
          <div className="absolute bottom-1 left-1 w-2 h-2 bg-red-500 rounded-full"></div>
          <div className="absolute bottom-1 right-1 w-2 h-2 bg-red-500 rounded-full"></div>
        </div>
        
        {/* Wheels */}
        <div className="absolute -left-1 top-4 w-2 h-6 bg-gray-800 rounded-l-md"></div>
        <div className="absolute -right-1 top-4 w-2 h-6 bg-gray-800 rounded-r-md"></div>
        <div className="absolute -left-1 bottom-4 w-2 h-6 bg-gray-800 rounded-l-md"></div>
        <div className="absolute -right-1 bottom-4 w-2 h-6 bg-gray-800 rounded-r-md"></div>
        
        {/* Parking feedback */}
        {showParkFeedback && (
          <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-3 py-1 rounded-full text-xs whitespace-nowrap animate-bounce">
            Parked!
          </div>
        )}
      </div>
    </div>
  );
};

export default Car;
