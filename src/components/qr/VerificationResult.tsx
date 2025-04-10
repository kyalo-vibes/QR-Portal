import type React from "react"
import { ShieldCheck } from "lucide-react"
import type { VerifyQRCodeResponse } from "@/types/template"
import QrTlvViewer from "./QrTlvViewer"

interface VerificationResultProps {
  verifyResponse: VerifyQRCodeResponse | null
}

const VerificationResult: React.FC<VerificationResultProps> = ({ verifyResponse }) => {
  if (!verifyResponse) {
    return (
      <div className="text-center py-12 text-gray-500 border border-dashed rounded-lg">
        <ShieldCheck className="h-10 w-10 opacity-30 mx-auto mb-3" />
        Verify a QR code to see the result here
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center">
        <span
          className={`inline-flex items-center justify-center w-8 h-8 rounded-full mr-2 ${
            verifyResponse.isValid ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
          }`}
        >
          {verifyResponse.isValid ? "✓" : "✗"}
        </span>
        <span className="text-lg font-medium">{verifyResponse.isValid ? "Valid QR Code" : "Invalid QR Code"}</span>
      </div>

      <div>
        <p className="text-sm font-medium text-gray-500">Response Code</p>
        <p className={`text-lg ${verifyResponse.responseCode === "200" ? "text-green-600" : "text-red-600"}`}>
          {verifyResponse.responseCode}
        </p>
      </div>

      <div>
        <p className="text-sm font-medium text-gray-500">Message</p>
        <p>{verifyResponse.responseMessage}</p>
      </div>

      {verifyResponse.data && (
        <div>
          <p className="text-sm font-medium text-gray-500 mb-2">QR Data</p>
          <QrTlvViewer qrString={JSON.stringify(verifyResponse.data)} />
        </div>
      )}
    </div>
  )
}

export default VerificationResult
