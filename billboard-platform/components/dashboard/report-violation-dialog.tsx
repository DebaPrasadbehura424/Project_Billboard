"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Upload, X, MapPin, Calendar, Loader2, Camera, Video } from "lucide-react"

interface ReportViolationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ReportViolationDialog({ open, onOpenChange }: ReportViolationDialogProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    location: "",
    coordinates: { lat: 0, lng: 0 },
  })
  const [files, setFiles] = useState<File[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    // Basic validation
    if (!formData.title || !formData.description || !formData.category || !formData.location) {
      setError("Please fill in all required fields")
      setIsLoading(false)
      return
    }

    if (files.length === 0) {
      setError("Please upload at least one image or video")
      setIsLoading(false)
      return
    }

    // Simulate API call
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000))
      setSuccess(true)
      setTimeout(() => {
        onOpenChange(false)
        setSuccess(false)
        setFormData({
          title: "",
          description: "",
          category: "",
          location: "",
          coordinates: { lat: 0, lng: 0 },
        })
        setFiles([])
      }, 1500)
    } catch (err) {
      setError("Failed to submit report. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || [])
    const validFiles = selectedFiles.filter((file) => {
      const isImage = file.type.startsWith("image/")
      const isVideo = file.type.startsWith("video/")
      const isValidSize = file.size <= 10 * 1024 * 1024 // 10MB limit
      return (isImage || isVideo) && isValidSize
    })

    setFiles((prev) => [...prev, ...validFiles].slice(0, 5)) // Max 5 files
  }

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const handleLocationDetect = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          setFormData((prev) => ({
            ...prev,
            coordinates: { lat: latitude, lng: longitude },
            location: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
          }))
        },
        (error) => {
          console.error("Error getting location:", error)
          setError("Unable to detect location. Please enter manually.")
        },
      )
    } else {
      setError("Geolocation is not supported by this browser.")
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleCategoryChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      category: value,
    }))
  }

  if (success) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <div className="text-center py-8">
            <div className="mx-auto flex items-center justify-center w-12 h-12 rounded-full bg-green-100 mb-4">
              <svg
                className="w-6 h-6 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Report Submitted Successfully!</h3>
            <p className="text-sm text-gray-500">
              Your violation report has been submitted and will be reviewed by authorities.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Report Billboard Violation</DialogTitle>
          <DialogDescription>
            Help keep your city compliant by reporting unauthorized or non-compliant billboards.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Report Title *</Label>
            <Input
              id="title"
              name="title"
              placeholder="Brief description of the violation"
              value={formData.title}
              onChange={handleChange}
              required
              disabled={isLoading}
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="category">Violation Category *</Label>
            <Select value={formData.category} onValueChange={handleCategoryChange} disabled={isLoading}>
              <SelectTrigger>
                <SelectValue placeholder="Select violation type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="size">Size Violation - Exceeds permitted dimensions</SelectItem>
                <SelectItem value="placement">Placement Violation - Improper location</SelectItem>
                <SelectItem value="content">Content Violation - Inappropriate content</SelectItem>
                <SelectItem value="hazard">Safety Hazard - Blocks visibility or access</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* File Upload */}
          <div className="space-y-2">
            <Label>Upload Images/Videos *</Label>
            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6">
              <div className="text-center">
                <Upload className="mx-auto h-12 w-12 text-muted-foreground/50" />
                <div className="mt-4">
                  <Label htmlFor="file-upload" className="cursor-pointer">
                    <span className="mt-2 block text-sm font-medium text-primary hover:text-primary/80">
                      Click to upload files
                    </span>
                    <span className="mt-1 block text-xs text-muted-foreground">
                      PNG, JPG, MP4 up to 10MB (max 5 files)
                    </span>
                  </Label>
                  <Input
                    id="file-upload"
                    type="file"
                    multiple
                    accept="image/*,video/*"
                    onChange={handleFileUpload}
                    className="hidden"
                    disabled={isLoading}
                  />
                </div>
              </div>
            </div>

            {/* File Preview */}
            {files.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-4">
                {files.map((file, index) => (
                  <Card key={index} className="relative">
                    <CardContent className="p-2">
                      <div className="aspect-video bg-muted rounded flex items-center justify-center relative">
                        {file.type.startsWith("image/") ? (
                          <Camera className="h-8 w-8 text-muted-foreground" />
                        ) : (
                          <Video className="h-8 w-8 text-muted-foreground" />
                        )}
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute -top-2 -right-2 h-6 w-6"
                          onClick={() => removeFile(index)}
                          disabled={isLoading}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1 truncate">{file.name}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Location */}
          <div className="space-y-2">
            <Label htmlFor="location">Location *</Label>
            <div className="flex gap-2">
              <Input
                id="location"
                name="location"
                placeholder="Enter address or coordinates"
                value={formData.location}
                onChange={handleChange}
                required
                disabled={isLoading}
              />
              <Button type="button" variant="outline" onClick={handleLocationDetect} disabled={isLoading}>
                <MapPin className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Timestamp */}
          <div className="space-y-2">
            <Label>Timestamp</Label>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>{new Date().toLocaleString()}</span>
              <span className="text-xs">(Auto-filled)</span>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Detailed Description *</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Provide detailed information about the violation, including specific concerns and observations..."
              value={formData.description}
              onChange={handleChange}
              rows={4}
              required
              disabled={isLoading}
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Report"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
