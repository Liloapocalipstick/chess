import React, { useEffect, useState } from 'react';
import { Player, PieceColor } from '@/types/chess';
import { Clock } from 'lucide-react';

interface GameTimerProps {
  players: Player[];
  currentPlayer: PieceColor;
  gameStarted: boolean;
  onTimeUp: (color: PieceColor) => void;
  onUpdateTime: (players: Player[]) => void;
}

export const GameTimer = ({ 
  players, 
  currentPlayer, 
  gameStarted, 
  onTimeUp, 
  onUpdateTime 
}: GameTimerProps) => {
  const [localPlayers, setLocalPlayers] = useState(players);

  useEffect(() => {
    setLocalPlayers(players);
  }, [players]);

  useEffect(() => {
    if (!gameStarted) return;

    const timer = setInterval(() => {
      setLocalPlayers(prev => {
        const updated = prev.map(player => {
          if (player.color === currentPlayer && player.timeRemaining > 0) {
            const newTime = player.timeRemaining - 1;
            if (newTime <= 0) {
              onTimeUp(player.color);
              return { ...player, timeRemaining: 0 };
            }
            return { ...player, timeRemaining: newTime };
          }
          return player;
        });
        onUpdateTime(updated);
        return updated;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentPlayer, gameStarted, onTimeUp, onUpdateTime]);

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-3">
      {localPlayers.map((player) => (
        <div
          key={player.id}
          className={`p-4 rounded-lg border-2 transition-all ${
            currentPlayer === player.color && gameStarted
              ? 'border-primary bg-primary/5'
              : 'border-border'
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">{player.name}</p>
              <p className="text-sm text-muted-foreground capitalize">
                {player.color === 'white' ? 'Blancas' : 'Negras'}
              </p>
            </div>
            <div className={`flex items-center gap-2 text-lg font-mono ${
              player.timeRemaining <= 30 ? 'text-destructive' : 'text-foreground'
            }`}>
              <Clock className="w-4 h-4" />
              {formatTime(player.timeRemaining)}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};