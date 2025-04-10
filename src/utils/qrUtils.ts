import type { Template, SubTemplateTag } from "@/types/template"

// Sample QR code generator based on template structure
export const generateSampleQRString = (template: Template): string => {
  // Initialize an object structure
  const qrObject: any = {}

  // Process main tags
  template.tags.forEach((tag) => {
    // Skip if no json key
    if (!tag.jsonKey) return

    let value = tag.contentValue

    // If no static value, generate a placeholder based on format type
    if (!value) {
      if (tag.format === "N") {
        value = "123456"
      } else if (tag.format === "A") {
        value = "ABC123"
      } else {
        value = "Sample"
      }
    }

    // If tag has children, create a nested object
    if (tag.hasChild === "1" && tag.subtags && tag.subtags.length > 0) {
      const nestedObj = processSubtags(tag.subtags)
      qrObject[tag.jsonKey] = nestedObj
    } else {
      qrObject[tag.jsonKey] = value
    }
  })

  return JSON.stringify(qrObject, null, 2)
}

// Helper to process subtags recursively
export const processSubtags = (subtags: SubTemplateTag[]): any => {
  if (!subtags || subtags.length === 0) return {}

  const result: any = {}

  subtags.forEach((subtag) => {
    if (!subtag.jsonKey) return

    let value = subtag.contentValue

    // Generate placeholder value if needed
    if (!value) {
      if (subtag.format === "N") {
        value = "123456"
      } else if (subtag.format === "A") {
        value = "ABC123"
      } else {
        value = "Sample"
      }
    }

    // Handle nested subtags
    if (subtag.hasChild === "1" && subtag.subtags && subtag.subtags.length > 0) {
      result[subtag.jsonKey] = processSubtags(subtag.subtags)
    } else {
      result[subtag.jsonKey] = value
    }
  })

  return result
}

// Convert JSON structure to TLV-like format for display
export interface TlvDisplayItem {
  tag: string
  length: number | string
  value: string
  children: TlvDisplayItem[]
  level: number
}

export const convertToTlvStructure = (jsonData: any, level = 0): TlvDisplayItem[] => {
  if (!jsonData || typeof jsonData !== "object") return []

  const result: TlvDisplayItem[] = []

  Object.entries(jsonData).forEach(([key, value], index) => {
    // Generate a placeholder tag number
    const tagId = (index + 1).toString().padStart(2, "0")

    if (typeof value === "object" && value !== null) {
      // This is a nested structure
      const children = convertToTlvStructure(value, level + 1)
      const valLength = JSON.stringify(value).length

      result.push({
        tag: tagId,
        length: valLength,
        value: "",
        children,
        level,
      })
    } else {
      // This is a simple value
      const strValue = String(value)

      result.push({
        tag: tagId,
        length: strValue.length,
        value: strValue,
        children: [],
        level,
      })
    }
  })

  return result
}

// Parse TLV string into structured format
// This is a placeholder implementation - in real app would parse actual TLV format
export const parseTlvString = (tlvString: string): TlvDisplayItem[] => {
  // Try to parse as JSON first for demo
  try {
    const jsonObj = JSON.parse(tlvString)
    return convertToTlvStructure(jsonObj)
  } catch (e) {
    // If not valid JSON, return mock structure for demo purposes
    return [
      {
        tag: "00",
        length: 2,
        value: "01",
        children: [],
        level: 0,
      },
      {
        tag: "01",
        length: 2,
        value: "11",
        children: [],
        level: 0,
      },
      {
        tag: "29",
        length: 43,
        value: "",
        level: 0,
        children: [
          {
            tag: "00",
            length: 8,
            value: "ke.go.qr",
            children: [],
            level: 1,
          },
          {
            tag: "11",
            length: 27,
            value: "",
            level: 1,
            children: [
              { tag: "00", length: 2, value: "01", children: [], level: 2 },
              { tag: "01", length: 6, value: "400200", children: [], level: 2 },
              { tag: "02", length: 7, value: "4001002", children: [], level: 2 },
            ],
          },
        ],
      },
    ]
  }
}
