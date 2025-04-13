
import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ChevronUp, ChevronDown } from 'lucide-react';

interface LevelSelectorProps {
  currentLevel: number;
  onLevelChange: (level: number) => void;
  totalLevels: number;
  availableCounts: number[];
  totalSpots: number;
  levelColors: string[];
}

const LevelSelector: React.FC<LevelSelectorProps> = ({
  currentLevel,
  onLevelChange,
  totalLevels,
  availableCounts,
  totalSpots,
  levelColors
}) => {
  return (
    <div className="flex flex-col items-center gap-4 p-4 bg-white rounded-lg shadow-md w-full max-w-4xl">
      <div className="flex items-center justify-between w-full">
        <Button 
          variant="outline" 
          size="icon"
          onClick={() => onLevelChange(currentLevel > 1 ? currentLevel - 1 : totalLevels)}
          className="h-10 w-10"
        >
          <ChevronUp className="h-4 w-4" />
        </Button>
        
        <div className="flex gap-3">
          {Array.from({ length: totalLevels }, (_, i) => i + 1).map(level => (
            <Button
              key={`level-button-${level}`}
              variant={level === currentLevel ? "default" : "outline"}
              onClick={() => onLevelChange(level)}
              className={cn(
                "relative px-6 py-2 font-bold transition-all duration-300",
                level === currentLevel && "text-white"
              )}
              style={{
                backgroundColor: level === currentLevel ? levelColors[level - 1] : undefined
              }}
            >
              <span>Level {level}</span>
              <div className="absolute -bottom-6 text-xs font-normal">
                {availableCounts[level - 1]} / {totalSpots} available
              </div>
            </Button>
          ))}
        </div>
        
        <Button 
          variant="outline" 
          size="icon"
          onClick={() => onLevelChange(currentLevel < totalLevels ? currentLevel + 1 : 1)}
          className="h-10 w-10"
        >
          <ChevronDown className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default LevelSelector;
