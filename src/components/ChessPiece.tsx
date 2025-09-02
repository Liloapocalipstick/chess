import { ChessPiece as ChessPieceType } from '@/types/chess';

interface ChessPieceProps {
  piece: ChessPieceType | null;
  size?: 'sm' | 'md' | 'lg';
}

const pieceSymbols: Record<string, string> = {
  'white-king': '♔',
  'white-queen': '♕',
  'white-rook': '♖',
  'white-bishop': '♗',
  'white-knight': '♘',
  'white-pawn': '♙',
  'black-king': '♚',
  'black-queen': '♛',
  'black-rook': '♜',
  'black-bishop': '♝',
  'black-knight': '♞',
  'black-pawn': '♟',
};

export const ChessPiece = ({ piece, size = 'md' }: ChessPieceProps) => {
  if (!piece) return null;
  
  const key = `${piece.color}-${piece.type}`;
  const symbol = pieceSymbols[key];
  
  const sizeClasses = {
    sm: 'text-2xl',
    md: 'text-4xl',
    lg: 'text-5xl'
  };
  
  const colorClasses = {
    white: 'text-chess-white-piece drop-shadow-lg',
    black: 'text-chess-black-piece drop-shadow-lg'
  };
  
  return (
    <div className={`
      ${sizeClasses[size]} 
      ${colorClasses[piece.color]}
      select-none cursor-pointer
      transition-all duration-200
      hover:scale-110
      font-bold
      flex items-center justify-center
      w-full h-full
    `}>
      {symbol}
    </div>
  );
};