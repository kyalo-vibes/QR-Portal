"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import type { TemplateTag } from "@/types/template"

interface TagFormProps {
  tag: Partial<TemplateTag>
  setTag: (tag: Partial<TemplateTag>) => void
  onSubmit: () => void
  onCancel: () => void
}

const TagForm: React.FC<TagFormProps> = ({ tag, setTag, onSubmit, onCancel }) => {
  return (
    <div className="grid gap-4 py-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="tag-group">
            Tag Group <span className="text-red-500">*</span>
          </Label>
          <Input
            id="tag-group"
            placeholder="e.g., Header, Data"
            value={tag.tagGroup || ""}
            onChange={(e) => setTag({ ...tag, tagGroup: e.target.value })}
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
            value={tag.tagId || ""}
            onChange={(e) => setTag({ ...tag, tagId: Number.parseInt(e.target.value) || 0 })}
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
            value={tag.contentDesc || ""}
            onChange={(e) => setTag({ ...tag, contentDesc: e.target.value })}
            className="border-gray-300"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="json-key">JSON Key</Label>
          <Input
            id="json-key"
            placeholder="e.g., amount, currency"
            value={tag.jsonKey || ""}
            onChange={(e) => setTag({ ...tag, jsonKey: e.target.value })}
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
            value={tag.contentValue || ""}
            onChange={(e) => setTag({ ...tag, contentValue: e.target.value })}
            className="border-gray-300"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="format">Format</Label>
          <Select value={tag.format || "S"} onValueChange={(value) => setTag({ ...tag, format: value })}>
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
            value={tag.minLength || 0}
            onChange={(e) => setTag({ ...tag, minLength: Number.parseInt(e.target.value) || 0 })}
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
            value={tag.maxLength || 0}
            onChange={(e) => setTag({ ...tag, maxLength: Number.parseInt(e.target.value) || 0 })}
            className="border-gray-300"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="flex items-center space-x-2">
          <Switch
            id="is-static"
            checked={tag.isStatic === "1"}
            onCheckedChange={(checked) =>
              setTag({
                ...tag,
                isStatic: checked ? "1" : "0",
                isDynamic: checked ? "0" : tag.isDynamic,
              })
            }
          />
          <Label htmlFor="is-static">Static</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            id="is-dynamic"
            checked={tag.isDynamic === "1"}
            onCheckedChange={(checked) =>
              setTag({
                ...tag,
                isDynamic: checked ? "1" : "0",
                isStatic: checked ? "0" : tag.isStatic,
              })
            }
          />
          <Label htmlFor="is-dynamic">Dynamic</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            id="required"
            checked={tag.required === "1"}
            onCheckedChange={(checked) => setTag({ ...tag, required: checked ? "1" : "0" })}
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
            value={tag.verifyJson === "1" ? tag.verifyJson || "" : ""}
            onChange={(e) => setTag({ ...tag, verifyJson: e.target.value ? "1" : "0" })}
            className="border-gray-300"
          />
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            id="has-child"
            checked={tag.hasChild === "1"}
            onCheckedChange={(checked) => setTag({ ...tag, hasChild: checked ? "1" : "0" })}
          />
          <Label htmlFor="has-child">Has Child</Label>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="usage">Usage</Label>
        <Textarea
          id="usage"
          placeholder="Describe how this tag should be used"
          value={tag.usage || ""}
          onChange={(e) => setTag({ ...tag, usage: e.target.value })}
          className="border-gray-300"
        />
      </div>

      <DialogFooter>
        <Button variant="outline" onClick={onCancel} className="border-[#00513B] text-[#00513B]">
          Cancel
        </Button>
        <Button className="bg-[#00513B] hover:bg-[#00513B]/90 text-white" onClick={onSubmit}>
          Add Tag
        </Button>
      </DialogFooter>
    </div>
  )
}

export default TagForm
