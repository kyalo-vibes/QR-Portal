"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { ShieldCheck } from "lucide-react"
import { verifyQRCode } from "@/services/apiService"
import type { VerifyQRCodeRequest, VerifyQRCodeResponse } from "@/types/template"
import { useToast } from "@/hooks/use-toast"

// Channel IDs for dropdown
const channelOptions = [
  { id: "1", name: "Mobile App" },
  { id: "2", name: "Web Portal" },
  { id: "3", name: "Branch Kiosk" },
  { id: "4", name: "ATM" },
  { id: "5", name: "Agency" },
]

interface VerifyQrFormProps {
  onVerifyResponse: (response: VerifyQRCodeResponse) => void
}

const VerifyQrForm: React.FC<VerifyQrFormProps> = ({ onVerifyResponse }) => {
  const { toast } = useToast()

  // Form state
  const [qrString, setQrString] = useState<string>("")
  const [requestMessageId, setRequestMessageId] = useState<string>(generateRandomId())
  const [requestDateTime, setRequestDateTime] = useState<string>(new Date().toISOString())
  const [verifyChannelId, setVerifyChannelId] = useState<string>("1")

  // Helper function to generate random ID
  function generateRandomId() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
  }

  // Handle QR code verification
  const handleVerifyQR = async () => {
    try {
      if (!qrString.trim()) {
        toast({
          title: "Missing QR String",
          description: "Please provide a QR string to verify.",
          variant: "destructive",
        })
        return
      }

      const request: VerifyQRCodeRequest = {
        qrString: qrString,
        requestMessageId: requestMessageId,
        requestDateTime: requestDateTime,
        requestType: "VerifyQRCode",
        channelId: verifyChannelId,
      }

      const response = await verifyQRCode(request)
      onVerifyResponse(response)

      toast({
        title: "QR Code Verified",
        description: `Verification result: ${response.isValid ? "Valid" : "Invalid"}`,
      })
    } catch (error) {
      console.error("Error verifying QR code:", error)
      toast({
        title: "Error",
        description: "Failed to verify QR code. Please check your input and try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">QR String</label>
        <Textarea
          value={qrString}
          onChange={(e) => setQrString(e.target.value)}
          className="h-40 font-mono text-sm border-gray-300"
          placeholder="Enter QR string to verify"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Request Message ID</label>
          <Input
            value={requestMessageId}
            onChange={(e) => setRequestMessageId(e.target.value)}
            className="border-gray-300"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Channel</label>
          <Select value={verifyChannelId} onValueChange={setVerifyChannelId}>
            <SelectTrigger className="border-gray-300">
              <SelectValue placeholder="Select channel" />
            </SelectTrigger>
            <SelectContent>
              {channelOptions.map((channel) => (
                <SelectItem key={channel.id} value={channel.id}>
                  {channel.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button onClick={handleVerifyQR} className="w-full bg-brand-primary hover:bg-brand-primary/90 text-white">
        <ShieldCheck className="mr-2 h-4 w-4" />
        Verify QR Code
      </Button>
    </div>
  )
}

export default VerifyQrForm
