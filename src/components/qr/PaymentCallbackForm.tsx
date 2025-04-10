"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CreditCard } from "lucide-react"
import { processPaymentCallback } from "@/services/apiService"
import type { PaymentCallbackRequest, PaymentCallbackResponse } from "@/types/template"
import { useToast } from "@/hooks/use-toast"

interface PaymentCallbackFormProps {
  onCallbackResponse: (response: PaymentCallbackResponse) => void
}

const PaymentCallbackForm: React.FC<PaymentCallbackFormProps> = ({ onCallbackResponse }) => {
  const { toast } = useToast()

  // Form state
  const [referenceNumber, setReferenceNumber] = useState<string>("")
  const [paymentRef, setPaymentRef] = useState<string>("")
  const [callbackRequestMessageId, setCallbackRequestMessageId] = useState<string>(generateRandomId())

  // Helper function to generate random ID
  function generateRandomId() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
  }

  // Handle payment callback
  const handlePaymentCallback = async () => {
    try {
      if (!referenceNumber.trim() || !paymentRef.trim()) {
        toast({
          title: "Missing Information",
          description: "Please provide both reference number and payment reference.",
          variant: "destructive",
        })
        return
      }

      const request: PaymentCallbackRequest = {
        referenceNumber: referenceNumber,
        paymentRef: paymentRef,
        requestMessageId: callbackRequestMessageId,
      }

      const response = await processPaymentCallback(request)
      onCallbackResponse(response)

      toast({
        title: "Callback Processed",
        description: `Response: ${response.responseMessage}`,
      })
    } catch (error) {
      console.error("Error processing payment callback:", error)
      toast({
        title: "Error",
        description: "Failed to process payment callback. Please check your inputs and try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Request Message ID</label>
        <Input
          value={callbackRequestMessageId}
          onChange={(e) => setCallbackRequestMessageId(e.target.value)}
          className="border-gray-300"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Reference Number</label>
        <Input
          value={referenceNumber}
          onChange={(e) => setReferenceNumber(e.target.value)}
          className="border-gray-300"
          placeholder="Enter reference number"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Payment Reference</label>
        <Input
          value={paymentRef}
          onChange={(e) => setPaymentRef(e.target.value)}
          className="border-gray-300"
          placeholder="Enter payment reference"
        />
      </div>

      <Button onClick={handlePaymentCallback} className="w-full bg-brand-primary hover:bg-brand-primary/90 text-white">
        <CreditCard className="mr-2 h-4 w-4" />
        Process Payment Callback
      </Button>
    </div>
  )
}

export default PaymentCallbackForm
