"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Header } from "@/components/Header"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import {
  FileCode,
  ImageIcon,
  Tag,
  PlusCircle,
  Save,
  ArrowLeft,
  ArrowRight,
  Trash2,
  Layers,
  RefreshCw,
  Check,
  Copy,
} from "lucide-react"
import { getAllJourneyTypes, getLogoTemplatesForJourney } from "@/services/configService"
import type { JourneyType, LogoTemplate } from "@/types/config"
import type { Template, TemplateTag, SubTemplateTag } from "@/types/template"
import { getAllTemplates, getTemplateById } from "@/services/templateService"
import QrTlvViewer from "@/components/qr/QrTlvViewer"
import { generateSampleQRString } from "@/utils/qrUtils"

const TemplateWizard = () => {
  const { toast } = useToast()

  // Wizard state
  const [currentStep, setCurrentStep] = useState(1)
  const [isEditMode, setIsEditMode] = useState(isEditMode)
  const [existingTemplates, setExistingTemplates] = useState<Template[]>([])
  const [selectedExistingTemplateId, setSelectedExistingTemplateId] = useState<number | null>(null)
  const [showTlvView, setShowTlvView] = useState(false)
  const [sampleQRString, setSampleQRString] = useState<string>("{}")
  const [copySuccess, setCopySuccess] = useState(false)

  // Step 1: Journey Definition
  const [availableJourneys, setAvailableJourneys] = useState<JourneyType[]>([])
  const [selectedJourneyId, setSelectedJourneyId] = useState<string>("")
  const [newJourneyId, setNewJourneyId] = useState<string>("")
  const [newJourneyName, setNewJourneyName] = useState<string>("")
  const [isNewJourney, setIsNewJourney] = useState(false)

  // Step 2: Logo Assignment
  const [logoName, setLogoName] = useState<string>("")
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [logoPreviewUrl, setLogoPreviewUrl] = useState<string | null>(null)
  const [qrPreviewUrl, setQrPreviewUrl] = useState<string | null>(null)
  const [useExistingLogo, setUseExistingLogo] = useState(false)
  const [availableLogos, setAvailableLogos] = useState<LogoTemplate[]>([])
  const [selectedLogoId, setSelectedLogoId] = useState<number | null>(null)

  // Step 3: TLV Structure
  const [templateName, setTemplateName] = useState<string>("")
  const [tags, setTags] = useState<TemplateTag[]>([])
  const [isTagDialogOpen, setIsTagDialogOpen] = useState(false)
  const [isSubtagDialogOpen, setIsSubtagDialogOpen] = useState(false)
  const [newTag, setNewTag] = useState<Partial<TemplateTag>>({})
  const [newSubtag, setNewSubtag] = useState<Partial<SubTemplateTag>>({})
  const [selectedParentTagId, setSelectedParentTagId] = useState<number | null>(null)
  const [selectedParentSubtagId, setSelectedParentSubtagId] = useState<number | null>(null)

  // Load journeys and templates on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [journeys, templates] = await Promise.all([getAllJourneyTypes(), getAllTemplates()])

        setAvailableJourneys(journeys)
        setExistingTemplates(templates)

        if (journeys.length > 0) {
          setSelectedJourneyId(journeys[0].journeyId)
          fetchLogosForJourney(journeys[0].journeyId)
        }
      } catch (error) {
        console.error("Error fetching initial data:", error)
        toast({
          title: "Error",
          description: "Failed to load initial data",
          variant: "destructive",
        })
      }
    }

    fetchData()
  }, [toast])

  // Load existing template data when selected
  useEffect(() => {
    if (selectedExistingTemplateId) {
      const loadTemplate = async () => {
        try {
          const template = await getTemplateById(selectedExistingTemplateId)

          if (template) {
            // Set journey
            setSelectedJourneyId(template.journeyId)
            setIsNewJourney(false)
            fetchLogosForJourney(template.journeyId)

            // Set template name
            setTemplateName(template.name)

            // Set tags
            setTags(template.tags)

            // Mock logo data (in a real app, you'd fetch this)
            setLogoName(`Logo for ${template.name}`)
            setLogoPreviewUrl(
                "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiB2aWV3Qm94PSIwIDAgMTAwIDEwMCI+PHJlY3Qgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiIGZpbGw9IiMwMDUxM0IiLz48dGV4dCB4PSI1MCIgeT0iNTAiIGZvbnQtc2l6ZT0iMjAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGFsaWdubWVudC1iYXNlbGluZT0ibWlkZGxlIiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZmlsbD0id2hpdGUiPkxPR088L3RleHQ+PC9zdmc+",
            )
            generateQrPreview(
                "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiB2aWV3Qm94PSIwIDAgMTAwIDEwMCI+PHJlY3Qgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiIGZpbGw9IiMwMDUxM0IiLz48dGV4dCB4PSI1MCIgeT0iNTAiIGZvbnQtc2l6ZT0iMjAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGFsaWdubWVudC1iYXNlbGluZT0ibWlkZGxlIiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZmlsbD0id2hpdGUiPkxPR088L3RleHQ+PC9zdmc+",
            )

            // Move to step 1
            setCurrentStep(1)
            setIsEditMode(true)

            // Generate sample QR string
            const qrString = generateSampleQRString(template)
            setSampleQRString(qrString)

            toast({
              title: "Template Loaded",
              description: `Loaded template: ${template.name}`,
              variant: "success",
            })
          }
        } catch (error) {
          console.error("Error loading template:", error)
          toast({
            title: "Error",
            description: "Failed to load template data",
            variant: "destructive",
          })
        }
      }

      loadTemplate()
    }
  }, [selectedExistingTemplateId, toast])

  // Update sample QR string when tags change
  useEffect(() => {
    if (tags.length > 0) {
      const mockTemplate: Template = {
        id: 0,
        name: templateName || "Template Preview",
        journeyId: isNewJourney ? newJourneyId : selectedJourneyId,
        tags: tags,
      }
      const qrString = generateSampleQRString(mockTemplate)
      setSampleQRString(qrString)
    }
  }, [tags, templateName, isNewJourney, newJourneyId, selectedJourneyId])

  const fetchLogosForJourney = async (journeyId: string) => {
    try {
      const logos = await getLogoTemplatesForJourney(journeyId)
      setAvailableLogos(logos)
      if (logos.length > 0) {
        setSelectedLogoId(logos[0].templateId)
      }
    } catch (error) {
      console.error("Error fetching logos:", error)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setLogoFile(file)
      const url = URL.createObjectURL(file)
      setLogoPreviewUrl(url)
      generateQrPreview(url)
    }
  }

  const generateQrPreview = (logoUrl: string) => {
    // In a real implementation, this would call an API to generate a QR code with the logo
    // For now, we'll just use a placeholder QR code with the logo overlaid
    setQrPreviewUrl(
        `data:image/png;base64,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`,
    )
  }

  const handleLogoSelect = (logoId: number) => {
    setSelectedLogoId(logoId)
    const selectedLogo = availableLogos.find((logo) => logo.templateId === logoId)
    if (selectedLogo) {
      setLogoName(selectedLogo.templateName)
      setLogoPreviewUrl(selectedLogo.imageUrl)
      generateQrPreview(selectedLogo.imageUrl)
    }
  }

  const handleJourneyChange = (journeyId: string) => {
    setSelectedJourneyId(journeyId)
    fetchLogosForJourney(journeyId)
  }

  const handleNextStep = () => {
    // Validate current step
    if (currentStep === 1) {
      if (isNewJourney && (!newJourneyId || !newJourneyName)) {
        toast({
          title: "Missing Information",
          description: "Please provide both Journey ID and Name",
          variant: "destructive",
        })
        return
      } else if (!isNewJourney && !selectedJourneyId) {
        toast({
          title: "Missing Information",
          description: "Please select a Journey",
          variant: "destructive",
        })
        return
      }
    } else if (currentStep === 2) {
      if (!logoName) {
        toast({
          title: "Missing Information",
          description: "Please provide a logo name",
          variant: "destructive",
        })
        return
      }

      // In edit mode or when using existing logo, we don't require a new logo file
      if (!isEditMode && !useExistingLogo && !logoFile && !logoPreviewUrl) {
        toast({
          title: "Missing Information",
          description: "Please upload a logo image or select an existing one",
          variant: "destructive",
        })
        return
      }
    }

    setCurrentStep((prev) => prev + 1)
  }

  const handlePreviousStep = () => {
    setCurrentStep((prev) => prev - 1)
  }

  const handleAddTag = () => {
    setNewTag({
      tagId: 0,
      templateId: 0,
      journeyId: isNewJourney ? newJourneyId : selectedJourneyId,
      minLength: 0,
      maxLength: 0,
      tagGroup: "",
      contentDesc: "",
      jsonKey: "",
      contentValue: "",
      format: "S",
      isStatic: "0",
      isDynamic: "0",
      required: "0",
      usage: "",
      valid: "1",
      verifyJson: "0",
      hasChild: "0",
    })
    setIsTagDialogOpen(true)
  }

  const handleSaveTag = () => {
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

    // Generate a unique tag ID if not provided
    const tagId = newTag.tagId || Math.max(0, ...tags.map((t) => t.tagId)) + 1

    const completeTag: TemplateTag = {
      ...(newTag as TemplateTag),
      tagId,
      templateId: 0, // Will be assigned when saving the template
      journeyId: isNewJourney ? newJourneyId : selectedJourneyId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      subtags: [],
    }

    setTags((prev) => [...prev, completeTag])
    setIsTagDialogOpen(false)
    setNewTag({})

    toast({
      title: "Success",
      description: "Tag added successfully",
    })
  }

  const handleAddSubtag = (tagId: number, subtagId?: number | null) => {
    setSelectedParentTagId(tagId)
    setSelectedParentSubtagId(subtagId || null)

    setNewSubtag({
      subTagId: 0,
      parentTemplateTagId: tagId,
      parentSubTagId: subtagId || null,
      templateId: 0,
      journeyId: isNewJourney ? newJourneyId : selectedJourneyId,
      minLength: 0,
      maxLength: 0,
      contentDesc: "",
      jsonKey: "",
      contentValue: "",
      format: "S",
      required: "0",
      usage: "",
      valid: "1",
      verifyJson: "0",
      hasChild: "0",
    })

    setIsSubtagDialogOpen(true)
  }

  const handleSaveSubtag = () => {
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

    if (selectedParentTagId === null) {
      toast({
        title: "Error",
        description: "Parent tag not found",
        variant: "destructive",
      })
      return
    }

    // Create a new subtag
    const newSubtagComplete: SubTemplateTag = {
      ...(newSubtag as SubTemplateTag),
      subTagSequence: Math.floor(Math.random() * 10000) + 1, // Generate a random sequence
      parentTemplateTagId: selectedParentTagId,
      parentSubTagId: selectedParentSubtagId,
      templateId: 0, // Will be assigned when saving the template
      journeyId: isNewJourney ? newJourneyId : selectedJourneyId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    // Add the subtag to the correct parent
    setTags((prevTags) => {
      return prevTags.map((tag) => {
        if (tag.tagId === selectedParentTagId) {
          // If adding directly to a tag
          if (selectedParentSubtagId === null) {
            tag.hasChild = "1"
            return {
              ...tag,
              subtags: [...(tag.subtags || []), newSubtagComplete],
            }
          }

          // If adding to a subtag, we need to recursively find it
          const addToSubtag = (subtags: SubTemplateTag[] | undefined): SubTemplateTag[] => {
            if (!subtags) return []

            return subtags.map((subtag) => {
              if (subtag.subTagSequence === selectedParentSubtagId) {
                subtag.hasChild = "1"
                return {
                  ...subtag,
                  subtags: [...(subtag.subtags || []), newSubtagComplete],
                }
              }

              if (subtag.subtags && subtag.subtags.length > 0) {
                return {
                  ...subtag,
                  subtags: addToSubtag(subtag.subtags),
                }
              }

              return subtag
            })
          }

          return {
            ...tag,
            subtags: addToSubtag(tag.subtags),
          }
        }

        return tag
      })
    })

    setIsSubtagDialogOpen(false)
    setNewSubtag({})
    setSelectedParentTagId(null)
    setSelectedParentSubtagId(null)

    toast({
      title: "Success",
      description: "Subtag added successfully",
    })
  }

  const handleRemoveTag = (tagId: number) => {
    setTags((prev) => prev.filter((tag) => tag.tagId !== tagId))

    toast({
      title: "Success",
      description: "Tag removed successfully",
    })
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

  const handleSaveTemplate = () => {
    // Validate template name
    if (!templateName) {
      toast({
        title: "Missing Information",
        description: "Please provide a template name",
        variant: "destructive",
      })
      return
    }

    // Validate tags
    if (tags.length === 0) {
      toast({
        title: "Missing Information",
        description: "Please add at least one tag to the template",
        variant: "destructive",
      })
      return
    }

    // In a real implementation, this would make API calls to:
    // 1. Create/update the journey if needed
    // 2. Upload the logo
    // 3. Create/update the template with tags and subtags

    toast({
      title: "Success",
      description: `Template ${isEditMode ? "updated" : "created"} successfully`,
    })

    // Reset form and go back to step 1
    if (!isEditMode) {
      setCurrentStep(1)
      setTemplateName("")
      setTags([])
      setLogoName("")
      setLogoFile(null)
      setLogoPreviewUrl(null)
      setQrPreviewUrl(null)
    }
  }

  const resetForm = () => {
    setIsEditMode(false)
    setSelectedExistingTemplateId(null)
    setCurrentStep(1)
    setTemplateName("")
    setTags([])
    setLogoName("")
    setLogoFile(null)
    setLogoPreviewUrl(null)
    setQrPreviewUrl(null)
    setIsNewJourney(false)
    setSelectedJourneyId(availableJourneys.length > 0 ? availableJourneys[0].journeyId : "")
    setNewJourneyId("")
    setNewJourneyName("")
    setUseExistingLogo(false)
    setSampleQRString("{}")

    toast({
      title: "Form Reset",
      description: "You can now create a new template",
    })
  }

  // Render subtags recursively
  const renderSubtags = (subtags: SubTemplateTag[] | undefined, level = 1, parentTagId: number) => {
    if (!subtags || subtags.length === 0) return null

    return (
        <div className={`ml-${level * 4}`}>
          {subtags.map((subtag) => (
              <div key={subtag.subTagSequence} className="border-l-2 border-brand-primary/30 pl-4 my-2">
                <div className="flex items-center justify-between bg-gray-50 p-2 rounded">
                  <div className="flex items-center">
                <span className="bg-brand-primary/10 text-brand-primary px-2 py-0.5 rounded-full text-xs font-medium mr-2">
                  {subtag.subTagId}
                </span>
                    <div>
                      <span className="font-semibold">{subtag.contentDesc}</span>
                      <span className="ml-2 text-sm text-gray-600">({subtag.jsonKey})</span>
                      {subtag.contentValue && <span className="ml-2 text-sm text-blue-600">= {subtag.contentValue}</span>}
                      <div className="flex mt-1 space-x-1">
                    <span
                        className={`px-2 py-0.5 rounded-full text-xs ${subtag.required === "1" ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"}`}
                    >
                      {subtag.required === "1" ? "Required" : "Optional"}
                    </span>
                        <span
                            className={`px-2 py-0.5 rounded-full text-xs ${subtag.verifyJson === "1" ? "bg-purple-100 text-purple-800" : "bg-gray-100 text-gray-800"}`}
                        >
                      {subtag.verifyJson === "1" ? "Verify JSON" : "No Verification"}
                    </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleAddSubtag(parentTagId, subtag.subTagSequence)}
                        className="text-brand-primary border-brand-primary/30 hover:bg-brand-primary/10"
                    >
                      <PlusCircle className="h-4 w-4 mr-1" />
                      Add Child
                    </Button>
                  </div>
                </div>
                {renderSubtags(subtag.subtags, level + 1, parentTagId)}
              </div>
          ))}
        </div>
    )
  }

  return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container py-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-brand-primary">
              {isEditMode ? "Edit Template" : "Create New Template"}
            </h1>

            <div className="flex items-center space-x-2">
              {!isEditMode && (
                  <>
                    <Label htmlFor="existing-template" className="text-sm font-medium">
                      Edit Existing:
                    </Label>
                    <Select
                        value={selectedExistingTemplateId?.toString() || ""}
                        onValueChange={(value) => setSelectedExistingTemplateId(Number(value))}
                    >
                      <SelectTrigger className="w-[200px] border-gray-300">
                        <SelectValue placeholder="Select template" />
                      </SelectTrigger>
                      <SelectContent>
                        {existingTemplates.map((template) => (
                            <SelectItem key={template.id} value={template.id.toString()}>
                              {template.name}
                            </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </>
              )}
              <Button variant="outline" onClick={resetForm} className="border-brand-primary text-brand-primary">
                <RefreshCw className="mr-2 h-4 w-4" />
                New Template
              </Button>
            </div>
          </div>

          {/* Wizard Steps */}
          <div className="mb-8">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        currentStep >= 1 ? "bg-brand-primary text-white" : "bg-gray-200 text-gray-500"
                    }`}
                >
                  1
                </div>
                <div className={`h-1 w-16 ${currentStep >= 2 ? "bg-brand-primary" : "bg-gray-200"}`}></div>
                <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        currentStep >= 2 ? "bg-brand-primary text-white" : "bg-gray-200 text-gray-500"
                    }`}
                >
                  2
                </div>
                <div className={`h-1 w-16 ${currentStep >= 3 ? "bg-brand-primary" : "bg-gray-200"}`}></div>
                <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        currentStep >= 3 ? "bg-brand-primary text-white" : "bg-gray-200 text-gray-500"
                    }`}
                >
                  3
                </div>
              </div>
              <div className="text-sm text-gray-500">Step {currentStep} of 3</div>
            </div>
            <div className="flex justify-between mt-2 text-sm">
              <div className="w-10 text-center">Journey</div>
              <div className="w-10 text-center ml-16">Logo</div>
              <div className="w-10 text-center ml-16">Structure</div>
            </div>
          </div>

          {/* Step 1: Journey Definition */}
          {currentStep === 1 && (
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center text-brand-primary">
                    <FileCode className="mr-2 h-5 w-5" />
                    Step 1: Journey Definition
                  </CardTitle>
                  <CardDescription>Select an existing journey type or create a new one</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                        checked={!isNewJourney}
                        onCheckedChange={(checked) => setIsNewJourney(!checked)}
                        id="existing-journey"
                    />
                    <Label htmlFor="existing-journey">Use existing journey</Label>
                  </div>

                  {!isNewJourney ? (
                      <div className="space-y-2">
                        <Label htmlFor="journey-select">Select Journey</Label>
                        <Select value={selectedJourneyId} onValueChange={handleJourneyChange}>
                          <SelectTrigger id="journey-select" className="border-gray-300">
                            <SelectValue placeholder="Select journey" />
                          </SelectTrigger>
                          <SelectContent>
                            {availableJourneys.map((journey) => (
                                <SelectItem key={journey.journeyId} value={journey.journeyId}>
                                  {journey.journeyName} ({journey.journeyId})
                                </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                  ) : (
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="journey-id">Journey ID</Label>
                          <Input
                              id="journey-id"
                              placeholder="e.g., 03"
                              value={newJourneyId}
                              onChange={(e) => setNewJourneyId(e.target.value)}
                              className="border-gray-300"
                          />
                          <p className="text-xs text-gray-500">Enter a unique identifier for this journey (e.g., 03, 04)</p>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="journey-name">Journey Name</Label>
                          <Input
                              id="journey-name"
                              placeholder="e.g., mpesa"
                              value={newJourneyName}
                              onChange={(e) => setNewJourneyName(e.target.value)}
                              className="border-gray-300"
                          />
                          <p className="text-xs text-gray-500">
                            Enter a descriptive name for this journey (e.g., mpesa, airtime)
                          </p>
                        </div>
                      </div>
                  )}

                  <div className="flex justify-end pt-4">
                    <Button onClick={handleNextStep} className="bg-brand-primary hover:bg-brand-primary/90 text-white">
                      Next Step
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
          )}

          {/* Step 2: Logo Assignment */}
          {currentStep === 2 && (
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center text-brand-primary">
                    <ImageIcon className="mr-2 h-5 w-5" />
                    Step 2: Logo Assignment
                  </CardTitle>
                  <CardDescription>Upload and assign a logo for this template</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-2 mb-4">
                    <Switch
                        checked={useExistingLogo}
                        onCheckedChange={(checked) => setUseExistingLogo(checked)}
                        id="use-existing-logo"
                    />
                    <Label htmlFor="use-existing-logo">Use existing logo</Label>
                  </div>

                  {useExistingLogo ? (
                      <div className="space-y-4">
                        <Label>Select Existing Logo</Label>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {availableLogos.length === 0 ? (
                              <div className="col-span-3 text-center py-4 border border-dashed rounded-md">
                                <p className="text-gray-500">No logos available for this journey</p>
                              </div>
                          ) : (
                              availableLogos.map((logo) => (
                                  <Card
                                      key={logo.templateId}
                                      className={`overflow-hidden cursor-pointer transition-all ${selectedLogoId === logo.templateId ? "ring-2 ring-brand-primary" : ""}`}
                                      onClick={() => handleLogoSelect(logo.templateId)}
                                  >
                                    <div className="aspect-square bg-gray-100 flex items-center justify-center">
                                      <img
                                          src={logo.imageUrl || "/placeholder.svg"}
                                          alt={logo.templateName}
                                          className="max-w-full max-h-full object-contain"
                                      />
                                    </div>
                                    <CardContent className="p-3">
                                      <h3 className="font-medium">{logo.templateName}</h3>
                                      <p className="text-sm text-gray-500">Template ID: {logo.templateId}</p>
                                    </CardContent>
                                  </Card>
                              ))
                          )}
                        </div>
                      </div>
                  ) : (
                      <>
                        <div className="space-y-2">
                          <Label htmlFor="logo-name">Logo Template Name</Label>
                          <Input
                              id="logo-name"
                              placeholder="e.g., Coop Till Logo"
                              value={logoName}
                              onChange={(e) => setLogoName(e.target.value)}
                              className="border-gray-300"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="logo-file">Logo Image</Label>
                          <Input
                              id="logo-file"
                              type="file"
                              accept="image/*"
                              onChange={handleFileChange}
                              className="border-gray-300"
                          />
                          <p className="text-xs text-gray-500">
                            Upload a logo image to be used with this template (PNG, JPG, SVG recommended)
                          </p>
                        </div>
                      </>
                  )}

                  {(logoPreviewUrl || qrPreviewUrl) && (
                      <div className="mt-4">
                        <Label>Preview</Label>
                        <div className="mt-2 grid grid-cols-2 gap-4">
                          {logoPreviewUrl && (
                              <div className="border rounded-md p-4 bg-white flex items-center justify-center">
                                <img
                                    src={logoPreviewUrl || "/placeholder.svg"}
                                    alt="Logo Preview"
                                    className="max-w-full max-h-[150px] object-contain"
                                />
                              </div>
                          )}
                          {qrPreviewUrl && (
                              <div className="border rounded-md p-4 bg-white flex flex-col items-center justify-center">
                                <p className="text-xs text-gray-500 mb-2">QR with Logo Preview</p>
                                <img
                                    src={qrPreviewUrl || "/placeholder.svg"}
                                    alt="QR Preview"
                                    className="max-w-full max-h-[120px] object-contain"
                                />
                              </div>
                          )}
                        </div>
                      </div>
                  )}

                  <div className="flex justify-between pt-4">
                    <Button
                        variant="outline"
                        onClick={handlePreviousStep}
                        className="border-brand-primary text-brand-primary"
                    >
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Previous Step
                    </Button>
                    <Button onClick={handleNextStep} className="bg-brand-primary hover:bg-brand-primary/90 text-white">
                      Next Step
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
          )}

          {/* Step 3: TLV Structure Definition */}
          {currentStep === 3 && (
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center text-brand-primary justify-between">
                    <div className="flex items-center">
                      <Tag className="mr-2 h-5 w-5" />
                      Step 3: TLV Structure Definition
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowTlvView(!showTlvView)}
                        className="text-brand-primary border-brand-primary/30 hover:bg-brand-primary/10"
                    >
                      <Layers className="h-4 w-4 mr-1" />
                      {showTlvView ? "Hide TLV" : "Show TLV"}
                    </Button>
                  </CardTitle>
                  <CardDescription>Define the template structure with tags and subtags</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="template-name">Template Name</Label>
                    <Input
                        id="template-name"
                        placeholder="e.g., Basic Payment QR"
                        value={templateName}
                        onChange={(e) => setTemplateName(e.target.value)}
                        className="border-gray-300"
                    />
                  </div>

                  {/* Sample QR String Preview */}
                  {tags.length > 0 && (
                      <div className="mb-4 border rounded-md p-3 bg-gray-50">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="font-semibold text-brand-primary flex items-center">
                            <Layers className="mr-2 h-4 w-4" />
                            Sample QR Data
                          </h4>
                          <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyToClipboard(sampleQRString)}
                              className="text-brand-primary hover:text-brand-primary/80"
                          >
                            {copySuccess ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                          </Button>
                        </div>
                        <pre className="whitespace-pre-wrap text-xs bg-white p-3 border rounded overflow-x-auto">
                    {sampleQRString}
                  </pre>
                      </div>
                  )}

                  {showTlvView && tags.length > 0 && <QrTlvViewer qrString={sampleQRString} className="mb-4" />}

                  <Separator className="my-4" />

                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-brand-primary flex items-center">
                      <Tag className="mr-2 h-5 w-5" />
                      Tags
                    </h3>
                    <Button onClick={handleAddTag} className="bg-brand-primary hover:bg-brand-primary/90 text-white">
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Add Tag
                    </Button>
                  </div>

                  <div className="space-y-4 mt-4">
                    {tags.length === 0 ? (
                        <div className="text-center py-8 border border-dashed rounded-md">
                          <Tag className="h-10 w-10 opacity-30 mx-auto mb-3" />
                          <p className="text-gray-500">No tags defined. Add your first tag to get started.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                          {tags.map((tag) => (
                              <div key={tag.tagId} className="border rounded-md p-4 shadow-sm hover:shadow-md transition-all">
                                <div className="flex justify-between items-start">
                                  <div className="flex items-start">
                            <span className="bg-brand-primary text-white px-3 py-1 rounded-full text-sm font-medium mr-3 flex-shrink-0 mt-1">
                              {tag.tagId}
                            </span>
                                    <div>
                                      <h4 className="font-medium">{tag.contentDesc}</h4>
                                      <div className="text-sm text-gray-600 mt-1">
                                        <div>
                                          <span className="font-medium">Group:</span> {tag.tagGroup}
                                        </div>
                                        <div>
                                          <span className="font-medium">JSON Key:</span> {tag.jsonKey}
                                        </div>
                                        {tag.contentValue && (
                                            <div>
                                              <span className="font-medium">Value:</span> {tag.contentValue}
                                            </div>
                                        )}
                                        <div className="mt-2 flex flex-wrap gap-1">
                                  <span
                                      className={`px-2 py-0.5 rounded-full text-xs ${tag.isStatic === "1" && tag.isDynamic === "1" ? "bg-purple-100 text-purple-800" : tag.isStatic === "1" ? "bg-blue-100 text-blue-800" : tag.isDynamic === "1" ? "bg-orange-100 text-orange-800" : "bg-gray-100 text-gray-800"}`}
                                  >
                                    {tag.isStatic === "1" && tag.isDynamic === "1"
                                        ? "Static & Dynamic"
                                        : tag.isStatic === "1"
                                            ? "Static"
                                            : tag.isDynamic === "1"
                                                ? "Dynamic"
                                                : "Undefined"}
                                  </span>
                                          <span
                                              className={`px-2 py-0.5 rounded-full text-xs ${tag.required === "1" ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"}`}
                                          >
                                    {tag.required === "1" ? "Required" : "Optional"}
                                  </span>
                                          <span
                                              className={`px-2 py-0.5 rounded-full text-xs ${tag.verifyJson === "1" ? "bg-purple-100 text-purple-800" : "bg-gray-100 text-gray-800"}`}
                                          >
                                    {tag.verifyJson === "1" ? "Verify JSON" : "No Verification"}
                                  </span>
                                          <span
                                              className={`px-2 py-0.5 rounded-full text-xs ${tag.hasChild === "1" ? "bg-brand-secondary/10 text-brand-secondary" : "bg-gray-100 text-gray-800"}`}
                                          >
                                    {tag.hasChild === "1" ? "Has Children" : "No Children"}
                                  </span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="flex space-x-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleAddSubtag(tag.tagId)}
                                        className="text-brand-primary border-brand-primary/30 hover:bg-brand-primary/10"
                                    >
                                      <PlusCircle className="h-4 w-4 mr-1" />
                                      Add Subtag
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleRemoveTag(tag.tagId)}
                                        className="text-red-600 border-red-200 hover:bg-red-50"
                                    >
                                      <Trash2 className="h-4 w-4 mr-1" />
                                      Remove
                                    </Button>
                                  </div>
                                </div>

                                {/* Render subtags */}
                                {tag.subtags && tag.subtags.length > 0 && (
                                    <div className="mt-4">
                                      <h5 className="text-sm font-medium mb-2 text-brand-secondary">Subtags</h5>
                                      {renderSubtags(tag.subtags, 1, tag.tagId)}
                                    </div>
                                )}
                              </div>
                          ))}
                        </div>
                    )}
                  </div>

                  <div className="flex justify-between pt-4">
                    <Button
                        variant="outline"
                        onClick={handlePreviousStep}
                        className="border-brand-primary text-brand-primary"
                    >
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Previous Step
                    </Button>
                    <Button onClick={handleSaveTemplate} className="bg-brand-primary hover:bg-brand-primary/90 text-white">
                      <Save className="mr-2 h-4 w-4" />
                      {isEditMode ? "Update Template" : "Save Template"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
          )}

          {/* Tag Dialog */}
          <Dialog open={isTagDialogOpen} onOpenChange={setIsTagDialogOpen}>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle className="flex items-center text-brand-primary">
                  <Tag className="mr-2 h-5 w-5" />
                  Add New Tag
                </DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="tag-group">
                      Tag Group <span className="text-red-500">*</span>
                    </Label>
                    <Input
                        id="tag-group"
                        placeholder="e.g., Header, Data"
                        value={newTag.tagGroup || ""}
                        onChange={(e) => setNewTag({ ...newTag, tagGroup: e.target.value })}
                        className="border-gray-300"
                        required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tag-id">
                      Tag ID <span className="text-red-500">*</span>
                    </Label>
                    <Input
                        id="tag-id"
                        type="number"
                        placeholder="e.g., 1, 2, 3"
                        value={newTag.tagId || ""}
                        onChange={(e) => setNewTag({ ...newTag, tagId: Number.parseInt(e.target.value) || 0 })}
                        className="border-gray-300"
                        required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="content-desc">
                      Description <span className="text-red-500">*</span>
                    </Label>
                    <Input
                        id="content-desc"
                        placeholder="e.g., Amount, Currency"
                        value={newTag.contentDesc || ""}
                        onChange={(e) => setNewTag({ ...newTag, contentDesc: e.target.value })}
                        className="border-gray-300"
                        required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="json-key">JSON Key</Label>
                    <Input
                        id="json-key"
                        placeholder="e.g., amount, currency"
                        value={newTag.jsonKey || ""}
                        onChange={(e) => setNewTag({ ...newTag, jsonKey: e.target.value })}
                        className="border-gray-300"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="content-value">Value</Label>
                    <Input
                        id="content-value"
                        placeholder="Static value (if applicable)"
                        value={newTag.contentValue || ""}
                        onChange={(e) => setNewTag({ ...newTag, contentValue: e.target.value })}
                        className="border-gray-300"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="format">Format</Label>
                    <Select
                        value={newTag.format || "S"}
                        onValueChange={(value) => setNewTag({ ...newTag, format: value })}
                    >
                      <SelectTrigger className="border-gray-300">
                        <SelectValue placeholder="Select format" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="S">String (S)</SelectItem>
                        <SelectItem value="N">Numeric (N)</SelectItem>
                        <SelectItem value="A">Alphanumeric (A)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="min-length">
                      Min Length <span className="text-red-500">*</span>
                    </Label>
                    <Input
                        id="min-length"
                        type="number"
                        value={newTag.minLength || 0}
                        onChange={(e) => setNewTag({ ...newTag, minLength: Number.parseInt(e.target.value) || 0 })}
                        className="border-gray-300"
                        required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="max-length">
                      Max Length <span className="text-red-500">*</span>
                    </Label>
                    <Input
                        id="max-length"
                        type="number"
                        value={newTag.maxLength || 0}
                        onChange={(e) => setNewTag({ ...newTag, maxLength: Number.parseInt(e.target.value) || 0 })}
                        className="border-gray-300"
                        required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                        id="is-static"
                        checked={newTag.isStatic === "1"}
                        onCheckedChange={(checked) =>
                            setNewTag({
                              ...newTag,
                              isStatic: checked ? "1" : "0",
                            })
                        }
                    />
                    <Label htmlFor="is-static">Static</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                        id="is-dynamic"
                        checked={newTag.isDynamic === "1"}
                        onCheckedChange={(checked) =>
                            setNewTag({
                              ...newTag,
                              isDynamic: checked ? "1" : "0",
                            })
                        }
                    />
                    <Label htmlFor="is-dynamic">Dynamic</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                        id="required"
                        checked={newTag.required === "1"}
                        onCheckedChange={(checked) => setNewTag({ ...newTag, required: checked ? "1" : "0" })}
                    />
                    <Label htmlFor="required">Required</Label>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="verify-json">Verify JSON</Label>
                    <Input
                        id="verify-json"
                        placeholder="JSON verification expression"
                        value={newTag.verifyJson === "1" ? newTag.verifyJson || "" : ""}
                        onChange={(e) => setNewTag({ ...newTag, verifyJson: e.target.value ? "1" : "0" })}
                        className="border-gray-300"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                        id="has-child"
                        checked={newTag.hasChild === "1"}
                        onCheckedChange={(checked) => setNewTag({ ...newTag, hasChild: checked ? "1" : "0" })}
                    />
                    <Label htmlFor="has-child">Has Child</Label>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="usage">Usage</Label>
                  <Textarea
                      id="usage"
                      placeholder="Describe how this tag should be used"
                      value={newTag.usage || ""}
                      onChange={(e) => setNewTag({ ...newTag, usage: e.target.value })}
                      className="border-gray-300"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                    variant="outline"
                    onClick={() => setIsTagDialogOpen(false)}
                    className="border-brand-primary text-brand-primary"
                >
                  Cancel
                </Button>
                <Button className="bg-brand-primary hover:bg-brand-primary/90 text-white" onClick={handleSaveTag}>
                  Add Tag
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Subtag Dialog */}
          <Dialog open={isSubtagDialogOpen} onOpenChange={setIsSubtagDialogOpen}>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle className="flex items-center text-brand-primary">
                  <Tag className="mr-2 h-5 w-5" />
                  Add New Subtag
                </DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="subtag-id">
                      Subtag ID <span className="text-red-500">*</span>
                    </Label>
                    <Input
                        id="subtag-id"
                        type="number"
                        placeholder="e.g., 101, 102"
                        value={newSubtag.subTagId || ""}
                        onChange={(e) => setNewSubtag({ ...newSubtag, subTagId: Number.parseInt(e.target.value) || 0 })}
                        className="border-gray-300"
                        required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subtag-desc">
                      Description <span className="text-red-500">*</span>
                    </Label>
                    <Input
                        id="subtag-desc"
                        placeholder="e.g., Version, Code"
                        value={newSubtag.contentDesc || ""}
                        onChange={(e) => setNewSubtag({ ...newSubtag, contentDesc: e.target.value })}
                        className="border-gray-300"
                        required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="subtag-json-key">JSON Key</Label>
                    <Input
                        id="subtag-json-key"
                        placeholder="e.g., version, code"
                        value={newSubtag.jsonKey || ""}
                        onChange={(e) => setNewSubtag({ ...newSubtag, jsonKey: e.target.value })}
                        className="border-gray-300"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subtag-value">Value</Label>
                    <Input
                        id="subtag-value"
                        placeholder="Static value (if applicable)"
                        value={newSubtag.contentValue || ""}
                        onChange={(e) => setNewSubtag({ ...newSubtag, contentValue: e.target.value })}
                        className="border-gray-300"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="subtag-format">Format</Label>
                    <Select
                        value={newSubtag.format || "S"}
                        onValueChange={(value) => setNewSubtag({ ...newSubtag, format: value })}
                    >
                      <SelectTrigger className="border-gray-300">
                        <SelectValue placeholder="Select format" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="S">String (S)</SelectItem>
                        <SelectItem value="N">Numeric (N)</SelectItem>
                        <SelectItem value="A">Alphanumeric (A)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subtag-min-length">
                      Min Length <span className="text-red-500">*</span>
                    </Label>
                    <Input
                        id="subtag-min-length"
                        type="number"
                        value={newSubtag.minLength || 0}
                        onChange={(e) => setNewSubtag({ ...newSubtag, minLength: Number.parseInt(e.target.value) || 0 })}
                        className="border-gray-300"
                        required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subtag-max-length">
                      Max Length <span className="text-red-500">*</span>
                    </Label>
                    <Input
                        id="subtag-max-length"
                        type="number"
                        value={newSubtag.maxLength || 0}
                        onChange={(e) => setNewSubtag({ ...newSubtag, maxLength: Number.parseInt(e.target.value) || 0 })}
                        className="border-gray-300"
                        required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                        id="subtag-required"
                        checked={newSubtag.required === "1"}
                        onCheckedChange={(checked) => setNewSubtag({ ...newSubtag, required: checked ? "1" : "0" })}
                    />
                    <Label htmlFor="subtag-required">Required</Label>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subtag-verify-json">Verify JSON</Label>
                    <Input
                        id="subtag-verify-json"
                        placeholder="JSON verification expression"
                        value={newSubtag.verifyJson === "1" ? newSubtag.verifyJson || "" : ""}
                        onChange={(e) => setNewSubtag({ ...newSubtag, verifyJson: e.target.value ? "1" : "0" })}
                        className="border-gray-300"
                    />
                  </div>
                  <div className="flex items-center space-x-2 col-span-2">
                    <Switch
                        id="subtag-has-child"
                        checked={newSubtag.hasChild === "1"}
                        onCheckedChange={(checked) => setNewSubtag({ ...newSubtag, hasChild: checked ? "1" : "0" })}
                    />
                    <Label htmlFor="subtag-has-child">Has Child</Label>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subtag-usage">Usage</Label>
                  <Textarea
                      id="subtag-usage"
                      placeholder="Describe how this subtag should be used"
                      value={newSubtag.usage || ""}
                      onChange={(e) => setNewSubtag({ ...newSubtag, usage: e.target.value })}
                      className="border-gray-300"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                    variant="outline"
                    onClick={() => setIsSubtagDialogOpen(false)}
                    className="border-brand-primary text-brand-primary"
                >
                  Cancel
                </Button>
                <Button className="bg-brand-primary hover:bg-brand-primary/90 text-white" onClick={handleSaveSubtag}>
                  Add Subtag
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
  )
}

export default TemplateWizard
