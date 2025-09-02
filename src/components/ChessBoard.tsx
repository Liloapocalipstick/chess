import { Position, ChessPiece as ChessPieceType } from '@/types/chess';
import { ChessPiece } from './ChessPiece';
import { isSamePosition } from '@/utils/chessLogic';

interface ChessBoardProps {
  board: (ChessPieceType | null)[][];
  selectedSquare: Position | null;
  validMoves: Position[];
  onSquareClick: (position: Position) => void;
}

export const ChessBoard = ({ 
  board, 
  selectedSquare, 
  validMoves, 
  onSquareClick 
}: ChessBoardProps) => {
  const isLightSquare = (row: number, col: number): boolean => {
    return (row + col) % 2 === 0;
  };
  
  const isValidMove = (row: number, col: number): boolean => {
    return validMoves.some(move => move.row === row && move.col === col);
  };
  
  const isSelected = (row: number, col: number): boolean => {
    return selectedSquare ? isSamePosition({ row, col }, selectedSquare) : false;
  };
  
  return (
    <div className="inline-block border-4 border-primary rounded-lg shadow-2xl bg-primary">
      <div className="grid grid-cols-8 gap-0">
        {board.map((row, rowIndex) =>
          row.map((piece, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={`
                w-16 h-16 flex items-center justify-center relative cursor-pointer
                transition-all duration-200 hover:brightness-110
                ${isLightSquare(rowIndex, colIndex) 
                  ? 'bg-chess-light' 
                  : 'bg-chess-dark'
                }
                ${isSelected(rowIndex, colIndex) 
                  ? 'ring-4 ring-chess-selected bg-chess-selected' 
                  : ''
                }
                ${isValidMove(rowIndex, colIndex) 
                  ? 'after:content-[""] after:absolute after:w-4 after:h-4 after:bg-chess-highlight after:rounded-full after:shadow-lg' 
                  : ''
                }
              `}
              onClick={() => onSquareClick({ row: rowIndex, col: colIndex })}
            >
              <ChessPiece piece={piece} />
            </div>
          ))
        )}
      </div>
    </div>
  );
};