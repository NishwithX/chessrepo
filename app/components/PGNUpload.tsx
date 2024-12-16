import { ChangeEvent } from 'react'
import { Button } from "@/components/ui/button"

interface PGNUploadProps {
  onUpload: (pgn: string) => void
}

export default function PGNUpload({ onUpload }: PGNUploadProps) {
  const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const pgn = e.target?.result as string
        onUpload(pgn)
      }
      reader.readAsText(file)
    }
  }

  return (
    <div className="mb-4">
      <Button variant="outline" className="relative" asChild>
        <label>
          Upload PGN File
          <input
            type="file"
            accept=".pgn"
            onChange={handleFileUpload}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
        </label>
      </Button>
    </div>
  )
}

