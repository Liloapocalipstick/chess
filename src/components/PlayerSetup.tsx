import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Player } from '@/types/chess';
import { Crown, Clock } from 'lucide-react';

interface PlayerSetupProps {
  onStartGame: (players: Player[], timeControl: number) => void;
}

export const PlayerSetup = ({ onStartGame }: PlayerSetupProps) => {
  const [whitePlayerName, setWhitePlayerName] = useState('');
  const [blackPlayerName, setBlackPlayerName] = useState('');
  const [timeControl, setTimeControl] = useState(10); // minutes

  const handleStartGame = () => {
    const players: Player[] = [
      {
        id: 'white',
        name: whitePlayerName || 'Jugador Blancas',
        color: 'white',
        timeRemaining: timeControl * 60,
      },
      {
        id: 'black',
        name: blackPlayerName || 'Jugador Negras',
        color: 'black',
        timeRemaining: timeControl * 60,
      },
    ];
    onStartGame(players, timeControl * 60);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="p-8 w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-2 flex items-center justify-center gap-2">
            <Crown className="w-8 h-8 text-primary" />
            Ajedrez
          </h1>
          <p className="text-muted-foreground">Configuración de la partida</p>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="whitePlayer" className="text-base font-medium">
              Jugador Blancas
            </Label>
            <Input
              id="whitePlayer"
              value={whitePlayerName}
              onChange={(e) => setWhitePlayerName(e.target.value)}
              placeholder="Nombre del jugador"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="blackPlayer" className="text-base font-medium">
              Jugador Negras
            </Label>
            <Input
              id="blackPlayer"
              value={blackPlayerName}
              onChange={(e) => setBlackPlayerName(e.target.value)}
              placeholder="Nombre del jugador"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="timeControl" className="text-base font-medium flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Tiempo por jugador (minutos)
            </Label>
            <Input
              id="timeControl"
              type="number"
              min="1"
              max="60"
              value={timeControl}
              onChange={(e) => setTimeControl(Number(e.target.value))}
              className="mt-1"
            />
          </div>
        </div>

        <Button onClick={handleStartGame} className="w-full text-lg py-6">
          Comenzar Partida
        </Button>
      </Card>
    </div>
  );
};