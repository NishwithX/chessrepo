import { useMemo } from 'react'
import Tree from 'react-d3-tree'

interface ChessTreeProps {
  data: any
  onNodeClick: (node: any) => void
}

export default function ChessTree({ data, onNodeClick }: ChessTreeProps) {
  const processedData = useMemo(() => processTreeData(data), [data])

  if (!processedData) return null

  const renderCustomNodeElement = ({ nodeDatum, toggleNode }: any) => (
    <g>
      <rect width="120" height="30" x="-60" y="-15" rx="5" ry="5" fill="white" stroke="black" />
      <text dy=".31em" textAnchor="middle" style={{ fontSize: '12px' }} onClick={() => onNodeClick(nodeDatum)}>
        {nodeDatum.name}
      </text>
      <circle r={5} cy={20} fill="lightgray" onClick={toggleNode} />
    </g>
  )

  return (
    <div className="w-full h-full">
      <Tree
        data={processedData}
        orientation="vertical"
        pathFunc="step"
        translate={{ x: 300, y: 50 }}
        renderCustomNodeElement={renderCustomNodeElement}
        separation={{ siblings: 1.5, nonSiblings: 2 }}
        nodeSize={{ x: 130, y: 50 }}
      />
    </div>
  )
}

function processTreeData(node: any): any {
  if (!node) return null

  const processedNode = { ...node }

  if (processedNode.name !== 'Start') {
    const parts = processedNode.name.split('.')
    if (parts.length > 1) {
      const [moveNumber, moves] = [parts[0], parts.slice(1).join('.').trim()]
      const [whiteMove, blackMove] = moves.split(' ')
      processedNode.name = `${moveNumber}. ${whiteMove}${blackMove ? `  ${blackMove}` : ''}`
    }
  }

  if (processedNode.children) {
    processedNode.children = processedNode.children.map(processTreeData)
  }

  return processedNode
}

