import type { JourneyType, QrCodeConfig, LogoTemplate } from "@/types/config"

// Mock data for journey types
const mockJourneyTypes: JourneyType[] = [
  {
    journeyId: "01",
    journeyName: "cooptill",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    journeyId: "02",
    journeyName: "coopduka",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    journeyId: "03",
    journeyName: "mpesa",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

// Mock data for QR code configs
const mockConfigs: Record<string, QrCodeConfig[]> = {
  "01": [
    {
      configId: 1,
      journeyId: "01",
      templateId: 1,
      channelId: 13,
      configDesc: "First template for cooptill",
      isActive: "1",
      isDefault: "1",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      configId: 2,
      journeyId: "01",
      templateId: 2,
      channelId: 13,
      configDesc: "Second template for cooptill",
      isActive: "0",
      isDefault: "0",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ],
  "02": [
    {
      configId: 3,
      journeyId: "02",
      templateId: 3,
      channelId: 14,
      configDesc: "First template for coopduka",
      isActive: "1",
      isDefault: "1",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ],
  "03": [],
}

// Mock data for logo templates
const mockLogoTemplates: Record<string, LogoTemplate[]> = {
  "01": [
    {
      templateId: 1,
      journeyId: "01",
      templateName: "Coop Till Logo",
      imageUrl:
        "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiB2aWV3Qm94PSIwIDAgMTAwIDEwMCI+PHJlY3Qgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiIGZpbGw9IiMwMDUxM0IiLz48dGV4dCB4PSI1MCIgeT0iNTAiIGZvbnQtc2l6ZT0iMjAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGFsaWdubWVudC1iYXNlbGluZT0ibWlkZGxlIiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZmlsbD0id2hpdGUiPkNPT1A8L3RleHQ+PC9zdmc+",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ],
  "02": [
    {
      templateId: 2,
      journeyId: "02",
      templateName: "Coop Duka Logo",
      imageUrl:
        "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiB2aWV3Qm94PSIwIDAgMTAwIDEwMCI+PHJlY3Qgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiIGZpbGw9IiM2OEFCMDAiLz48dGV4dCB4PSI1MCIgeT0iNTAiIGZvbnQtc2l6ZT0iMjAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGFsaWdubWVudC1iYXNlbGluZT0ibWlkZGxlIiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZmlsbD0id2hpdGUiPkRVS0E8L3RleHQ+PC9zdmc+",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ],
  "03": [],
}

// Get all journey types
export const getAllJourneyTypes = async (): Promise<JourneyType[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockJourneyTypes)
    }, 300)
  })
}

// Get configs for a specific journey
export const getConfigsForJourney = async (journeyId: string): Promise<QrCodeConfig[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockConfigs[journeyId] || [])
    }, 300)
  })
}

// Update config status (active/default)
export const updateConfigStatus = async (
  journeyId: string,
  templateId: number,
  isActive: boolean,
  isDefault: boolean,
): Promise<boolean> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // In a real implementation, this would make an API call
      // For now, we'll just update our mock data
      if (mockConfigs[journeyId]) {
        if (isActive) {
          // Set all configs for this journey to inactive
          mockConfigs[journeyId].forEach((config) => {
            config.isActive = "0"
          })
        }

        if (isDefault) {
          // Set all configs for this journey to non-default
          mockConfigs[journeyId].forEach((config) => {
            config.isDefault = "0"
          })
        }

        // Update the specific config
        const configToUpdate = mockConfigs[journeyId].find((config) => config.templateId === templateId)
        if (configToUpdate) {
          if (isActive !== undefined) configToUpdate.isActive = isActive ? "1" : "0"
          if (isDefault !== undefined) configToUpdate.isDefault = isDefault ? "1" : "0"
        }
      }

      resolve(true)
    }, 300)
  })
}

// Get logo templates for a specific journey
export const getLogoTemplatesForJourney = async (journeyId: string): Promise<LogoTemplate[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockLogoTemplates[journeyId] || [])
    }, 300)
  })
}

// Upload a new logo template
export const uploadLogoTemplate = async (
  journeyId: string,
  templateName: string,
  logoFile: File,
): Promise<LogoTemplate> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // In a real implementation, this would upload the file to a server
      // For now, we'll just create a data URL and add it to our mock data
      const reader = new FileReader()
      reader.onload = () => {
        const imageUrl = reader.result as string

        const newTemplateId =
          Math.max(
            ...Object.values(mockLogoTemplates)
              .flat()
              .map((logo) => logo.templateId),
            0,
          ) + 1

        const newLogo: LogoTemplate = {
          templateId: newTemplateId,
          journeyId,
          templateName,
          imageUrl,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }

        if (!mockLogoTemplates[journeyId]) {
          mockLogoTemplates[journeyId] = []
        }

        mockLogoTemplates[journeyId].push(newLogo)

        resolve(newLogo)
      }

      reader.readAsDataURL(logoFile)
    }, 500)
  })
}
