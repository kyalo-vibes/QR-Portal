import type {
  GenerateQRCodeRequest,
  GenerateQRCodeResponse,
  PaymentCallbackRequest,
  PaymentCallbackResponse,
  VerifyQRCodeRequest,
  VerifyQRCodeResponse,
} from "@/types/template"

// Base URL for the API
const API_BASE_URL = "http://172.16.20.52/qrcode-engine/api/v1.0/qrcode"

// Generate a static QR code
export const generateStaticQRCode = async (request: GenerateQRCodeRequest): Promise<GenerateQRCodeResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/generate-static`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    })

    if (!response.ok) {
      // Handle API errors more explicitly if needed, or fallback to mock
      const errorBody = await response.text() // Try to get more error info
      console.error(`API error: ${response.status} ${response.statusText}`, errorBody)
      throw new Error(`API error: ${response.status} ${response.statusText}`)
    }

    // return await response.json();
    // Parse the successful JSON response from the actual API
    const apiData = await response.json()

    // Construct the frontend response object, adding the missing fields
    // Assuming apiData has shape: { qrCodeImage: string, format: string, size: number }
    // Also assuming referenceNumber is NOT returned by this specific API call on success
    return {
      responseCode: "200", // Hardcode success code
      responseMessage: "QR Code generated successfully", // Hardcode success message
      qrCodeImage: apiData.qrCodeImage,
      format: apiData.format, // Use the format from the API (e.g., "PNG")
      size: apiData.size,
      referenceNumber: undefined, // Or potentially add if API returns it
    }
  } catch (error) {
    console.error("Error generating static QR code:", error)

    // For demo purposes, return mock data when API is not available
    return {
      responseCode: "200",
      responseMessage: "QR Code generated successfully (MOCK)",
      referenceNumber: "REF" + Math.floor(Math.random() * 1000000),
      qrString: "00020101021229300012D156000000000510A93FO3230Q31280012" + Math.floor(Math.random() * 10000),
      qrCodeImage: `data:image/png;base64,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`,
    }
  }
}

// Generate a dynamic QR code
export const generateDynamicQRCode = async (request: GenerateQRCodeRequest): Promise<GenerateQRCodeResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/generate-dynamic`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    })

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error generating dynamic QR code:", error)

    // For demo purposes, return mock data when API is not available
    return {
      responseCode: "200",
      responseMessage: "Dynamic QR Code generated successfully (MOCK)",
      referenceNumber: "DYN" + Math.floor(Math.random() * 1000000),
      qrString: "00020101021229300012D156000000000510A93FO3230Q31280012" + Math.floor(Math.random() * 10000),
      qrCodeImage: `data:image/png;base64,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`,
    }
  }
}

// Verify a QR code
export const verifyQRCode = async (request: VerifyQRCodeRequest): Promise<VerifyQRCodeResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/verify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    })

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error verifying QR code:", error)

    // For demo purposes, return mock data when API is not available
    return {
      responseCode: "200",
      responseMessage: "QR Code verified successfully (MOCK)",
      isValid: true,
      data: {
        amount: "100.00",
        currency: "USD",
        merchantId: "MERCH12345",
        referenceNumber: "REF" + Math.floor(Math.random() * 1000000),
        timestamp: new Date().toISOString(),
      },
    }
  }
}

// Process payment callback
export const processPaymentCallback = async (request: PaymentCallbackRequest): Promise<PaymentCallbackResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/payment-callback`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    })

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error processing payment callback:", error)

    // For demo purposes, return mock data when API is not available
    return {
      responseCode: "200",
      responseMessage: "Payment callback processed successfully (MOCK)",
    }
  }
}
