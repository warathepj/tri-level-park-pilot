
import React from 'react';
import ParkingSpot from './ParkingSpot';

interface ParkingLevelProps {
  level: number;
  spots: boolean[];
  onToggleSpot: (level: number, spotIndex: number) => void;
  isActive: boolean;
  levelColor: string;
}

const ParkingLevel: React.FC<ParkingLevelProps> = ({ 
  level, 
  spots, 
  onToggleSpot,
  isActive,
  levelColor
}) => {
  if (!isActive) return null;

  return (
    <div className="animate-fade-in w-full max-w-4xl">
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
            onCarParked={() => onToggleSpot(level, index)}
          />
        ))}
      </div>
    </div>
  );
};

export default ParkingLevel;
