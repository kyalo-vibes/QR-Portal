"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"

interface TemplateHeaderActionsProps {
  setIsNewTemplateDialogOpen: (isOpen: boolean) => void
}

const TemplateHeaderActions: React.FC<TemplateHeaderActionsProps> = ({ setIsNewTemplateDialogOpen }) => {
  return (
    <div className="flex items-center space-x-2">
      <Button
        onClick={() => setIsNewTemplateDialogOpen(true)}
        className="bg-[#00513B] hover:bg-[#00513B]/90 text-white"
      >
        <PlusCircle className="mr-2 h-4 w-4" />
        New Template
      </Button>
    </div>
  )
}

export default TemplateHeaderActions
