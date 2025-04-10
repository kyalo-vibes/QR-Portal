import type { Template, TemplateTag, SubTemplateTag, JourneyType } from "@/types/template"

// Mock journey types
export const journeyTypes: JourneyType[] = [
  { id: "PAYMENT", name: "Payment" },
  { id: "TICKET", name: "Ticket" },
  { id: "IDENTITY", name: "Identity" },
]

// Mock templates
let templates: Template[] = [
  {
    id: 1,
    name: "Basic Payment QR",
    journeyId: "PAYMENT",
    tags: [
      {
        tagId: 1,
        templateId: 1,
        journeyId: "PAYMENT",
        minLength: 0,
        maxLength: 20,
        tagGroup: "Header",
        contentDesc: "QR Format",
        jsonKey: "format",
        contentValue: "QRPS",
        format: "S",
        isStatic: "1",
        isDynamic: "0",
        required: "1",
        usage: "QR Format Identifier",
        valid: "1",
        verifyJson: "0",
        hasChild: "1",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        subtags: [
          {
            subTagSequence: 1,
            subTagId: 101,
            parentTemplateTagId: 1,
            parentSubTagId: null,
            templateId: 1,
            journeyId: "PAYMENT",
            minLength: 0,
            maxLength: 10,
            contentDesc: "Version",
            jsonKey: "version",
            contentValue: "01",
            format: "N",
            required: "1",
            usage: "QR Version",
            valid: "1",
            verifyJson: "0",
            hasChild: "0",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        ],
      },
      {
        tagId: 2,
        templateId: 1,
        journeyId: "PAYMENT",
        minLength: 0,
        maxLength: 50,
        tagGroup: "Data",
        contentDesc: "Amount",
        jsonKey: "amount",
        contentValue: "",
        format: "N",
        isStatic: "0",
        isDynamic: "1",
        required: "1",
        usage: "Payment amount",
        valid: "1",
        verifyJson: "1",
        hasChild: "0",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ],
  },
]

// Get all templates
export const getAllTemplates = async (): Promise<Template[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(templates)
    }, 300)
  })
}

// Get template by ID
export const getTemplateById = async (id: number): Promise<Template | undefined> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(templates.find((template) => template.id === id))
    }, 300)
  })
}

// Create new template
export const createTemplate = async (template: Omit<Template, "id">): Promise<Template> => {
  const newTemplate = {
    ...template,
    id: templates.length > 0 ? Math.max(...templates.map((t) => t.id)) + 1 : 1,
  }
  templates = [...templates, newTemplate]
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(newTemplate)
    }, 300)
  })
}

// Update template
export const updateTemplate = async (id: number, template: Template): Promise<Template> => {
  templates = templates.map((t) => (t.id === id ? template : t))
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(template)
    }, 300)
  })
}

// Delete template
export const deleteTemplate = async (id: number): Promise<boolean> => {
  templates = templates.filter((t) => t.id !== id)
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true)
    }, 300)
  })
}

// Add tag to template
export const addTagToTemplate = async (templateId: number, tag: Omit<TemplateTag, "tagId">): Promise<TemplateTag> => {
  const template = templates.find((t) => t.id === templateId)
  if (!template) {
    throw new Error("Template not found")
  }

  const newTagId = template.tags.length > 0 ? Math.max(...template.tags.map((t) => t.tagId)) + 1 : 1

  const newTag: TemplateTag = {
    ...tag,
    tagId: newTagId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  template.tags.push(newTag)

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(newTag)
    }, 300)
  })
}

// Add subtag
export const addSubtagToTag = async (
  templateId: number,
  parentTagId: number,
  parentSubTagId: number | null,
  subtag: Omit<SubTemplateTag, "subTagSequence" | "subTagId">,
): Promise<SubTemplateTag> => {
  const template = templates.find((t) => t.id === templateId)
  if (!template) {
    throw new Error("Template not found")
  }

  // Generate new sequence
  const newSequence = Math.floor(Math.random() * 10000) + 1
  const newSubtagId = Math.floor(Math.random() * 10000) + 1

  const newSubtag: SubTemplateTag = {
    ...subtag,
    subTagSequence: newSequence,
    subTagId: newSubtagId,
    parentTemplateTagId: parentTagId,
    parentSubTagId: parentSubTagId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  // Find parent tag or subtag and add the new subtag
  if (parentSubTagId === null) {
    // Add to parent tag
    const parentTag = template.tags.find((t) => t.tagId === parentTagId)
    if (!parentTag) {
      throw new Error("Parent tag not found")
    }

    if (!parentTag.subtags) {
      parentTag.subtags = []
    }

    parentTag.subtags.push(newSubtag)
    parentTag.hasChild = "1"
  } else {
    // Find the parent subtag recursively
    const findAndAddToParentSubtag = (subtags: SubTemplateTag[] | undefined): boolean => {
      if (!subtags) return false

      for (const subtag of subtags) {
        if (subtag.subTagSequence === parentSubTagId) {
          if (!subtag.subtags) {
            subtag.subtags = []
          }
          subtag.subtags.push(newSubtag)
          subtag.hasChild = "1"
          return true
        }

        if (findAndAddToParentSubtag(subtag.subtags)) {
          return true
        }
      }

      return false
    }

    const parentTag = template.tags.find((t) => t.tagId === parentTagId)
    if (!parentTag || !findAndAddToParentSubtag(parentTag.subtags)) {
      throw new Error("Parent subtag not found")
    }
  }

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(newSubtag)
    }, 300)
  })
}
