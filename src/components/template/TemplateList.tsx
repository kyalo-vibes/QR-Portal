"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileCode } from "lucide-react"
import type { Template } from "@/types/template"

interface TemplateListProps {
  templates: Template[]
  isLoading: boolean
  selectedTemplate: Template | null
  onSelectTemplate: (id: number) => void
}

const TemplateList: React.FC<TemplateListProps> = ({ templates, isLoading, selectedTemplate, onSelectTemplate }) => {
  return (
    <Card className="md:col-span-1 h-fit shadow-sm">
      <CardHeader className="pb-2 border-b border-gray-100">
        <CardTitle className="text-[#00513B] flex items-center">
          <FileCode className="mr-2 h-5 w-5" />
          Templates
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        {isLoading ? (
          <div className="text-center py-4">Loading templates...</div>
        ) : templates.length > 0 ? (
          <ul className="space-y-2">
            {templates.map((template) => (
              <li key={template.id}>
                <Button
                  variant={selectedTemplate?.id === template.id ? "default" : "outline"}
                  className={`w-full justify-start ${selectedTemplate?.id === template.id ? "bg-[#00513B]" : "border-[#00513B]/30 hover:bg-[#00513B]/10 text-[#00513B]"}`}
                  onClick={() => onSelectTemplate(template.id)}
                >
                  <span className="truncate">{template.name}</span>
                  <span className="ml-auto px-2 py-0.5 text-xs bg-gray-100 text-gray-800 rounded-full">
                    {template.journeyId}
                  </span>
                </Button>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center py-8 border border-dashed rounded-md">
            <FileCode className="h-10 w-10 opacity-30 mx-auto mb-3" />
            <p className="text-gray-500">No templates found. Create a new template to get started.</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default TemplateList
