"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Header } from "@/components/Header"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import type { Template, TemplateTag, SubTemplateTag } from "@/types/template"
import { getAllTemplates, createTemplate, addTagToTemplate } from "@/services/templateService"
import { generateSampleQRString } from "@/utils/qrUtils"

// Import components
import TemplateList from "@/components/template/TemplateList"
import TemplateDetails from "@/components/template/TemplateDetails"
import TemplateHeaderActions from "@/components/template/TemplateHeaderActions"
import NewTemplateForm from "@/components/template/NewTemplateForm"
import TagForm from "@/components/template/TagForm"
import SubtagForm from "@/components/template/SubtagForm"
import { QrCode } from "lucide-react"

const TemplateManager: React.FC = () => {
  const [templates, setTemplates] = useState<Template[]>([])
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isNewTemplateDialogOpen, setIsNewTemplateDialogOpen] = useState(false)
  const [isNewTagDialogOpen, setIsNewTagDialogOpen] = useState(false)
  const [isAddSubtagDialogOpen, setIsAddSubtagDialogOpen] = useState(false)
  const [selectedParentTagId, setSelectedParentTagId] = useState<number | null>(null)
  const [selectedParentSubtagId, setSelectedParentSubtagId] = useState<number | null>(null)
  const [sampleQRString, setSampleQRString] = useState<string>("{}")
  const [copySuccess, setCopySuccess] = useState(false)
  const [newTag, setNewTag] = useState<Partial<TemplateTag>>({})
  const [newSubtag, setNewSubtag] = useState<Partial<SubTemplateTag>>({})

  const { toast } = useToast()

  // Fetch templates on component mount
  useEffect(() => {
    fetchTemplates()
  }, [])

  // Generate sample QR string when selected template changes
  useEffect(() => {
    if (selectedTemplate) {
      const qrString = generateSampleQRString(selectedTemplate)
      setSampleQRString(qrString)
    }
  }, [selectedTemplate])

  const fetchTemplates = async () => {
    setIsLoading(true)
    try {
      const data = await getAllTemplates()
      setTemplates(data)

      // Select the first template by default if available
      if (data.length > 0 && !selectedTemplate) {
        setSelectedTemplate(data[0])
      }
    } catch (error) {
      console.error("Error fetching templates:", error)
      toast({
        title: "Error",
        description: "Failed to load templates",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSelectTemplate = (id: number) => {
    const template = templates.find((t) => t.id === id)
    if (template) {
      setSelectedTemplate(template)
    }
  }

  const handleCreateTemplate = async (name: string, journeyId: string) => {
    try {
      const newTemplate = await createTemplate({
        name,
        journeyId,
        tags: [],
      })
      setTemplates((prev) => [...prev, newTemplate])
      setSelectedTemplate(newTemplate)
      setIsNewTemplateDialogOpen(false)

      toast({
        title: "Success",
        description: "Template created successfully",
      })
    } catch (error) {
      console.error("Error creating template:", error)
      toast({
        title: "Error",
        description: "Failed to create template",
        variant: "destructive",
      })
    }
  }

  const handleAddTag = async () => {
    if (!selectedTemplate) return

    // Validate required fields
    if (
      !newTag.tagGroup ||
      !newTag.tagId ||
      !newTag.contentDesc ||
      newTag.minLength === undefined ||
      newTag.maxLength === undefined
    ) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    try {
      const addedTag = await addTagToTemplate(selectedTemplate.id, newTag)

      // Update templates list and selected template
      const updatedTemplate = {
        ...selectedTemplate,
        tags: [...selectedTemplate.tags, addedTag],
      }

      setTemplates((prev) => prev.map((t) => (t.id === updatedTemplate.id ? updatedTemplate : t)))
      setSelectedTemplate(updatedTemplate)
      setIsNewTagDialogOpen(false)
      setNewTag({})

      toast({
        title: "Success",
        description: "Tag added successfully",
      })
    } catch (error) {
      console.error("Error adding tag:", error)
      toast({
        title: "Error",
        description: "Failed to add tag",
        variant: "destructive",
      })
    }
  }

  const openAddSubtagDialog = (tagId: number, subtagId?: number | null) => {
    setSelectedParentTagId(tagId)
    setSelectedParentSubtagId(subtagId || null)
    setIsAddSubtagDialogOpen(true)
  }

  const handleAddSubtag = async () => {
    if (!selectedTemplate || selectedParentTagId === null) return

    // Validate required fields
    if (
      !newSubtag.subTagId ||
      !newSubtag.contentDesc ||
      newSubtag.minLength === undefined ||
      newSubtag.maxLength === undefined
    ) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    try {
      await addSubtagToTag(selectedTemplate.id, selectedParentTagId, selectedParentSubtagId, newSubtag)

      // Refresh templates to get the updated structure
      await fetchTemplates()

      setIsAddSubtagDialogOpen(false)
      setNewSubtag({})

      toast({
        title: "Success",
        description: "Subtag added successfully",
      })
    } catch (error) {
      console.error("Error adding subtag:", error)
      toast({
        title: "Error",
        description: "Failed to add subtag",
        variant: "destructive",
      })
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopySuccess(true)
      setTimeout(() => setCopySuccess(false), 2000)
      toast({
        title: "Copied!",
        description: "QR string copied to clipboard.",
      })
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-[#00513B]">Template Manager</h1>
          <TemplateHeaderActions setIsNewTemplateDialogOpen={setIsNewTemplateDialogOpen} />
        </div>

        <Tabs defaultValue="templates" className="space-y-4">
          <TabsList className="bg-[#00513B]/10">
            <TabsTrigger value="templates" className="data-[state=active]:bg-[#00513B] data-[state=active]:text-white">
              Templates
            </TabsTrigger>
          </TabsList>

          <TabsContent value="templates" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <TemplateList
                templates={templates}
                isLoading={isLoading}
                selectedTemplate={selectedTemplate}
                onSelectTemplate={handleSelectTemplate}
              />

              <TemplateDetails
                selectedTemplate={selectedTemplate}
                sampleQRString={sampleQRString}
                copySuccess={copySuccess}
                copyToClipboard={copyToClipboard}
                setIsNewTagDialogOpen={setIsNewTagDialogOpen}
                openAddSubtagDialog={openAddSubtagDialog}
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Dialogs */}
      <Dialog open={isNewTemplateDialogOpen} onOpenChange={setIsNewTemplateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center text-[#00513B]">
              <QrCode className="mr-2 h-5 w-5" />
              Create New Template
            </DialogTitle>
          </DialogHeader>
          <NewTemplateForm onSubmit={handleCreateTemplate} onCancel={() => setIsNewTemplateDialogOpen(false)} />
        </DialogContent>
      </Dialog>

      <Dialog open={isNewTagDialogOpen} onOpenChange={setIsNewTagDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center text-[#00513B]">
              <QrCode className="mr-2 h-5 w-5" />
              Add New Tag
            </DialogTitle>
          </DialogHeader>
          <TagForm
            tag={newTag}
            setTag={setNewTag}
            onSubmit={handleAddTag}
            onCancel={() => setIsNewTagDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={isAddSubtagDialogOpen} onOpenChange={setIsAddSubtagDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center text-[#00513B]">
              <QrCode className="mr-2 h-5 w-5" />
              Add New Subtag
            </DialogTitle>
          </DialogHeader>
          <SubtagForm
            subtag={newSubtag}
            setSubtag={setNewSubtag}
            onSubmit={handleAddSubtag}
            onCancel={() => setIsAddSubtagDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default TemplateManager
