import { ChessPiece, Position, PieceType, PieceColor } from '@/types/chess';

export const initializeBoard = (): (ChessPiece | null)[][] => {
  const board: (ChessPiece | null)[][] = Array(8).fill(null).map(() => Array(8).fill(null));
  
  // Place pawns
  for (let col = 0; col < 8; col++) {
    board[1][col] = { type: 'pawn', color: 'black' };
    board[6][col] = { type: 'pawn', color: 'white' };
  }
  
  // Place other pieces
  const backRow: PieceType[] = ['rook', 'knight', 'bishop', 'queen', 'king', 'bishop', 'knight', 'rook'];
  
  for (let col = 0; col < 8; col++) {
    board[0][col] = { type: backRow[col], color: 'black' };
    board[7][col] = { type: backRow[col], color: 'white' };
  }
  
  return board;
};

export const isValidPosition = (row: number, col: number): boolean => {
  return row >= 0 && row < 8 && col >= 0 && col < 8;
};

export const isSamePosition = (pos1: Position, pos2: Position): boolean => {
  return pos1.row === pos2.row && pos1.col === pos2.col;
};

export const getValidMoves = (
  board: (ChessPiece | null)[][],
  position: Position,
  piece: ChessPiece
): Position[] => {
  const moves: Position[] = [];
  const { row, col } = position;
  const { type, color } = piece;

  switch (type) {
    case 'pawn':
      return getPawnMoves(board, position, color);
    case 'rook':
      return getRookMoves(board, position, color);
    case 'bishop':
      return getBishopMoves(board, position, color);
    case 'knight':
      return getKnightMoves(board, position, color);
    case 'queen':
      return getQueenMoves(board, position, color);
    case 'king':
      return getKingMoves(board, position, color);
    default:
      return [];
  }
};

const getPawnMoves = (board: (ChessPiece | null)[][], position: Position, color: PieceColor): Position[] => {
  const moves: Position[] = [];
  const { row, col } = position;
  const direction = color === 'white' ? -1 : 1;
  const startRow = color === 'white' ? 6 : 1;
  
  // Forward move
  if (isValidPosition(row + direction, col) && !board[row + direction][col]) {
    moves.push({ row: row + direction, col });
    
    // Double move from start
    if (row === startRow && !board[row + 2 * direction][col]) {
      moves.push({ row: row + 2 * direction, col });
    }
  }
  
  // Captures
  for (const colOffset of [-1, 1]) {
    const newCol = col + colOffset;
    if (isValidPosition(row + direction, newCol)) {
      const targetPiece = board[row + direction][newCol];
      if (targetPiece && targetPiece.color !== color) {
        moves.push({ row: row + direction, col: newCol });
      }
    }
  }
  
  return moves;
};

const getRookMoves = (board: (ChessPiece | null)[][], position: Position, color: PieceColor): Position[] => {
  const moves: Position[] = [];
  const directions = [[0, 1], [0, -1], [1, 0], [-1, 0]];
  
  for (const [dRow, dCol] of directions) {
    for (let i = 1; i < 8; i++) {
      const newRow = position.row + i * dRow;
      const newCol = position.col + i * dCol;
      
      if (!isValidPosition(newRow, newCol)) break;
      
      const targetPiece = board[newRow][newCol];
      if (!targetPiece) {
        moves.push({ row: newRow, col: newCol });
      } else {
        if (targetPiece.color !== color) {
          moves.push({ row: newRow, col: newCol });
        }
        break;
      }
    }
  }
  
  return moves;
};

const getBishopMoves = (board: (ChessPiece | null)[][], position: Position, color: PieceColor): Position[] => {
  const moves: Position[] = [];
  const directions = [[1, 1], [1, -1], [-1, 1], [-1, -1]];
  
  for (const [dRow, dCol] of directions) {
    for (let i = 1; i < 8; i++) {
      const newRow = position.row + i * dRow;
      const newCol = position.col + i * dCol;
      
      if (!isValidPosition(newRow, newCol)) break;
      
      const targetPiece = board[newRow][newCol];
      if (!targetPiece) {
        moves.push({ row: newRow, col: newCol });
      } else {
        if (targetPiece.color !== color) {
          moves.push({ row: newRow, col: newCol });
        }
        break;
      }
    }
  }
  
  return moves;
};

const getKnightMoves = (board: (ChessPiece | null)[][], position: Position, color: PieceColor): Position[] => {
  const moves: Position[] = [];
  const knightMoves = [
    [-2, -1], [-2, 1], [-1, -2], [-1, 2],
    [1, -2], [1, 2], [2, -1], [2, 1]
  ];
  
  for (const [dRow, dCol] of knightMoves) {
    const newRow = position.row + dRow;
    const newCol = position.col + dCol;
    
    if (isValidPosition(newRow, newCol)) {
      const targetPiece = board[newRow][newCol];
      if (!targetPiece || targetPiece.color !== color) {
        moves.push({ row: newRow, col: newCol });
      }
    }
  }
  
  return moves;
};

const getQueenMoves = (board: (ChessPiece | null)[][], position: Position, color: PieceColor): Position[] => {
  return [
    ...getRookMoves(board, position, color),
    ...getBishopMoves(board, position, color)
  ];
};

const getKingMoves = (board: (ChessPiece | null)[][], position: Position, color: PieceColor): Position[] => {
  const moves: Position[] = [];
  const directions = [
    [-1, -1], [-1, 0], [-1, 1],
    [0, -1],           [0, 1],
    [1, -1],  [1, 0],  [1, 1]
  ];
  
  for (const [dRow, dCol] of directions) {
    const newRow = position.row + dRow;
    const newCol = position.col + dCol;
    
    if (isValidPosition(newRow, newCol)) {
      const targetPiece = board[newRow][newCol];
      if (!targetPiece || targetPiece.color !== color) {
        moves.push({ row: newRow, col: newCol });
      }
    }
  }
  
  return moves;
};