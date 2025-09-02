import React, { useState, useCallback } from 'react';
import { GameState, Position, ChessPiece } from '@/types/chess';
import { ChessBoard } from './ChessBoard';
import { initializeBoard, getValidMoves, isSamePosition } from '@/utils/chessLogic';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { RotateCcw, Users } from 'lucide-react';

export const ChessGame = () => {
  const [gameState, setGameState] = useState<GameState>({
    board: initializeBoard(),
    currentPlayer: 'white',
    selectedSquare: null,
    validMoves: [],
    gameHistory: [],
    isCheck: false,
    isCheckmate: false,
    isDraw: false,
  });

  const resetGame = () => {
    setGameState({
      board: initializeBoard(),
      currentPlayer: 'white',
      selectedSquare: null,
      validMoves: [],
      gameHistory: [],
      isCheck: false,
      isCheckmate: false,
      isDraw: false,
    });
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
      
      // Make the move
      newBoard[position.row][position.col] = movingPiece;
      newBoard[selectedSquare.row][selectedSquare.col] = null;
      
      setGameState(prev => ({
        ...prev,
        board: newBoard,
        currentPlayer: currentPlayer === 'white' ? 'black' : 'white',
        selectedSquare: null,
        validMoves: [],
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

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="flex flex-col lg:flex-row gap-8 items-center">
        {/* Game Board */}
        <div className="flex flex-col items-center">
          <ChessBoard
            board={gameState.board}
            selectedSquare={gameState.selectedSquare}
            validMoves={gameState.validMoves}
            onSquareClick={handleSquareClick}
          />
        </div>
        
        {/* Game Info */}
        <Card className="p-6 w-80 space-y-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-2">Ajedrez</h1>
            <div className="flex items-center justify-center gap-2 text-lg">
              <Users className="w-5 h-5" />
              <span>Turno: </span>
              <span className={`font-bold capitalize ${
                gameState.currentPlayer === 'white' 
                  ? 'text-chess-white-piece' 
                  : 'text-chess-black-piece'
              }`}>
                {gameState.currentPlayer === 'white' ? 'Blancas' : 'Negras'}
              </span>
            </div>
          </div>
          
          <div className="space-y-4">
            <Button 
              onClick={resetGame}
              variant="outline"
              className="w-full"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Nueva Partida
            </Button>
          </div>
          
          <div className="text-sm text-muted-foreground space-y-2">
            <h3 className="font-semibold text-foreground">Cómo jugar:</h3>
            <ul className="space-y-1">
              <li>• Haz clic en una pieza para seleccionarla</li>
              <li>• Los puntos dorados muestran movimientos válidos</li>
              <li>• Haz clic en una casilla válida para mover</li>
              <li>• Las blancas siempre juegan primero</li>
            </ul>
          </div>
        </Card>
      </div>
    </div>
  );
};