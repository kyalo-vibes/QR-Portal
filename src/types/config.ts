export interface JourneyType {
  journeyId: string
  journeyName: string
  createdAt: string
  updatedAt: string
}

export interface QrCodeConfig {
  configId: number
  journeyId: string
  templateId: number
  channelId: number
  configDesc: string
  isActive: "0" | "1"
  isDefault: "0" | "1"
  createdAt: string
  updatedAt: string
}

export interface LogoTemplate {
  templateId: number
  journeyId: string
  templateName: string
  imageUrl: string
  createdAt: string
  updatedAt: string
}
