"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import type { SubTemplateTag } from "@/types/template"

interface SubtagFormProps {
  subtag: Partial<SubTemplateTag>
  setSubtag: (subtag: Partial<SubTemplateTag>) => void
  onSubmit: () => void
  onCancel: () => void
}

const SubtagForm: React.FC<SubtagFormProps> = ({ subtag, setSubtag, onSubmit, onCancel }) => {
  return (
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
            value={subtag.subTagId || ""}
            onChange={(e) => setSubtag({ ...subtag, subTagId: Number.parseInt(e.target.value) || 0 })}
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
            value={subtag.contentDesc || ""}
            onChange={(e) => setSubtag({ ...subtag, contentDesc: e.target.value })}
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
            value={subtag.jsonKey || ""}
            onChange={(e) => setSubtag({ ...subtag, jsonKey: e.target.value })}
            className="border-gray-300"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="subtag-value">Value</Label>
          <Input
            id="subtag-value"
            placeholder="Static value (if applicable)"
            value={subtag.contentValue || ""}
            onChange={(e) => setSubtag({ ...subtag, contentValue: e.target.value })}
            className="border-gray-300"
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="subtag-format">Format</Label>
          <Select value={subtag.format || "S"} onValueChange={(value) => setSubtag({ ...subtag, format: value })}>
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
            value={subtag.minLength || 0}
            onChange={(e) => setSubtag({ ...subtag, minLength: Number.parseInt(e.target.value) || 0 })}
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
            value={subtag.maxLength || 0}
            onChange={(e) => setSubtag({ ...subtag, maxLength: Number.parseInt(e.target.value) || 0 })}
            className="border-gray-300"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center space-x-2">
          <Switch
            id="subtag-required"
            checked={subtag.required === "1"}
            onCheckedChange={(checked) => setSubtag({ ...subtag, required: checked ? "1" : "0" })}
          />
          <Label htmlFor="subtag-required">Required</Label>
        </div>
        <div className="space-y-2">
          <Label htmlFor="subtag-verify-json">Verify JSON</Label>
          <Input
            id="subtag-verify-json"
            placeholder="JSON verification expression"
            value={subtag.verifyJson === "1" ? subtag.verifyJson || "" : ""}
            onChange={(e) => setSubtag({ ...subtag, verifyJson: e.target.value ? "1" : "0" })}
            className="border-gray-300"
          />
        </div>
        <div className="flex items-center space-x-2 col-span-2">
          <Switch
            id="subtag-has-child"
            checked={subtag.hasChild === "1"}
            onCheckedChange={(checked) => setSubtag({ ...subtag, hasChild: checked ? "1" : "0" })}
          />
          <Label htmlFor="subtag-has-child">Has Child</Label>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="subtag-usage">Usage</Label>
        <Textarea
          id="subtag-usage"
          placeholder="Describe how this subtag should be used"
          value={subtag.usage || ""}
          onChange={(e) => setSubtag({ ...subtag, usage: e.target.value })}
          className="border-gray-300"
        />
      </div>

      <DialogFooter>
        <Button variant="outline" onClick={onCancel} className="border-[#00513B] text-[#00513B]">
          Cancel
        </Button>
        <Button className="bg-[#00513B] hover:bg-[#00513B]/90 text-white" onClick={onSubmit}>
          Add Subtag
        </Button>
      </DialogFooter>
    </div>
  )
}

export default SubtagForm
