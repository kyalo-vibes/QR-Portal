"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Header } from "@/components/Header"
import { useToast } from "@/hooks/use-toast"
import { QrCode, ShieldCheck, CreditCard } from "lucide-react"
import { getAllTemplates } from "@/services/templateService"
import type { Template, GenerateQRCodeResponse, VerifyQRCodeResponse, PaymentCallbackResponse } from "@/types/template"

// Import our components
import EnhancedGenerateQrForm from "@/components/qr/EnhancedGenerateQrForm"
import QrCodeResult from "@/components/qr/QrCodeResult"
import VerifyQrForm from "@/components/qr/VerifyQrForm"
import VerificationResult from "@/components/qr/VerificationResult"
import PaymentCallbackForm from "@/components/qr/PaymentCallbackForm"
import CallbackResult from "@/components/qr/CallbackResult"

const ApiTester: React.FC = () => {
  const [templates, setTemplates] = useState<Template[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  // Response states
  const [generateResponse, setGenerateResponse] = useState<GenerateQRCodeResponse | null>(null)
  const [verifyResponse, setVerifyResponse] = useState<VerifyQRCodeResponse | null>(null)
  const [callbackResponse, setCallbackResponse] = useState<PaymentCallbackResponse | null>(null)

  // Fetch templates on component mount
  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const data = await getAllTemplates()
        setTemplates(data)
      } catch (error) {
        console.error("Error fetching templates:", error)
        toast({
          title: "Error",
          description: "Failed to load templates. Please try again later.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchTemplates()
  }, [toast])

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container py-6">
        <h1 className="text-2xl font-bold mb-6 text-brand-primary">QR Code API Tester</h1>

        <Tabs defaultValue="generate">
          <TabsList className="grid grid-cols-3 mb-6 bg-brand-primary/10">
            <TabsTrigger
              value="generate"
              className="text-sm md:text-base flex items-center data-[state=active]:bg-brand-primary data-[state=active]:text-white"
            >
              <QrCode className="mr-2 h-4 w-4" />
              Generate QR
            </TabsTrigger>
            <TabsTrigger
              value="verify"
              className="text-sm md:text-base flex items-center data-[state=active]:bg-brand-primary data-[state=active]:text-white"
            >
              <ShieldCheck className="mr-2 h-4 w-4" />
              Verify QR
            </TabsTrigger>
            <TabsTrigger
              value="callback"
              className="text-sm md:text-base flex items-center data-[state=active]:bg-brand-primary data-[state=active]:text-white"
            >
              <CreditCard className="mr-2 h-4 w-4" />
              Payment Callback
            </TabsTrigger>
          </TabsList>

          {/* Generate QR Section */}
          <TabsContent value="generate">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-t-4 border-t-brand-primary shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-brand-primary flex items-center">
                    <QrCode className="mr-2 h-5 w-5" />
                    Generate QR Code
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <EnhancedGenerateQrForm templates={templates} onGenerateResponse={setGenerateResponse} />
                </CardContent>
              </Card>

              <Card className="border-t-4 border-t-brand-secondary shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-brand-secondary">Result</CardTitle>
                </CardHeader>
                <CardContent>
                  <QrCodeResult generateResponse={generateResponse} />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Verify QR Section */}
          <TabsContent value="verify">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-t-4 border-t-brand-primary shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-brand-primary flex items-center">
                    <ShieldCheck className="mr-2 h-5 w-5" />
                    Verify QR Code
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <VerifyQrForm onVerifyResponse={setVerifyResponse} />
                </CardContent>
              </Card>

              <Card className="border-t-4 border-t-brand-secondary shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-brand-secondary">Verification Result</CardTitle>
                </CardHeader>
                <CardContent>
                  <VerificationResult verifyResponse={verifyResponse} />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Payment Callback Section */}
          <TabsContent value="callback">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-t-4 border-t-brand-primary shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-brand-primary flex items-center">
                    <CreditCard className="mr-2 h-5 w-5" />
                    Payment Callback
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <PaymentCallbackForm onCallbackResponse={setCallbackResponse} />
                </CardContent>
              </Card>

              <Card className="border-t-4 border-t-brand-secondary shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-brand-secondary">Callback Result</CardTitle>
                </CardHeader>
                <CardContent>
                  <CallbackResult callbackResponse={callbackResponse} />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default ApiTester
