export type PieceType = 'king' | 'queen' | 'rook' | 'bishop' | 'knight' | 'pawn';
export type PieceColor = 'white' | 'black';

export interface ChessPiece {
  type: PieceType;
  color: PieceColor;
  hasMoved?: boolean;
}

export interface Position {
  row: number;
  col: number;
}

export interface ChessMove {
  from: Position;
  to: Position;
  piece: ChessPiece;
  capturedPiece?: ChessPiece;
}

export interface Player {
  id: string;
  name: string;
  color: PieceColor;
  timeRemaining: number; // in seconds
  isAI?: boolean;
  aiLevel?: 'easy' | 'medium' | 'hard';
}

export interface GameState {
  board: (ChessPiece | null)[][];
  currentPlayer: PieceColor;
  selectedSquare: Position | null;
  validMoves: Position[];
  gameHistory: ChessMove[];
  isCheck: boolean;
  isCheckmate: boolean;
  isDraw: boolean;
  players: Player[];
  gameStarted: boolean;
  winner: PieceColor | null;
}