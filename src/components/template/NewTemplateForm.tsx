"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Save } from "lucide-react"
import type { JourneyType } from "@/types/template"

interface NewTemplateFormProps {
  newTemplateName: string
  newTemplateJourney: string
  setNewTemplateName: (name: string) => void
  setNewTemplateJourney: (journey: string) => void
  handleCreateTemplate: () => void
  journeyTypes: JourneyType[]
}

const NewTemplateForm: React.FC<NewTemplateFormProps> = ({
  newTemplateName,
  newTemplateJourney,
  setNewTemplateName,
  setNewTemplateJourney,
  handleCreateTemplate,
  journeyTypes,
}) => {
  return (
    <Card className="mb-6 border-brand-primary border-2 shadow-sm">
      <CardHeader>
        <CardTitle className="text-brand-primary">Create New Template</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="template-name">Template Name</Label>
              <Input
                id="template-name"
                placeholder="Enter template name"
                value={newTemplateName}
                onChange={(e) => setNewTemplateName(e.target.value)}
                className="border-gray-300"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="journey-type">Journey Type</Label>
              <Select value={newTemplateJourney} onValueChange={setNewTemplateJourney}>
                <SelectTrigger className="border-gray-300">
                  <SelectValue placeholder="Select a journey type" />
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
          <div className="flex justify-end">
            <Button onClick={handleCreateTemplate} className="bg-brand-primary hover:bg-brand-primary/90 text-white">
              <Save className="mr-2 h-4 w-4" />
              Create Template
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default NewTemplateForm
