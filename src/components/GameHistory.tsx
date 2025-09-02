import React from 'react';
import { ChessMove } from '@/types/chess';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { History } from 'lucide-react';

interface GameHistoryProps {
  moves: ChessMove[];
}

export const GameHistory = ({ moves }: GameHistoryProps) => {
  const formatMove = (move: ChessMove, index: number): string => {
    const files = 'abcdefgh';
    const fromSquare = `${files[move.from.col]}${8 - move.from.row}`;
    const toSquare = `${files[move.to.col]}${8 - move.to.row}`;
    const pieceSymbol = getPieceSymbol(move.piece.type);
    const capture = move.capturedPiece ? 'x' : '-';
    
    return `${Math.floor(index / 2) + 1}${index % 2 === 0 ? '.' : '...'} ${pieceSymbol}${fromSquare}${capture}${toSquare}`;
  };

  const getPieceSymbol = (type: string): string => {
    const symbols: { [key: string]: string } = {
      king: '♔',
      queen: '♕',
      rook: '♖',
      bishop: '♗',
      knight: '♘',
      pawn: '♙'
    };
    return symbols[type] || '';
  };

  return (
    <Card className="p-4 h-80">
      <div className="flex items-center gap-2 mb-3">
        <History className="w-4 h-4" />
        <h3 className="font-semibold">Historial de Movimientos</h3>
      </div>
      
      <ScrollArea className="h-64">
        {moves.length === 0 ? (
          <p className="text-muted-foreground text-sm">No hay movimientos aún</p>
        ) : (
          <div className="space-y-1">
            {moves.map((move, index) => (
              <div
                key={index}
                className={`text-sm p-2 rounded ${
                  move.piece.color === 'white' 
                    ? 'bg-chess-light text-chess-dark' 
                    : 'bg-chess-dark text-chess-light'
                }`}
              >
                {formatMove(move, index)}
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </Card>
  );
};