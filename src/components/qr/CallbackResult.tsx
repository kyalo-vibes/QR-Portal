import type React from "react"
import { CreditCard } from "lucide-react"
import type { PaymentCallbackResponse } from "@/types/template"

interface CallbackResultProps {
  callbackResponse: PaymentCallbackResponse | null
}

const CallbackResult: React.FC<CallbackResultProps> = ({ callbackResponse }) => {
  if (!callbackResponse) {
    return (
      <div className="text-center py-12 text-gray-500 border border-dashed rounded-lg">
        <CreditCard className="h-10 w-10 opacity-30 mx-auto mb-3" />
        Process a payment callback to see the result here
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div>
        <p className="text-sm font-medium text-gray-500">Response Code</p>
        <p className={`text-lg ${callbackResponse.responseCode === "200" ? "text-green-600" : "text-red-600"}`}>
          {callbackResponse.responseCode}
        </p>
      </div>

      <div>
        <p className="text-sm font-medium text-gray-500">Message</p>
        <p>{callbackResponse.responseMessage}</p>
      </div>

      <div>
        <p className="text-sm font-medium text-gray-500">Response Date/Time</p>
        <p>{callbackResponse.responseDateTime ? new Date(callbackResponse.responseDateTime).toLocaleString() : "-"}</p>
      </div>

      <div>
        <p className="text-sm font-medium text-gray-500">Request Message ID</p>
        <p className="font-mono">{callbackResponse.requestMessageId || "-"}</p>
      </div>
    </div>
  )
}

export default CallbackResult
