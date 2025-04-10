"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { PlusCircle, Copy, Check, Layers, Tag } from "lucide-react"
import type { Template } from "@/types/template"
import TagDisplay from "./TagDisplay"
import QrTlvViewer from "../qr/QrTlvViewer"

interface TemplateDetailsProps {
  selectedTemplate: Template | null
  sampleQRString: string
  copySuccess: boolean
  copyToClipboard: (text: string) => void
  setIsNewTagDialogOpen: (isOpen: boolean) => void
  openAddSubtagDialog: (tagId: number, subtagId?: number | null) => void
}

const TemplateDetails: React.FC<TemplateDetailsProps> = ({
  selectedTemplate,
  sampleQRString,
  copySuccess,
  copyToClipboard,
  setIsNewTagDialogOpen,
  openAddSubtagDialog,
}) => {
  const [showTlvView, setShowTlvView] = useState(false)

  if (!selectedTemplate) {
    return (
      <Card className="md:col-span-2 shadow-sm">
        <CardHeader className="pb-2 border-b border-gray-100">
          <CardTitle className="flex justify-between items-center">
            <span className="text-[#00513B]">Template Details</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="text-center py-12 text-gray-500 border border-dashed rounded-md">
            <Tag className="h-10 w-10 opacity-30 mx-auto mb-3" />
            <p>Select a template to view its details or create a new one.</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="md:col-span-2 shadow-sm">
      <CardHeader className="pb-2 border-b border-gray-100">
        <CardTitle className="flex justify-between items-center">
          <span className="text-[#00513B]">{selectedTemplate.name}</span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowTlvView(!showTlvView)}
            className="text-[#00513B] border-[#00513B]/30 hover:bg-[#00513B]/10"
          >
            <Layers className="h-4 w-4 mr-1" />
            {showTlvView ? "Hide TLV" : "Show TLV"}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <div>
          <div className="mb-4 flex justify-between items-center">
            <div>
              <span className="text-sm font-medium text-gray-500">Journey Type:</span>
              <span className="ml-2">{selectedTemplate.journeyId}</span>
            </div>
            <Button
              onClick={() => setIsNewTagDialogOpen(true)}
              className="bg-[#00513B] hover:bg-[#00513B]/90 text-white"
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Tag
            </Button>
          </div>

          {/* Sample QR String Preview */}
          <div className="mb-4 border rounded-md p-3 bg-gray-50">
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-semibold text-[#00513B] flex items-center">
                <Layers className="mr-2 h-4 w-4" />
                Sample QR Data
              </h4>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(sampleQRString)}
                className="text-[#00513B] hover:text-[#00513B]/80"
              >
                {copySuccess ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
            <pre className="whitespace-pre-wrap text-xs bg-white p-3 border rounded overflow-x-auto">
              {sampleQRString}
            </pre>
          </div>

          {showTlvView && <QrTlvViewer qrString={sampleQRString} className="mb-4" />}

          <Separator className="my-4" />

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[#00513B] flex items-center">
              <Tag className="mr-2 h-5 w-5" />
              Tags
            </h3>

            {selectedTemplate.tags.length === 0 ? (
              <div className="text-center py-8 border border-dashed rounded-md">
                <Tag className="h-10 w-10 opacity-30 mx-auto mb-3" />
                <p className="text-gray-500">No tags defined. Add your first tag to get started.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {selectedTemplate.tags.map((tag) => (
                  <TagDisplay key={tag.tagId} tag={tag} openAddSubtagDialog={openAddSubtagDialog} />
                ))}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default TemplateDetails
