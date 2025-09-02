import React, { useState, useCallback } from 'react';
import { GameState, Position, ChessPiece, Player, ChessMove, PieceColor } from '@/types/chess';
import { ChessBoard } from './ChessBoard';
import { PlayerSetup } from './PlayerSetup';
import { GameTimer } from './GameTimer';
import { GameHistory } from './GameHistory';
import { initializeBoard, getValidMoves, isSamePosition } from '@/utils/chessLogic';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { RotateCcw, Users, Trophy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const ChessGame = () => {
  const { toast } = useToast();
  const [gameState, setGameState] = useState<GameState>({
    board: initializeBoard(),
    currentPlayer: 'white',
    selectedSquare: null,
    validMoves: [],
    gameHistory: [],
    isCheck: false,
    isCheckmate: false,
    isDraw: false,
    players: [],
    gameStarted: false,
    winner: null,
  });

  const startGame = (players: Player[], timeControl: number) => {
    setGameState({
      board: initializeBoard(),
      currentPlayer: 'white',
      selectedSquare: null,
      validMoves: [],
      gameHistory: [],
      isCheck: false,
      isCheckmate: false,
      isDraw: false,
      players,
      gameStarted: true,
      winner: null,
    });
  };

  const resetGame = () => {
    setGameState(prev => ({
      board: initializeBoard(),
      currentPlayer: 'white',
      selectedSquare: null,
      validMoves: [],
      gameHistory: [],
      isCheck: false,
      isCheckmate: false,
      isDraw: false,
      players: prev.players,
      gameStarted: true,
      winner: null,
    }));
  };

  const handleTimeUp = (color: PieceColor) => {
    const winner = color === 'white' ? 'black' : 'white';
    setGameState(prev => ({ ...prev, winner, gameStarted: false }));
    const loser = gameState.players.find(p => p.color === color);
    toast({
      title: "¡Tiempo agotado!",
      description: `${loser?.name} se quedó sin tiempo. ¡${winner === 'white' ? 'Blancas' : 'Negras'} gana!`,
    });
  };

  const updatePlayerTimes = (players: Player[]) => {
    setGameState(prev => ({ ...prev, players }));
  };

  const handleSquareClick = useCallback((position: Position) => {
    const { board, currentPlayer, selectedSquare, validMoves } = gameState;
    const piece = board[position.row][position.col];

    // If no piece is selected
    if (!selectedSquare) {
      if (piece && piece.color === currentPlayer) {
        const moves = getValidMoves(board, position, piece);
        setGameState(prev => ({
          ...prev,
          selectedSquare: position,
          validMoves: moves,
        }));
      }
      return;
    }

    // If clicking the same square, deselect
    if (isSamePosition(position, selectedSquare)) {
      setGameState(prev => ({
        ...prev,
        selectedSquare: null,
        validMoves: [],
      }));
      return;
    }

    // If clicking a valid move
    const isValidMove = validMoves.some(move => isSamePosition(move, position));
    if (isValidMove) {
      const newBoard = board.map(row => [...row]);
      const movingPiece = newBoard[selectedSquare.row][selectedSquare.col];
      const capturedPiece = newBoard[position.row][position.col];
      
      // Create move record
      const move: ChessMove = {
        from: selectedSquare,
        to: position,
        piece: movingPiece!,
        capturedPiece: capturedPiece || undefined,
      };
      
      // Make the move
      newBoard[position.row][position.col] = movingPiece;
      newBoard[selectedSquare.row][selectedSquare.col] = null;
      
      setGameState(prev => ({
        ...prev,
        board: newBoard,
        currentPlayer: currentPlayer === 'white' ? 'black' : 'white',
        selectedSquare: null,
        validMoves: [],
        gameHistory: [...prev.gameHistory, move],
      }));
    } else {
      // Select new piece if it belongs to current player
      if (piece && piece.color === currentPlayer) {
        const moves = getValidMoves(board, position, piece);
        setGameState(prev => ({
          ...prev,
          selectedSquare: position,
          validMoves: moves,
        }));
      } else {
        setGameState(prev => ({
          ...prev,
          selectedSquare: null,
          validMoves: [],
        }));
      }
    }
  }, [gameState]);

  if (!gameState.gameStarted && gameState.players.length === 0) {
    return <PlayerSetup onStartGame={startGame} />;
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="flex flex-col xl:flex-row gap-6 items-start max-w-7xl w-full">
        {/* Game Board */}
        <div className="flex flex-col items-center">
          <ChessBoard
            board={gameState.board}
            selectedSquare={gameState.selectedSquare}
            validMoves={gameState.validMoves}
            onSquareClick={handleSquareClick}
          />
        </div>
        
        {/* Game Info Panel */}
        <div className="flex flex-col gap-4 w-full xl:w-80">
          {/* Current Turn & Winner */}
          <Card className="p-4">
            <div className="text-center">
              <h1 className="text-2xl font-bold mb-3">Ajedrez</h1>
              
              {gameState.winner ? (
                <div className="flex items-center justify-center gap-2 text-lg mb-3">
                  <Trophy className="w-6 h-6 text-yellow-500" />
                  <span className="font-bold">
                    ¡{gameState.players.find(p => p.color === gameState.winner)?.name} Gana!
                  </span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2 text-lg mb-3">
                  <Users className="w-5 h-5" />
                  <span>Turno: </span>
                  <span className={`font-bold capitalize ${
                    gameState.currentPlayer === 'white' 
                      ? 'text-chess-white-piece' 
                      : 'text-chess-black-piece'
                  }`}>
                    {gameState.players.find(p => p.color === gameState.currentPlayer)?.name || 
                     (gameState.currentPlayer === 'white' ? 'Blancas' : 'Negras')}
                  </span>
                </div>
              )}
              
              <Button 
                onClick={resetGame}
                variant="outline"
                className="w-full"
                disabled={!gameState.gameStarted && !gameState.winner}
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Nueva Partida
              </Button>
            </div>
          </Card>
          
          {/* Timer */}
          {gameState.players.length > 0 && (
            <Card className="p-4">
              <h3 className="font-semibold mb-3">Tiempo</h3>
              <GameTimer
                players={gameState.players}
                currentPlayer={gameState.currentPlayer}
                gameStarted={gameState.gameStarted && !gameState.winner}
                onTimeUp={handleTimeUp}
                onUpdateTime={updatePlayerTimes}
              />
            </Card>
          )}
          
          {/* Game History */}
          <GameHistory moves={gameState.gameHistory} />
          
          {/* Instructions */}
          <Card className="p-4">
            <div className="text-sm text-muted-foreground space-y-2">
              <h3 className="font-semibold text-foreground">Cómo jugar:</h3>
              <ul className="space-y-1">
                <li>• Haz clic en una pieza para seleccionarla</li>
                <li>• Los puntos dorados muestran movimientos válidos</li>
                <li>• Haz clic en una casilla válida para mover</li>
                <li>• El cronómetro cuenta el tiempo de cada jugador</li>
              </ul>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};