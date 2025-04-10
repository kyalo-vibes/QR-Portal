"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Header } from "@/components/Header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { UploadIcon as FileUpload, Settings, ImageIcon, Check, Upload, RefreshCw } from "lucide-react"
import {
  getAllJourneyTypes,
  getConfigsForJourney,
  updateConfigStatus,
  getLogoTemplatesForJourney,
  uploadLogoTemplate,
} from "@/services/configService"
import type { JourneyType, QrCodeConfig, LogoTemplate } from "@/types/config"

const LogoTemplates = () => {
  const [journeyTypes, setJourneyTypes] = useState<JourneyType[]>([])
  const [configs, setConfigs] = useState<Record<string, QrCodeConfig[]>>({})
  const [logoTemplates, setLogoTemplates] = useState<Record<string, LogoTemplate[]>>({})
  const [isLoading, setIsLoading] = useState(true)
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false)
  const [selectedJourneyId, setSelectedJourneyId] = useState<string>("")
  const [newLogoName, setNewLogoName] = useState<string>("")
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [qrPreviewUrl, setQrPreviewUrl] = useState<string | null>(null)
  const { toast } = useToast()

  // Fetch journey types on component mount
  useEffect(() => {
    fetchJourneyTypes()
  }, [])

  // Fetch configs and logos when journey types change
  useEffect(() => {
    if (journeyTypes.length > 0) {
      fetchConfigsAndLogos()
    }
  }, [journeyTypes])

  const fetchJourneyTypes = async () => {
    setIsLoading(true)
    try {
      const data = await getAllJourneyTypes()
      setJourneyTypes(data)
      if (data.length > 0) {
        setSelectedJourneyId(data[0].journeyId)
      }
    } catch (error) {
      console.error("Error fetching journey types:", error)
      toast({
        title: "Error",
        description: "Failed to load journey types",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const fetchConfigsAndLogos = async () => {
    setIsLoading(true)
    try {
      const configPromises = journeyTypes.map((journey) =>
        getConfigsForJourney(journey.journeyId).then((journeyConfigs) => ({
          journeyId: journey.journeyId,
          configs: journeyConfigs,
        })),
      )

      const logoPromises = journeyTypes.map((journey) =>
        getLogoTemplatesForJourney(journey.journeyId).then((logos) => ({ journeyId: journey.journeyId, logos })),
      )

      const configResults = await Promise.all(configPromises)
      const logoResults = await Promise.all(logoPromises)

      const configsMap: Record<string, QrCodeConfig[]> = {}
      const logosMap: Record<string, LogoTemplate[]> = {}

      configResults.forEach((result) => {
        configsMap[result.journeyId] = result.configs
      })

      logoResults.forEach((result) => {
        logosMap[result.journeyId] = result.logos
      })

      setConfigs(configsMap)
      setLogoTemplates(logosMap)
    } catch (error) {
      console.error("Error fetching configs and logos:", error)
      toast({
        title: "Error",
        description: "Failed to load configurations and logos",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSetActive = async (journeyId: string, templateId: number, isActive: boolean) => {
    try {
      await updateConfigStatus(journeyId, templateId, isActive, false)

      // Update local state
      setConfigs((prevConfigs) => {
        const updatedConfigs = { ...prevConfigs }

        if (updatedConfigs[journeyId]) {
          // Set all configs for this journey to inactive
          if (isActive) {
            updatedConfigs[journeyId] = updatedConfigs[journeyId].map((config) => ({
              ...config,
              isActive: "0",
            }))
          }

          // Update the specific config
          updatedConfigs[journeyId] = updatedConfigs[journeyId].map((config) =>
            config.templateId === templateId ? { ...config, isActive: isActive ? "1" : "0" } : config,
          )
        }

        return updatedConfigs
      })

      toast({
        title: "Success",
        description: `Template ${isActive ? "activated" : "deactivated"} successfully`,
      })
    } catch (error) {
      console.error("Error updating config status:", error)
      toast({
        title: "Error",
        description: "Failed to update template status",
        variant: "destructive",
      })
    }
  }

  const handleSetDefault = async (journeyId: string, templateId: number, isDefault: boolean) => {
    try {
      await updateConfigStatus(journeyId, templateId, false, isDefault)

      // Update local state
      setConfigs((prevConfigs) => {
        const updatedConfigs = { ...prevConfigs }

        if (updatedConfigs[journeyId]) {
          // Set all configs for this journey to non-default
          if (isDefault) {
            updatedConfigs[journeyId] = updatedConfigs[journeyId].map((config) => ({
              ...config,
              isDefault: "0",
            }))
          }

          // Update the specific config
          updatedConfigs[journeyId] = updatedConfigs[journeyId].map((config) =>
            config.templateId === templateId ? { ...config, isDefault: isDefault ? "1" : "0" } : config,
          )
        }

        return updatedConfigs
      })

      toast({
        title: "Success",
        description: `Template ${isDefault ? "set as default" : "removed from default"} successfully`,
      })
    } catch (error) {
      console.error("Error updating config status:", error)
      toast({
        title: "Error",
        description: "Failed to update template status",
        variant: "destructive",
      })
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setLogoFile(file)
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)

      // Generate a mock QR code with the logo for preview
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

  const handleUploadLogo = async () => {
    if (!logoFile || !newLogoName || !selectedJourneyId) {
      toast({
        title: "Missing Information",
        description: "Please provide a logo name and file",
        variant: "destructive",
      })
      return
    }

    try {
      await uploadLogoTemplate(selectedJourneyId, newLogoName, logoFile)

      // Refresh logo templates
      const updatedLogos = await getLogoTemplatesForJourney(selectedJourneyId)

      setLogoTemplates((prev) => ({
        ...prev,
        [selectedJourneyId]: updatedLogos,
      }))

      // Reset form
      setNewLogoName("")
      setLogoFile(null)
      setPreviewUrl(null)
      setQrPreviewUrl(null)
      setIsUploadDialogOpen(false)

      toast({
        title: "Success",
        description: "Logo template uploaded successfully",
      })
    } catch (error) {
      console.error("Error uploading logo template:", error)
      toast({
        title: "Error",
        description: "Failed to upload logo template",
        variant: "destructive",
      })
    }
  }

  const openUploadDialog = (journeyId: string) => {
    setSelectedJourneyId(journeyId)
    setNewLogoName("")
    setLogoFile(null)
    setPreviewUrl(null)
    setQrPreviewUrl(null)
    setIsUploadDialogOpen(true)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-brand-primary">Manage QR Configurations</h1>
          <Button onClick={fetchConfigsAndLogos} variant="outline" className="border-brand-primary text-brand-primary">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </div>

        <Tabs defaultValue="templates" className="space-y-4">
          <TabsList className="bg-brand-primary/10">
            <TabsTrigger
              value="templates"
              className="data-[state=active]:bg-brand-primary data-[state=active]:text-white"
            >
              Active Templates
            </TabsTrigger>
            <TabsTrigger value="logos" className="data-[state=active]:bg-brand-primary data-[state=active]:text-white">
              Logo Templates
            </TabsTrigger>
          </TabsList>

          <TabsContent value="templates" className="space-y-4">
            {isLoading ? (
              <div className="text-center py-8">Loading configurations...</div>
            ) : journeyTypes.length === 0 ? (
              <div className="text-center py-8 border border-dashed rounded-lg">
                <Settings className="h-10 w-10 opacity-30 mx-auto mb-3" />
                <p className="text-gray-500">No journey types found. Please create a journey type first.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {journeyTypes.map((journey) => (
                  <Card key={journey.journeyId} className="shadow-sm">
                    <CardHeader className="pb-2 border-b border-gray-100">
                      <CardTitle className="text-brand-primary flex items-center">
                        <Settings className="mr-2 h-5 w-5" />
                        {journey.journeyName} ({journey.journeyId})
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4">
                      {!configs[journey.journeyId] || configs[journey.journeyId].length === 0 ? (
                        <div className="text-center py-4 border border-dashed rounded-lg">
                          <p className="text-gray-500">No templates configured for this journey.</p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <div className="grid grid-cols-12 gap-4 font-medium text-sm text-gray-500 px-2">
                            <div className="col-span-1">ID</div>
                            <div className="col-span-3">Template</div>
                            <div className="col-span-2">Channel</div>
                            <div className="col-span-2">Description</div>
                            <div className="col-span-2 text-center">Active</div>
                            <div className="col-span-2 text-center">Default</div>
                          </div>
                          <Separator />
                          {configs[journey.journeyId].map((config) => (
                            <div
                              key={config.configId}
                              className="grid grid-cols-12 gap-4 items-center py-2 px-2 hover:bg-gray-50 rounded-md"
                            >
                              <div className="col-span-1 font-mono text-sm">{config.templateId}</div>
                              <div className="col-span-3">Template {config.templateId}</div>
                              <div className="col-span-2">Channel {config.channelId}</div>
                              <div className="col-span-2 text-sm text-gray-600">{config.configDesc || "-"}</div>
                              <div className="col-span-2 flex justify-center">
                                <Switch
                                  checked={config.isActive === "1"}
                                  onCheckedChange={(checked) =>
                                    handleSetActive(journey.journeyId, config.templateId, checked)
                                  }
                                  className="data-[state=checked]:bg-brand-primary"
                                />
                              </div>
                              <div className="col-span-2 flex justify-center">
                                <Switch
                                  checked={config.isDefault === "1"}
                                  onCheckedChange={(checked) =>
                                    handleSetDefault(journey.journeyId, config.templateId, checked)
                                  }
                                  className="data-[state=checked]:bg-brand-primary"
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="logos" className="space-y-4">
            {isLoading ? (
              <div className="text-center py-8">Loading logo templates...</div>
            ) : journeyTypes.length === 0 ? (
              <div className="text-center py-8 border border-dashed rounded-lg">
                <ImageIcon className="h-10 w-10 opacity-30 mx-auto mb-3" />
                <p className="text-gray-500">No journey types found. Please create a journey type first.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {journeyTypes.map((journey) => (
                  <Card key={journey.journeyId} className="shadow-sm">
                    <CardHeader className="pb-2 border-b border-gray-100 flex flex-row justify-between items-center">
                      <CardTitle className="text-brand-primary flex items-center">
                        <ImageIcon className="mr-2 h-5 w-5" />
                        {journey.journeyName} ({journey.journeyId})
                      </CardTitle>
                      <Button
                        onClick={() => openUploadDialog(journey.journeyId)}
                        className="bg-brand-primary hover:bg-brand-primary/90 text-white"
                      >
                        <Upload className="mr-2 h-4 w-4" />
                        Upload Logo
                      </Button>
                    </CardHeader>
                    <CardContent className="pt-4">
                      {!logoTemplates[journey.journeyId] || logoTemplates[journey.journeyId].length === 0 ? (
                        <div className="text-center py-4 border border-dashed rounded-lg">
                          <p className="text-gray-500">No logo templates found for this journey.</p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {logoTemplates[journey.journeyId].map((logo) => (
                            <Card key={logo.templateId} className="overflow-hidden">
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
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Logo Upload Dialog */}
      <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center text-brand-primary">
              <FileUpload className="mr-2 h-5 w-5" />
              Upload Logo Template
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="logo-name">Logo Template Name</Label>
              <Input
                id="logo-name"
                placeholder="Enter logo name"
                value={newLogoName}
                onChange={(e) => setNewLogoName(e.target.value)}
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
            </div>
            {previewUrl && (
              <div className="space-y-2">
                <Label>Preview</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="border rounded-md p-2 flex items-center justify-center bg-white">
                    <img
                      src={previewUrl || "/placeholder.svg"}
                      alt="Logo Preview"
                      className="max-w-full max-h-[150px] object-contain"
                    />
                  </div>
                  {qrPreviewUrl && (
                    <div className="border rounded-md p-2 flex flex-col items-center justify-center bg-white">
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
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsUploadDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUploadLogo} className="bg-brand-primary hover:bg-brand-primary/90 text-white">
              <Check className="mr-2 h-4 w-4" />
              Upload
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default LogoTemplates
