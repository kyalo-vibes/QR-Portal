"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import type { TemplateTag, SubTemplateTag } from "@/types/template"
import { PlusCircle } from "lucide-react"

interface TagDisplayProps {
  tag: TemplateTag
  openAddSubtagDialog: (tagId: number, subtagId?: number | null) => void
}

const TagDisplay: React.FC<TagDisplayProps> = ({ tag, openAddSubtagDialog }) => {
  // Render subtags recursively
  const renderSubtags = (subtags: SubTemplateTag[] | undefined, level = 1) => {
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
                  onClick={() => openAddSubtagDialog(subtag.parentTemplateTagId || 0, subtag.subTagSequence)}
                  className="text-brand-primary border-brand-primary/30 hover:bg-brand-primary/10"
                >
                  <PlusCircle className="h-4 w-4 mr-1" />
                  Add Child
                </Button>
              </div>
            </div>
            {renderSubtags(subtag.subtags, level + 1)}
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="border rounded-md p-4 shadow-sm hover:shadow-md transition-all">
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
                  className={`px-2 py-0.5 rounded-full text-xs ${tag.isStatic === "1" ? "bg-blue-100 text-blue-800" : tag.isDynamic === "1" ? "bg-orange-100 text-orange-800" : "bg-gray-100 text-gray-800"}`}
                >
                  {tag.isStatic === "1" ? "Static" : tag.isDynamic === "1" ? "Dynamic" : "Undefined"}
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
            onClick={() => openAddSubtagDialog(tag.tagId)}
            className="text-brand-primary border-brand-primary/30 hover:bg-brand-primary/10"
          >
            <PlusCircle className="h-4 w-4 mr-1" />
            Add Subtag
          </Button>
        </div>
      </div>

      {/* Render subtags */}
      {tag.subtags && tag.subtags.length > 0 && (
        <div className="mt-4">
          <h5 className="text-sm font-medium mb-2 text-brand-secondary">Subtags</h5>
          {renderSubtags(tag.subtags)}
        </div>
      )}
    </div>
  )
}

export default TagDisplay
