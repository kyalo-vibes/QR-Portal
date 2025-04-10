"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { QrCode, Zap, History, Code, Copy, Check } from "lucide-react"
import { generateStaticQRCode, generateDynamicQRCode } from "@/services/apiService"
import { journeyTypes } from "@/services/templateService"
import { getAllJourneyTypes } from "@/services/configService"
import type { Template, GenerateQRCodeRequest, GenerateQRCodeResponse } from "@/types/template"
import type { JourneyType } from "@/types/config"
import { useToast } from "@/hooks/use-toast"

// Channel IDs for dropdown
const channelOptions = [
  { id: "1", name: "Mobile App" },
  { id: "2", name: "Web Portal" },
  { id: "3", name: "Branch Kiosk" },
  { id: "4", name: "ATM" },
  { id: "5", name: "Agency" },
  { id: "13", name: "Till" },
  { id: "14", name: "Duka" },
]

// Response format options
const responseFormatOptions = [
  { id: "image", name: "Image" },
  { id: "pdf", name: "PDF" },
]

// Example templates for quick start
const exampleTemplates = [
  {
    name: "Basic Payment",
    data: {
      amount: "100.00",
      currency: "USD",
      merchantId: "MERCH12345",
      reference: "INV-001",
    },
  },
  {
    name: "Till Payment",
    data: {
      amount: "1250.00",
      currency: "KES",
      tillNumber: "123456",
      reference: "TILL-001",
    },
  },
  {
    name: "Identity",
    data: {
      idNumber: "12345678",
      name: "John Doe",
      expiryDate: "2025-12-31",
    },
  },
]

interface EnhancedGenerateQrFormProps {
  templates: Template[]
  onGenerateResponse: (response: GenerateQRCodeResponse) => void
}

