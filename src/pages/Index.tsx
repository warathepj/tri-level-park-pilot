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

// Function to generate random parking state
const generateRandomParkingState = () => {
  // Total parked cars should be between 20 and 70
  const totalParkedCars = Math.floor(Math.random() * 51) + 20; // Random between 20-70
  
  // Initialize all spots as vacant
  const newParkingState = Array(TOTAL_LEVELS).fill(null).map(() => 
    Array(SPOTS_PER_LEVEL).fill(false)
  );
  
  // Ensure each level has at least some vacant spots
  const maxCarsPerLevel = Math.floor(SPOTS_PER_LEVEL * 0.9); // Max 90% occupancy per level
  const minCarsPerLevel = Math.floor(totalParkedCars / (TOTAL_LEVELS * 2)); // Min cars per level
  
  // Distribute remaining cars randomly
  let remainingCars = totalParkedCars;
  
  // First, ensure minimum cars per level
  for (let level = 0; level < TOTAL_LEVELS; level++) {
    const carsForThisLevel = Math.min(minCarsPerLevel, remainingCars);
    remainingCars -= carsForThisLevel;
    
    // Randomly place the minimum cars
    const availableSpots = [...Array(SPOTS_PER_LEVEL).keys()];
    for (let i = 0; i < carsForThisLevel; i++) {
      if (availableSpots.length === 0) break;
      
      const randomIndex = Math.floor(Math.random() * availableSpots.length);
      const spotIndex = availableSpots.splice(randomIndex, 1)[0];
      newParkingState[level][spotIndex] = true;
    }
  }
  
  // Then distribute remaining cars randomly across levels
  while (remainingCars > 0) {
    const level = Math.floor(Math.random() * TOTAL_LEVELS);
    
    // Count occupied spots in this level
    const occupiedCount = newParkingState[level].filter(spot => spot).length;
    
    // Skip if this level is already at max capacity
    if (occupiedCount >= maxCarsPerLevel) continue;
    
    // Find an empty spot on this level
    const availableSpots = newParkingState[level]
      .map((isOccupied, idx) => isOccupied ? -1 : idx)
      .filter(idx => idx !== -1);
    
    if (availableSpots.length === 0) continue;
    
    const randomSpotIndex = availableSpots[Math.floor(Math.random() * availableSpots.length)];
    newParkingState[level][randomSpotIndex] = true;
    remainingCars--;
  }
  
  return newParkingState;
};

const Index = () => {
  // Initialize parking state with random occupancy
  const [parkingState, setParkingState] = useState<boolean[][]>(() => 
    generateRandomParkingState()
  );
  
  const [currentLevel, setCurrentLevel] = useState(1);
  
  // Calculate available spots for each level
  const availableCounts = parkingState.map(level => 
    level.filter(spot => !spot).length
  );
  
  // Show initialization toast
  useEffect(() => {
    const totalOccupied = parkingState.flat().filter(spot => spot).length;
    toast.info(`Parking initialized with ${totalOccupied} vehicles across all levels`, {
      duration: 3000,
      position: 'top-center',
      icon: '🚗'
    });
  }, []);

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
