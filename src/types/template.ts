export interface JourneyType {
  id: string
  name: string
}

export interface TemplateTag {
  tagId: number
  templateId: number
  journeyId: string
  minLength: number
  maxLength: number
  tagGroup: string
  contentDesc: string
  jsonKey: string
  contentValue: string
  format: string
  isStatic: "0" | "1"
  isDynamic: "0" | "1"
  required: "0" | "1"
  usage: string
  valid: "0" | "1"
  verifyJson: "0" | "1"
  hasChild: "0" | "1"
  createdAt: string
  updatedAt: string
  subtags?: SubTemplateTag[]
}

export interface SubTemplateTag {
  subTagSequence: number
  subTagId: number
  parentTemplateTagId: number | null
  parentSubTagId: number | null
  templateId: number
  journeyId: string
  minLength: number
  maxLength: number
  contentDesc: string
  jsonKey: string
  contentValue: string
  format: string
  required: "0" | "1"
  usage: string
  valid: "0" | "1"
  verifyJson: "0" | "1"
  hasChild: "0" | "1"
  createdAt: string
  updatedAt: string
  subtags?: SubTemplateTag[]
}

export interface Template {
  id: number
  name: string
  journeyId: string
  tags: TemplateTag[]
}

// API types
export interface GenerateQRCodeRequest {
  templateId: number
  journey: string
  qrData: Record<string, any>
  channelId?: number
  responseFormat?: string
  requestType?: string
}

export interface GenerateQRCodeResponse {
  responseCode: string
  responseMessage: string
  referenceNumber?: string
  qrString?: string
  qrCodeImage?: string
  format?: string
  size?: number
}

export interface VerifyQRCodeRequest {
  qrString: string
  requestMessageId: string
  requestDateTime: string
  requestType: string
  channelId: string
}

export interface VerifyQRCodeResponse {
  responseCode: string
  responseMessage: string
  data?: Record<string, any>
  isValid: boolean
  requestMessageId?: string
  validationStatus?: string
  paymentRouting?: Record<string, string>
}

export interface PaymentCallbackRequest {
  referenceNumber: string
  paymentRef: string
  requestMessageId?: string
}

export interface PaymentCallbackResponse {
  responseCode: string
  responseMessage: string
  requestMessageId?: string
  responseDateTime?: Date
}