const EnhancedGenerateQrForm: React.FC<EnhancedGenerateQrFormProps> = ({ templates, onGenerateResponse }) => {
  const { toast } = useToast()

  // Form state
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>("")
  const [selectedJourneyId, setSelectedJourneyId] = useState<string>("")
  const [selectedChannelId, setSelectedChannelId] = useState<string>("1")
  const [selectedResponseFormat, setSelectedResponseFormat] = useState<string>("image")
  const [jsonData, setJsonData] = useState<string>('{\n  "amount": "100.00",\n  "currency": "USD"\n}')
  const [requestHistory, setRequestHistory] = useState<Array<{ request: GenerateQRCodeRequest; type: string }>>([])
  const [lastRequest, setLastRequest] = useState<string>("")
  const [copySuccess, setCopySuccess] = useState(false)
  const [availableJourneys, setAvailableJourneys] = useState<JourneyType[]>([])

  // Fetch available journeys
  useEffect(() => {
    const fetchJourneys = async () => {
      try {
        const journeys = await getAllJourneyTypes()
        setAvailableJourneys(journeys)
      } catch (error) {
        console.error("Error fetching journeys:", error)
      }
    }

    fetchJourneys()
  }, [])

  // Handle static QR code generation
  const handleGenerateStaticQR = async () => {
    try {
      // Parse JSON data
      let dataObj
      try {
        dataObj = JSON.parse(jsonData)
      } catch (error) {
        toast({
          title: "Invalid JSON",
          description: "Please provide valid JSON data.",
          variant: "destructive",
        })
        return
      }

      const request: GenerateQRCodeRequest = {
        templateId: Number.parseInt(selectedTemplateId),
        journey: selectedJourneyId,
        qrData: dataObj,
        channelId: Number.parseInt(selectedChannelId),
        responseFormat: selectedResponseFormat,
      }

      // Save request to history
      setLastRequest(JSON.stringify(request, null, 2))
      setRequestHistory((prev) => [{ request, type: "static" }, ...prev.slice(0, 9)])

      const response = await generateStaticQRCode(request)
      onGenerateResponse(response)

      toast({
        title: "QR Code Generated",
        description: "Static QR code has been successfully generated.",
      })
    } catch (error) {
      console.error("Error generating static QR code:", error)
      toast({
        title: "Error",
        description: "Failed to generate QR code. Please check your inputs and try again.",
        variant: "destructive",
      })
    }
  }

  // Handle dynamic QR code generation
  const handleGenerateDynamicQR = async () => {
    try {
      // Parse JSON data
      let dataObj
      try {
        dataObj = JSON.parse(jsonData)
      } catch (error) {
        toast({
          title: "Invalid JSON",
          description: "Please provide valid JSON data.",
          variant: "destructive",
        })
        return
      }

      const request: GenerateQRCodeRequest = {
        templateId: Number.parseInt(selectedTemplateId),
        journey: selectedJourneyId,
        qrData: dataObj,
        channelId: Number.parseInt(selectedChannelId),
        responseFormat: selectedResponseFormat,
      }

      // Save request to history
      setLastRequest(JSON.stringify(request, null, 2))
      setRequestHistory((prev) => [{ request, type: "dynamic" }, ...prev.slice(0, 9)])

      const response = await generateDynamicQRCode(request)
      onGenerateResponse(response)

      toast({
        title: "QR Code Generated",
        description: "Dynamic QR code has been successfully generated.",
      })
    } catch (error) {
      console.error("Error generating dynamic QR code:", error)
      toast({
        title: "Error",
        description: "Failed to generate QR code. Please check your inputs and try again.",
        variant: "destructive",
      })
    }
  }

  const loadHistoryItem = (item: { request: GenerateQRCodeRequest; type: string }) => {
    setSelectedTemplateId(item.request.templateId.toString())
    setSelectedJourneyId(item.request.journey)
    setSelectedChannelId(item.request.channelId?.toString() || "1")
    setSelectedResponseFormat(item.request.responseFormat || "image")
    setJsonData(JSON.stringify(item.request.qrData, null, 2))
  }

  const loadExampleTemplate = (example: { name: string; data: any }) => {
    setJsonData(JSON.stringify(example.data, null, 2))
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopySuccess(true)
      setTimeout(() => setCopySuccess(false), 2000)
      toast({
        title: "Copied!",
        description: "Request copied to clipboard.",
      })
    })
  }

  return (
    <div className="space-y-4">
      <Tabs defaultValue="form">
        <TabsList className="w-full bg-brand-primary/10">
          <TabsTrigger
            value="form"
            className="flex-1 data-[state=active]:bg-brand-primary data-[state=active]:text-white"
          >
            <QrCode className="mr-2 h-4 w-4" />
            QR Form
          </TabsTrigger>
          <TabsTrigger
            value="history"
            className="flex-1 data-[state=active]:bg-brand-primary data-[state=active]:text-white"
          >
            <History className="mr-2 h-4 w-4" />
            History
          </TabsTrigger>
          <TabsTrigger
            value="examples"
            className="flex-1 data-[state=active]:bg-brand-primary data-[state=active]:text-white"
          >
            <Code className="mr-2 h-4 w-4" />
            Examples
          </TabsTrigger>
        </TabsList>

        <TabsContent value="form" className="space-y-4 pt-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="block text-sm font-medium text-gray-700 mb-1">Template</Label>
              <Select
                value={selectedTemplateId}
                onValueChange={(value) => {
                  setSelectedTemplateId(value)
                  // Also set the journey ID from the selected template
                  const template = templates.find((t) => t.id.toString() === value)
                  if (template) {
                    setSelectedJourneyId(template.journeyId)
                  }
                }}
              >
                <SelectTrigger className="border-gray-300">
                  <SelectValue placeholder="Select template" />
                </SelectTrigger>
                <SelectContent>
                  {templates.map((template) => (
                    <SelectItem key={template.id} value={template.id.toString()}>
                      {template.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="block text-sm font-medium text-gray-700 mb-1">Journey</Label>
              <Select value={selectedJourneyId} onValueChange={setSelectedJourneyId}>
                <SelectTrigger className="border-gray-300">
                  <SelectValue placeholder="Select journey" />
                </SelectTrigger>
                <SelectContent>
                  {availableJourneys.length > 0
                    ? availableJourneys.map((journey) => (
                        <SelectItem key={journey.journeyId} value={journey.journeyId}>
                          {journey.journeyName} ({journey.journeyId})
                        </SelectItem>
                      ))
                    : journeyTypes.map((journey) => (
                        <SelectItem key={journey.id} value={journey.id}>
                          {journey.name}
                        </SelectItem>
                      ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="block text-sm font-medium text-gray-700 mb-1">Channel</Label>
              <Select value={selectedChannelId} onValueChange={setSelectedChannelId}>
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
            <div>
              <Label className="block text-sm font-medium text-gray-700 mb-1">Response Format</Label>
              <Select value={selectedResponseFormat} onValueChange={setSelectedResponseFormat}>
                <SelectTrigger className="border-gray-300">
                  <SelectValue placeholder="Select format" />
                </SelectTrigger>
                <SelectContent>
                  {responseFormatOptions.map((format) => (
                    <SelectItem key={format.id} value={format.id}>
                      {format.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <Label className="block text-sm font-medium text-gray-700">Data (JSON)</Label>
              {lastRequest && (
                <Button variant="ghost" size="sm" onClick={() => copyToClipboard(lastRequest)} className="h-7 text-xs">
                  {copySuccess ? <Check className="h-3 w-3 mr-1" /> : <Copy className="h-3 w-3 mr-1" />}
                  {copySuccess ? "Copied" : "Copy Last Request"}
                </Button>
              )}
            </div>
            <Textarea
              value={jsonData}
              onChange={(e) => setJsonData(e.target.value)}
              className="h-60 font-mono text-sm border-gray-300"
              placeholder="Enter JSON data"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Button onClick={handleGenerateStaticQR} className="bg-brand-primary hover:bg-brand-primary/90 text-white">
              <QrCode className="mr-2 h-4 w-4" />
              Generate Static QR
            </Button>
            <Button
              onClick={handleGenerateDynamicQR}
              className="bg-brand-secondary hover:bg-brand-secondary/90 text-white"
            >
              <Zap className="mr-2 h-4 w-4" />
              Generate Dynamic QR
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="history" className="pt-4">
          {requestHistory.length === 0 ? (
            <div className="text-center py-8 text-gray-500 border border-dashed rounded-lg">
              <History className="h-10 w-10 opacity-30 mx-auto mb-3" />
              No request history yet. Generate some QR codes to see your history.
            </div>
          ) : (
            <div className="space-y-3">
              {requestHistory.map((item, index) => (
                <Card
                  key={index}
                  className="hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => loadHistoryItem(item)}
                >
                  <CardContent className="p-3">
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center">
                        {item.type === "static" ? (
                          <QrCode className="h-4 w-4 mr-2 text-brand-primary" />
                        ) : (
                          <Zap className="h-4 w-4 mr-2 text-brand-secondary" />
                        )}
                        <span className="font-medium">
                          {item.type === "static" ? "Static" : "Dynamic"} QR - Template {item.request.templateId}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500">Journey: {item.request.journey}</span>
                    </div>
                    <div className="text-xs font-mono bg-gray-50 p-2 rounded max-h-24 overflow-auto">
                      {JSON.stringify(item.request.qrData, null, 2)}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="examples" className="pt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {exampleTemplates.map((example, index) => (
              <Card
                key={index}
                className="hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => loadExampleTemplate(example)}
              >
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">{example.name}</CardTitle>
                </CardHeader>
                <CardContent className="p-3">
                  <div className="text-xs font-mono bg-gray-50 p-2 rounded max-h-32 overflow-auto">
                    {JSON.stringify(example.data, null, 2)}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default EnhancedGenerateQrForm
