"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { QrCode, Zap } from "lucide-react"
import { generateStaticQRCode, generateDynamicQRCode } from "@/services/apiService"
import { journeyTypes } from "@/services/templateService"
import type { Template, GenerateQRCodeRequest, GenerateQRCodeResponse } from "@/types/template"
import { useToast } from "@/hooks/use-toast"

// Channel IDs for dropdown
const channelOptions = [
  { id: "1", name: "Mobile App" },
  { id: "2", name: "Web Portal" },
  { id: "3", name: "Branch Kiosk" },
  { id: "4", name: "ATM" },
  { id: "5", name: "Agency" },
]

// Response format options
const responseFormatOptions = [
  { id: "image", name: "Image" },
  { id: "pdf", name: "PDF" },
]

interface GenerateQrFormProps {
  templates: Template[]
  onGenerateResponse: (response: GenerateQRCodeResponse) => void
}

const GenerateQrForm: React.FC<GenerateQrFormProps> = ({ templates, onGenerateResponse }) => {
  const { toast } = useToast()

  // Form state
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>("")
  const [selectedJourneyId, setSelectedJourneyId] = useState<string>("")
  const [selectedChannelId, setSelectedChannelId] = useState<string>("1")
  const [selectedResponseFormat, setSelectedResponseFormat] = useState<string>("image")
  const [jsonData, setJsonData] = useState<string>('{\n  "amount": "100.00",\n  "currency": "USD"\n}')

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

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Template</label>
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
          <label className="block text-sm font-medium text-gray-700 mb-1">Journey</label>
          <Select value={selectedJourneyId} onValueChange={setSelectedJourneyId}>
            <SelectTrigger className="border-gray-300">
              <SelectValue placeholder="Select journey" />
            </SelectTrigger>
            <SelectContent>
              {journeyTypes.map((journey) => (
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
          <label className="block text-sm font-medium text-gray-700 mb-1">Channel</label>
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
          <label className="block text-sm font-medium text-gray-700 mb-1">Response Format</label>
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
        <label className="block text-sm font-medium text-gray-700 mb-1">Data (JSON)</label>
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
        <Button onClick={handleGenerateDynamicQR} className="bg-brand-secondary hover:bg-brand-secondary/90 text-white">
          <Zap className="mr-2 h-4 w-4" />
          Generate Dynamic QR
        </Button>
      </div>
    </div>
  )
}

export default GenerateQrForm
