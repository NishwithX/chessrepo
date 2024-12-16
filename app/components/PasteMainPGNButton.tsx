import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

interface PasteMainPGNButtonProps {
  onPaste: (pgn: string) => void
}

export default function PasteMainPGNButton({ onPaste }: PasteMainPGNButtonProps) {
  const [pgn, setPgn] = useState('')
  const [isOpen, setIsOpen] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onPaste(pgn)
    setPgn('')
    setIsOpen(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Paste Main PGN</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Paste Main PGN</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Textarea
            value={pgn}
            onChange={(e) => setPgn(e.target.value)}
            placeholder="Paste your PGN here..."
            className="h-40"
          />
          <Button type="submit">Load PGN</Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

