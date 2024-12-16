import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

interface AddVariationButtonProps {
  onAddVariation: (pgn: string) => void
}

export default function AddVariationButton({ onAddVariation }: AddVariationButtonProps) {
  const [pgn, setPgn] = useState('')
  const [isOpen, setIsOpen] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onAddVariation(pgn)
    setPgn('')
    setIsOpen(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Add Variation</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Variation</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Textarea
            value={pgn}
            onChange={(e) => setPgn(e.target.value)}
            placeholder="Paste your variation PGN here..."
            className="h-40"
          />
          <Button type="submit">Add Variation</Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

