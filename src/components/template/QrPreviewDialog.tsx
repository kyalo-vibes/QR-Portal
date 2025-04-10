import type React from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { QrCode } from "lucide-react"

interface QrPreviewDialogProps {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
  qrPreviewUrl: string | null
  selectedTemplateName: string | null
}

const QrPreviewDialog: React.FC<QrPreviewDialogProps> = ({ isOpen, setIsOpen, qrPreviewUrl, selectedTemplateName }) => {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center text-brand-primary">
            <QrCode className="mr-2 h-5 w-5" />
            QR Code Preview: {selectedTemplateName}
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center justify-center p-6">
          {qrPreviewUrl ? (
            <img
              src={qrPreviewUrl}
              alt="QR Code Preview"
              className="max-w-full h-auto border rounded-md shadow-sm"
              style={{ maxHeight: "300px" }}
            />
          ) : (
            <div className="text-center py-8 text-gray-500">
              <QrCode className="h-12 w-12 opacity-30 mx-auto mb-3" />
              <p>No QR code preview available</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default QrPreviewDialog
