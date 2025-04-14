import React, { useEffect, useState } from 'react';
import ParkingSpot from './ParkingSpot';
import { cn } from '@/lib/utils';

interface ParkingLevelProps {
  level: number;
  spots: boolean[];
  onToggleSpot: (level: number, spotIndex: number) => void;
  isActive: boolean;
  levelColor: string;
  transitionDirection?: 'up' | 'down' | null;
  previousLevel?: number;
}

const ParkingLevel: React.FC<ParkingLevelProps> = ({ 
  level, 
  spots, 
  onToggleSpot,
  isActive,
  levelColor,
  transitionDirection,
  previousLevel
}) => {
  const [mounted, setMounted] = useState(false);
  const [animating, setAnimating] = useState(false);
  
  // Handle animation states when level changes
  useEffect(() => {
    if (isActive) {
      setAnimating(true);
      setMounted(true);
      
      // Remove animating class after animation completes
      const timer = setTimeout(() => {
        setAnimating(false);
      }, 500); // match this with the animation duration in CSS
      
      return () => clearTimeout(timer);
    } else {
      // When no longer active, remove from DOM after animation
      if (mounted) {
        setAnimating(true);
        const timer = setTimeout(() => {
          setMounted(false);
          setAnimating(false);
        }, 500); // match this with the animation duration in CSS
        
        return () => clearTimeout(timer);
      }
    }
  }, [isActive]);

  if (!isActive && !mounted) return null;

  // Determine the animation class based on the transition direction
  const getAnimationClass = () => {
    if (!animating) return '';
    
    if (isActive) {
      if (transitionDirection === 'up') return 'animate-slide-in-from-bottom';
      if (transitionDirection === 'down') return 'animate-slide-in-from-top';
      return 'animate-fade-in';
    } else {
      if (previousLevel && level < previousLevel) return 'animate-slide-out-to-bottom';
      if (previousLevel && level > previousLevel) return 'animate-slide-out-to-top';
      return 'animate-fade-out';
    }
  };

  return (
    <div className={cn(
      "w-full max-w-4xl transition-all duration-500 absolute top-0 left-0",
      getAnimationClass(),
      !isActive && 'pointer-events-none',
      isActive ? 'opacity-100 z-10' : 'opacity-0 z-0'
    )}>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 p-6">
        {spots.map((isOccupied, index) => (
          <ParkingSpot
            key={`level-${level}-spot-${index}`}
            spotNumber={index + 1}
            isOccupied={isOccupied}
            onClick={() => onToggleSpot(level, index)}
            levelColor={levelColor}
            level={level}
            index={index}
          />
        ))}
      </div>
    </div>
  );
};

export default ParkingLevel;
