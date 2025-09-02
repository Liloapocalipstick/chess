import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Player } from '@/types/chess';
import { Crown, Clock, Users, Bot } from 'lucide-react';

interface PlayerSetupProps {
  onStartGame: (players: Player[], timeControl: number) => void;
}

export const PlayerSetup = ({ onStartGame }: PlayerSetupProps) => {
  const [gameMode, setGameMode] = useState<'pvp' | 'ai'>('pvp');
  const [whitePlayerName, setWhitePlayerName] = useState('');
  const [blackPlayerName, setBlackPlayerName] = useState('');
  const [aiLevel, setAILevel] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [aiColor, setAIColor] = useState<'white' | 'black'>('black');
  const [timeControl, setTimeControl] = useState(10); // minutes

  const handleStartGame = () => {
    let players: Player[];
    
    if (gameMode === 'ai') {
      const humanColor = aiColor === 'white' ? 'black' : 'white';
      const humanName = aiColor === 'white' ? blackPlayerName : whitePlayerName;
      
      players = [
        {
          id: 'white',
          name: aiColor === 'white' ? `IA (${aiLevel})` : (humanName || 'Jugador'),
          color: 'white',
          timeRemaining: timeControl * 60,
          isAI: aiColor === 'white',
          aiLevel: aiColor === 'white' ? aiLevel : undefined,
        },
        {
          id: 'black',
          name: aiColor === 'black' ? `IA (${aiLevel})` : (humanName || 'Jugador'),
          color: 'black',
          timeRemaining: timeControl * 60,
          isAI: aiColor === 'black',
          aiLevel: aiColor === 'black' ? aiLevel : undefined,
        },
      ];
    } else {
      players = [
        {
          id: 'white',
          name: whitePlayerName || 'Jugador Blancas',
          color: 'white',
          timeRemaining: timeControl * 60,
          isAI: false,
        },
        {
          id: 'black',
          name: blackPlayerName || 'Jugador Negras',
          color: 'black',
          timeRemaining: timeControl * 60,
          isAI: false,
        },
      ];
    }
    
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

        {/* Game Mode Selection */}
        <div className="space-y-3">
          <Label className="text-base font-medium">Modo de juego</Label>
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant={gameMode === 'pvp' ? 'default' : 'outline'}
              onClick={() => setGameMode('pvp')}
              className="h-12 flex items-center gap-2"
            >
              <Users className="w-4 h-4" />
              2 Jugadores
            </Button>
            <Button
              variant={gameMode === 'ai' ? 'default' : 'outline'}
              onClick={() => setGameMode('ai')}
              className="h-12 flex items-center gap-2"
            >
              <Bot className="w-4 h-4" />
              vs IA
            </Button>
          </div>
        </div>

        {gameMode === 'pvp' ? (
          /* PvP Mode */
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
          </div>
        ) : (
          /* AI Mode */
          <div className="space-y-4">
            <div>
              <Label className="text-base font-medium">Tu nombre</Label>
              <Input
                value={aiColor === 'white' ? blackPlayerName : whitePlayerName}
                onChange={(e) => {
                  if (aiColor === 'white') {
                    setBlackPlayerName(e.target.value);
                  } else {
                    setWhitePlayerName(e.target.value);
                  }
                }}
                placeholder="Tu nombre"
                className="mt-1"
              />
            </div>

            <div>
              <Label className="text-base font-medium">Color de la IA</Label>
              <Select value={aiColor} onValueChange={(value: 'white' | 'black') => setAIColor(value)}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="white">Blancas (IA juega primero)</SelectItem>
                  <SelectItem value="black">Negras (Tú juegas primero)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-base font-medium">Dificultad de la IA</Label>
              <Select value={aiLevel} onValueChange={(value: 'easy' | 'medium' | 'hard') => setAILevel(value)}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="easy">Fácil</SelectItem>
                  <SelectItem value="medium">Medio</SelectItem>
                  <SelectItem value="hard">Difícil</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

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

        <Button onClick={handleStartGame} className="w-full text-lg py-6">
          Comenzar Partida
        </Button>
      </Card>
    </div>
  );
};