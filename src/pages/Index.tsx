
import React, { useState, useEffect } from 'react';
import ParkingLevel from '@/components/ParkingLevel';
import LevelSelector from '@/components/LevelSelector';
import ParkingIndicator from '@/components/ParkingIndicator';
import Car from '@/components/Car';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';

const TOTAL_LEVELS = 3;
const SPOTS_PER_LEVEL = 30;
const LEVEL_COLORS = ['#3B82F6', '#10B981', '#F59E0B']; // Blue, Green, Orange

const Index = () => {
  // Initialize parking state with 3 levels, 30 spots each, all vacant
  const [parkingState, setParkingState] = useState<boolean[][]>(
    Array(TOTAL_LEVELS).fill(null).map(() => Array(SPOTS_PER_LEVEL).fill(false))
  );
  
  const [currentLevel, setCurrentLevel] = useState(1);
  
  // Calculate available spots for each level
  const availableCounts = parkingState.map(level => 
    level.filter(spot => !spot).length
  );

  const handleToggleSpot = (level: number, spotIndex: number) => {
    const newParkingState = [...parkingState];
    const newStatus = !newParkingState[level - 1][spotIndex];
    newParkingState[level - 1][spotIndex] = newStatus;
    setParkingState(newParkingState);
    
    // Show toast notification
    if (newStatus) {
      toast.info(`Spot ${spotIndex + 1} on Level ${level} has been occupied.`);
    } else {
      toast.success(`Spot ${spotIndex + 1} on Level ${level} is now available.`);
    }
  };

  const handleCarParked = (spotIndex: number, levelIndex: number) => {
    if (!parkingState[levelIndex - 1][spotIndex]) {
      handleToggleSpot(levelIndex, spotIndex);
      toast.success(`Car successfully parked at spot ${spotIndex + 1} on Level ${levelIndex}!`, {
        icon: '🚗'
      });
    }
  };

  // Listen for car park attempts
  useEffect(() => {
    const handleCarParkAttempt = (e: CustomEvent) => {
      const { x, y } = e.detail;
      // This event is handled by each individual ParkingSpot component
    };

    window.addEventListener('car-park-attempt' as any, handleCarParkAttempt as any);
    
    return () => {
      window.removeEventListener('car-park-attempt' as any, handleCarParkAttempt as any);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center px-4 py-8 relative">
      <header className="w-full max-w-4xl mb-8 text-center">
        <h1 className="text-3xl sm:text-4xl font-bold mb-2">3-Level Parking Simulator</h1>
        <p className="text-gray-600">Drag the car to a parking space or click on a space to toggle between available and occupied</p>
      </header>

      <div className="w-full flex flex-col items-center gap-8 mb-8">
        <LevelSelector
          currentLevel={currentLevel}
          onLevelChange={setCurrentLevel}
          totalLevels={TOTAL_LEVELS}
          availableCounts={availableCounts}
          totalSpots={SPOTS_PER_LEVEL}
          levelColors={LEVEL_COLORS}
        />

        <Card className="w-full max-w-4xl p-4 shadow-md relative">
          <div className="flex flex-col sm:flex-row gap-4 mb-4 justify-between items-center">
            <ParkingIndicator 
              level={currentLevel}
              availableSpots={availableCounts[currentLevel - 1]}
              totalSpots={SPOTS_PER_LEVEL}
              levelColor={LEVEL_COLORS[currentLevel - 1]}
            />
            
            <div className="flex flex-col items-center">
              <div className="flex gap-2 items-center mb-1">
                <div className="w-4 h-4 bg-white border-2 border-gray-400"></div>
                <span>Available</span>
              </div>
              <div className="flex gap-2 items-center">
                <div className="w-4 h-4 bg-gray-300"></div>
                <span>Occupied</span>
              </div>
            </div>
          </div>

          {/* Display the active parking level */}
          {Array.from({ length: TOTAL_LEVELS }, (_, i) => i + 1).map(level => (
            <ParkingLevel
              key={`parking-level-${level}`}
              level={level}
              spots={parkingState[level - 1]}
              onToggleSpot={handleToggleSpot}
              isActive={currentLevel === level}
              levelColor={LEVEL_COLORS[level - 1]}
            />
          ))}
          
          {/* Interactive car */}
          <Car onParked={handleCarParked} />
        </Card>
      </div>
    </div>
  );
};

export default Index;
