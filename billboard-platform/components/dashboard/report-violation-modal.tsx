"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Upload, MapPin, Clock } from "lucide-react"

interface ReportViolationModalProps {
  isOpen: boolean
  onClose: () => void
}

export function ReportViolationModal({ isOpen, onClose }: ReportViolationModalProps) {
  const [formData, setFormData] = useState({
    location: "",
    description: "",
    violationType: "",
    timestamp: new Date().toISOString().slice(0, 16),
  })
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    console.log("Report submitted:", { ...formData, file: selectedFile })
    onClose()
    // Reset form
    setFormData({
      location: "",
      description: "",
      violationType: "",
      timestamp: new Date().toISOString().slice(0, 16),
    })
    setSelectedFile(null)
    setPreviewUrl(null)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Report Billboard Violation</DialogTitle>
          <DialogDescription>Submit details about a billboard violation you've observed</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* File Upload */}
          <div className="space-y-2">
            <Label htmlFor="file">Upload Image or Video</Label>
            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6">
              <input id="file" type="file" accept="image/*,video/*" onChange={handleFileChange} className="hidden" />
              <label htmlFor="file" className="cursor-pointer flex flex-col items-center space-y-2">
                <Upload className="h-8 w-8 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Click to upload or drag and drop</span>
                <span className="text-xs text-muted-foreground">PNG, JPG, MP4 up to 10MB</span>
              </label>
            </div>
            {previewUrl && (
              <div className="mt-4">
                <img
                  src={previewUrl || "/placeholder.svg"}
                  alt="Preview"
                  className="max-w-full h-48 object-cover rounded-lg"
                />
              </div>
            )}
          </div>

          {/* Location */}
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="location"
                placeholder="Enter address or use GPS location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="pl-10"
                required
              />
            </div>
            <Button type="button" variant="outline" size="sm">
              Use Current Location
            </Button>
          </div>

          {/* Timestamp */}
          <div className="space-y-2">
            <Label htmlFor="timestamp">Timestamp</Label>
            <div className="relative">
              <Clock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="timestamp"
                type="datetime-local"
                value={formData.timestamp}
                onChange={(e) => setFormData({ ...formData, timestamp: e.target.value })}
                className="pl-10"
                required
              />
            </div>
          </div>

          {/* Violation Type */}
          <div className="space-y-2">
            <Label htmlFor="violationType">Violation Category</Label>
            <Select onValueChange={(value) => setFormData({ ...formData, violationType: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select violation type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="size">Size Violation</SelectItem>
                <SelectItem value="placement">Improper Placement</SelectItem>
                <SelectItem value="content">Inappropriate Content</SelectItem>
                <SelectItem value="hazard">Safety Hazard</SelectItem>
                <SelectItem value="permit">No Permit</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Describe the violation in detail..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              required
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Submit Report</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
