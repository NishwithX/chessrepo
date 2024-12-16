"use client"

import { useState } from 'react'
import dynamic from 'next/dynamic'
import { Chess } from 'chess.js'
import pgnParser from 'pgn-parser'
import PGNUpload from './components/PGNUpload'
import ChessTree from './components/ChessTree'
import PasteMainPGNButton from './components/PasteMainPGNButton'
import AddVariationButton from './components/AddVariationButton'

const DynamicChessboard = dynamic(() => import('./components/Chessboard'), {
  ssr: false,
})

export default function ChessAnalysis() {
  const [game, setGame] = useState(new Chess())
  const [treeData, setTreeData] = useState(null)
  const [currentNode, setCurrentNode] = useState(null)

  const handlePGNUpload = (pgn: string) => {
    processPGN(pgn, false)
  }

  const handlePasteMainPGN = (pgn: string) => {
    processPGN(pgn, false)
  }

  const handleAddVariation = (pgn: string) => {
    processPGN(pgn, true)
  }

  const processPGN = (pgn: string, isVariation: boolean) => {
    try {
      // Wrap the moves in a minimal PGN structure if it's just a sequence of moves
      if (!pgn.includes('[')) {
        pgn = `[Event "Chess Analysis"]
[Site "?"]
[Date "????.??.??"]
[Round "?"]
[White "?"]
[Black "?"]
[Result "*"]

${pgn} *`;
      }

      const parsedPGN = pgnParser.parse(pgn)[0]
      const newGame = new Chess()
      newGame.loadPgn(pgn)
      
      if (isVariation) {
        if (!treeData) {
          alert('Please load a main PGN first before adding variations.')
          return
        }
        setTreeData(addVariationToTree(treeData, parsedPGN))
      } else {
        setTreeData(convertPGNToTreeData(parsedPGN))
      }
      
      setGame(newGame)
      setCurrentNode(null)
    } catch (error) {
      console.error('Error processing PGN:', error)
      alert('Error processing PGN. Please check the input and try again.')
    }
  }

  const handleNodeClick = (node: any) => {
    const newGame = new Chess()
    newGame.loadPgn(node.data.pgn)
    setGame(newGame)
    setCurrentNode(node)
  }

  return (
    <div className="flex h-screen">
      <div className="w-1/2 p-4">
        <PGNUpload onUpload={handlePGNUpload} />
        <div className="mt-4 space-y-2">
          <PasteMainPGNButton onPaste={handlePasteMainPGN} />
          <AddVariationButton onAddVariation={handleAddVariation} />
        </div>
        <DynamicChessboard game={game} />
      </div>
      <div className="w-1/2 p-4">
        <ChessTree data={treeData} onNodeClick={handleNodeClick} />
      </div>
    </div>
  )
}

function convertPGNToTreeData(pgn: any): any {
  const moves = pgn.moves || pgn.history || []
  const root = { name: 'Start', children: [], data: { pgn: '' } }
  let currentNode = root
  let currentPGN = ''
  let currentFullMove = ''

  moves.forEach((moveObj: any, index: number) => {
    const move = typeof moveObj === 'string' ? moveObj : (moveObj.move || '')
    currentPGN += (index % 2 === 0 ? `${Math.floor(index / 2) + 1}. ` : '') + move + ' '
    
    if (index % 2 === 0) {
      currentFullMove = `${Math.floor(index / 2) + 1}. ${move}`
    } else {
      currentFullMove += ` ${move}`
      const newNode = { name: currentFullMove, children: [], data: { pgn: currentPGN.trim() } }
      currentNode.children.push(newNode)
      currentNode = newNode
      currentFullMove = ''
    }
  })

  // Handle case where last move is white's move
  if (currentFullMove) {
    const newNode = { name: currentFullMove, children: [], data: { pgn: currentPGN.trim() } }
    currentNode.children.push(newNode)
  }

  return root
}

function addVariationToTree(treeData: any, variation: any): any {
  const variationMoves = variation.moves || variation.history || []
  let currentNode = treeData
  let divergencePoint = null
  let convergencePoint = null
  let currentPGN = ''
  let currentFullMove = ''

  for (let i = 0; i < variationMoves.length; i++) {
    const moveObj = variationMoves[i]
    const move = typeof moveObj === 'string' ? moveObj : (moveObj.move || '')
    currentPGN += (i % 2 === 0 ? `${Math.floor(i / 2) + 1}. ` : '') + move + ' '
    
    if (i % 2 === 0) {
      currentFullMove = `${Math.floor(i / 2) + 1}. ${move}`
    } else {
      currentFullMove += ` ${move}`
    }
    
    const existingChild = currentNode.children.find((child: any) => child.name === currentFullMove)
    
    if (existingChild) {
      currentNode = existingChild
      currentFullMove = ''
    } else {
      if (!divergencePoint) {
        divergencePoint = currentNode
      }
      if (i % 2 === 1 || i === variationMoves.length - 1) {
        const newNode = { 
          name: currentFullMove, 
          children: [], 
          data: { pgn: currentPGN.trim() } 
        }
        currentNode.children.push(newNode)
        currentNode = newNode
        currentFullMove = ''
      }
    }

    if (i === variationMoves.length - 1) {
      convergencePoint = currentNode
    }
  }

  if (divergencePoint && convergencePoint) {
    // Merge back into the main line if possible
    const mainLineNode = findNodeByPGN(treeData, convergencePoint.data.pgn)
    if (mainLineNode) {
      convergencePoint.children = mainLineNode.children
    }
  }

  return { ...treeData }
}

function findNodeByPGN(node: any, pgn: string): any {
  if (node.data && node.data.pgn === pgn) {
    return node
  }
  if (node.children) {
    for (const child of node.children) {
      const result = findNodeByPGN(child, pgn)
      if (result) {
        return result
      }
    }
  }
  return null
}

