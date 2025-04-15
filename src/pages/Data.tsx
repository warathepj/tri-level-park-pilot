import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface ParkingData {
  levels: {
    levelNumber: number;
    totalSpots: number;
    availableSpots: number;
    occupiedSpots: number;
    spots: {
      spotNumber: number;
      isOccupied: boolean;
      registrationNumber?: string;
    }[];
  }[];
  totalOccupancy: {
    total: number;
    available: number;
    occupied: number;
    occupancyRate: number;
  };
}

const STORAGE_KEY = 'parking-simulator-state';
const SPOTS_PER_LEVEL = 30;

const Data: React.FC = () => {
  const navigate = useNavigate();
  const [parkingData, setParkingData] = useState<ParkingData | null>(null);

  useEffect(() => {
    const loadParkingData = () => {
      try {
        const savedState = localStorage.getItem(STORAGE_KEY);
        if (!savedState) return null;

        const rawData = JSON.parse(savedState) as boolean[][];
        
        // Process the raw data into a more detailed format
        const levels = rawData.map((level, levelIndex) => {
          const occupiedSpots = level.filter(spot => spot).length;
          const availableSpots = SPOTS_PER_LEVEL - occupiedSpots;

          return {
            levelNumber: levelIndex + 1,
            totalSpots: SPOTS_PER_LEVEL,
            availableSpots,
            occupiedSpots,
            spots: level.map((isOccupied, spotIndex) => ({
              spotNumber: spotIndex + 1,
              isOccupied,
              // Generate a registration number for occupied spots
              ...(isOccupied && {
                registrationNumber: `${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${Array.from({ length: 4 }, () => Math.floor(Math.random() * 10)).join('')}`
              })
            }))
          };
        });

        const totalSpots = SPOTS_PER_LEVEL * rawData.length;
        const totalOccupied = rawData.flat().filter(spot => spot).length;

        const processedData: ParkingData = {
          levels,
          totalOccupancy: {
            total: totalSpots,
            available: totalSpots - totalOccupied,
            occupied: totalOccupied,
            occupancyRate: (totalOccupied / totalSpots) * 100
          }
        };

        setParkingData(processedData);
      } catch (error) {
        console.error('Failed to load parking data:', error);
      }
    };

    loadParkingData();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Parking Data</h1>
        <Button onClick={() => navigate('/')}>Back to Simulator</Button>
      </div>

      <div className="bg-white rounded-lg shadow p-6 space-y-6">
        {parkingData ? (
          <>
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-3">Total Occupancy</h2>
              <pre className="bg-gray-100 p-4 rounded-lg overflow-auto">
                {JSON.stringify(parkingData.totalOccupancy, null, 2)}
              </pre>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-3">Level Details</h2>
              <pre className="bg-gray-100 p-4 rounded-lg overflow-auto">
                {JSON.stringify(parkingData.levels, null, 2)}
              </pre>
            </div>
          </>
        ) : (
          <p className="text-gray-500">No parking data available</p>
        )}
      </div>
    </div>
  );
};

export default Data;
