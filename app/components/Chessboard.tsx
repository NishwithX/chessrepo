import { Chess } from 'chess.js'
import { Chessboard as ReactChessboard } from 'react-chessboard'

interface ChessboardProps {
  game: Chess
}

export default function Chessboard({ game }: ChessboardProps) {
  return (
    <div className="w-full max-w-md mx-auto">
      <ReactChessboard position={game.fen()} />
    </div>
  )
}

