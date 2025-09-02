import { ChessPiece, Position, PieceColor, ChessMove } from '@/types/chess';
import { getValidMoves, isValidPosition } from './chessLogic';

// Piece values for evaluation
const PIECE_VALUES = {
  pawn: 100,
  knight: 320,
  bishop: 330,
  rook: 500,
  queen: 900,
  king: 20000,
};

// Position bonus tables (simplified)
const PAWN_TABLE = [
  [0, 0, 0, 0, 0, 0, 0, 0],
  [50, 50, 50, 50, 50, 50, 50, 50],
  [10, 10, 20, 30, 30, 20, 10, 10],
  [5, 5, 10, 25, 25, 10, 5, 5],
  [0, 0, 0, 20, 20, 0, 0, 0],
  [5, -5, -10, 0, 0, -10, -5, 5],
  [5, 10, 10, -20, -20, 10, 10, 5],
  [0, 0, 0, 0, 0, 0, 0, 0]
];

const KNIGHT_TABLE = [
  [-50, -40, -30, -30, -30, -30, -40, -50],
  [-40, -20, 0, 0, 0, 0, -20, -40],
  [-30, 0, 10, 15, 15, 10, 0, -30],
  [-30, 5, 15, 20, 20, 15, 5, -30],
  [-30, 0, 15, 20, 20, 15, 0, -30],
  [-30, 5, 10, 15, 15, 10, 5, -30],
  [-40, -20, 0, 5, 5, 0, -20, -40],
  [-50, -40, -30, -30, -30, -30, -40, -50]
];

export interface AIMove {
  from: Position;
  to: Position;
  score: number;
}

export const evaluateBoard = (board: (ChessPiece | null)[][], color: PieceColor): number => {
  let score = 0;
  
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      if (!piece) continue;
      
      let pieceValue = PIECE_VALUES[piece.type];
      
      // Add positional bonus
      if (piece.type === 'pawn') {
        pieceValue += piece.color === 'white' 
          ? PAWN_TABLE[7 - row][col] 
          : PAWN_TABLE[row][col];
      } else if (piece.type === 'knight') {
        pieceValue += piece.color === 'white' 
          ? KNIGHT_TABLE[7 - row][col] 
          : KNIGHT_TABLE[row][col];
      }
      
      if (piece.color === color) {
        score += pieceValue;
      } else {
        score -= pieceValue;
      }
    }
  }
  
  return score;
};

const getAllPossibleMoves = (board: (ChessPiece | null)[][], color: PieceColor): AIMove[] => {
  const moves: AIMove[] = [];
  
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      if (!piece || piece.color !== color) continue;
      
      const position = { row, col };
      const validMoves = getValidMoves(board, position, piece);
      
      for (const move of validMoves) {
        moves.push({
          from: position,
          to: move,
          score: 0
        });
      }
    }
  }
  
  return moves;
};

const makeMove = (board: (ChessPiece | null)[][], from: Position, to: Position): (ChessPiece | null)[][] => {
  const newBoard = board.map(row => [...row]);
  const piece = newBoard[from.row][from.col];
  newBoard[to.row][to.col] = piece;
  newBoard[from.row][from.col] = null;
  return newBoard;
};

const minimax = (
  board: (ChessPiece | null)[][],
  depth: number,
  isMaximizing: boolean,
  aiColor: PieceColor,
  alpha: number = -Infinity,
  beta: number = Infinity
): number => {
  if (depth === 0) {
    return evaluateBoard(board, aiColor);
  }
  
  const currentColor = isMaximizing ? aiColor : (aiColor === 'white' ? 'black' : 'white');
  const moves = getAllPossibleMoves(board, currentColor);
  
  if (moves.length === 0) {
    return isMaximizing ? -Infinity : Infinity;
  }
  
  if (isMaximizing) {
    let maxEval = -Infinity;
    for (const move of moves) {
      const newBoard = makeMove(board, move.from, move.to);
      const evaluation = minimax(newBoard, depth - 1, false, aiColor, alpha, beta);
      maxEval = Math.max(maxEval, evaluation);
      alpha = Math.max(alpha, evaluation);
      if (beta <= alpha) break; // Alpha-beta pruning
    }
    return maxEval;
  } else {
    let minEval = Infinity;
    for (const move of moves) {
      const newBoard = makeMove(board, move.from, move.to);
      const evaluation = minimax(newBoard, depth - 1, true, aiColor, alpha, beta);
      minEval = Math.min(minEval, evaluation);
      beta = Math.min(beta, evaluation);
      if (beta <= alpha) break; // Alpha-beta pruning
    }
    return minEval;
  }
};

export const getBestMove = (
  board: (ChessPiece | null)[][], 
  aiColor: PieceColor, 
  difficulty: 'easy' | 'medium' | 'hard' = 'medium'
): AIMove | null => {
  const moves = getAllPossibleMoves(board, aiColor);
  
  if (moves.length === 0) return null;
  
  // Set depth based on difficulty
  const depth = difficulty === 'easy' ? 1 : difficulty === 'medium' ? 2 : 3;
  
  // Add some randomness for easier difficulties
  const randomFactor = difficulty === 'easy' ? 0.3 : difficulty === 'medium' ? 0.1 : 0;
  
  let bestMove = moves[0];
  let bestScore = -Infinity;
  
  for (const move of moves) {
    const newBoard = makeMove(board, move.from, move.to);
    let score = minimax(newBoard, depth - 1, false, aiColor);
    
    // Add randomness for easier difficulties
    if (randomFactor > 0) {
      score += (Math.random() - 0.5) * 200 * randomFactor;
    }
    
    // Prioritize captures
    const capturedPiece = board[move.to.row][move.to.col];
    if (capturedPiece) {
      score += PIECE_VALUES[capturedPiece.type] * 0.1;
    }
    
    if (score > bestScore) {
      bestScore = score;
      bestMove = move;
    }
  }
  
  bestMove.score = bestScore;
  return bestMove;
};