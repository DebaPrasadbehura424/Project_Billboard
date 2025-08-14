"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  ArrowLeft,
  MapPin,
  Calendar,
  User,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Camera,
  Video,
  Loader2,
} from "lucide-react"
import { MapComponent } from "@/components/ui/map-component"
import type { ViolationReport } from "@/lib/types"

// Mock data - in real app, this would come from API
const mockReports: ViolationReport[] = [
  {
    id: "1",
    userId: "1",
    userName: "John Doe",
    title: "Oversized Billboard on Main Street",
    description:
      "Billboard exceeds permitted size limits by approximately 30%. The structure appears to be significantly larger than the standard 14x48 feet permitted in this commercial zone. This creates visual pollution and may violate local zoning ordinances.",
    category: "size",
    location: {
      address: "123 Main Street, Downtown",
      coordinates: { lat: 40.7128, lng: -74.006 },
    },
    images: ["/oversized-billboard.png", "/generic-billboard.png"],
    timestamp: "2024-01-15T10:30:00Z",
    status: "pending",
    aiAnalysis: {
      confidence: 0.92,
      detectedViolations: ["Size exceeds permitted dimensions", "Potential zoning violation"],
      riskLevel: "medium",
    },
  },
  {
    id: "2",
    userId: "2",
    userName: "Jane Smith",
    title: "Billboard in Restricted Zone",
    description:
      "Billboard placed too close to intersection, creating safety hazard for drivers. The placement blocks clear sight lines and may contribute to traffic safety issues.",
    category: "placement",
    location: {
      address: "456 Oak Avenue, Midtown",
      coordinates: { lat: 40.7589, lng: -73.9851 },
    },
    images: ["/intersection-billboard.png"],
    timestamp: "2024-01-12T15:45:00Z",
    status: "under-review",
    aiAnalysis: {
      confidence: 0.87,
      detectedViolations: ["Placement violates safety regulations", "Too close to intersection"],
      riskLevel: "high",
    },
  },
]

interface ViolationDetailPageProps {
  violationId: string
}

export function ViolationDetailPage({ violationId }: ViolationDetailPageProps) {
  const [violation, setViolation] = useState<ViolationReport | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false)
  const [reviewData, setReviewData] = useState({
    status: "",
    notes: "",
  })
  const [isSubmittingReview, setIsSubmittingReview] = useState(false)
  const [currentUser, setCurrentUser] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    // Get current user
    const userData = localStorage.getItem("user")
    if (userData) {
      setCurrentUser(JSON.parse(userData))
    }

    // Simulate API call to fetch violation details
    const fetchViolation = async () => {
      setIsLoading(true)
      try {
        await new Promise((resolve) => setTimeout(resolve, 500))
        const foundViolation = mockReports.find((report) => report.id === violationId)
        setViolation(foundViolation || null)
      } catch (error) {
        console.error("Error fetching violation:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchViolation()
  }, [violationId])

  const handleReview = () => {
    if (!violation) return
    setReviewData({
      status: violation.status === "pending" ? "approved" : violation.status,
      notes: violation.reviewNotes || "",
    })
    setIsReviewDialogOpen(true)
  }

  const submitReview = async () => {
    if (!violation || !currentUser) return

    setIsSubmittingReview(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Update violation status
      const updatedViolation = {
        ...violation,
        status: reviewData.status as ViolationReport["status"],
        reviewedBy: currentUser.name,
        reviewedAt: new Date().toISOString(),
        reviewNotes: reviewData.notes,
      }

      setViolation(updatedViolation)
      setIsReviewDialogOpen(false)
    } catch (error) {
      console.error("Error submitting review:", error)
    } finally {
      setIsSubmittingReview(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-5 w-5" />
      case "approved":
        return <CheckCircle className="h-5 w-5" />
      case "rejected":
        return <XCircle className="h-5 w-5" />
      case "under-review":
        return <AlertTriangle className="h-5 w-5" />
      default:
        return <Clock className="h-5 w-5" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "secondary"
      case "approved":
        return "default"
      case "rejected":
        return "destructive"
      case "under-review":
        return "secondary"
      default:
        return "secondary"
    }
  }

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case "high":
        return "destructive"
      case "medium":
        return "secondary"
      case "low":
        return "outline"
      default:
        return "outline"
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    )
  }

  if (!violation) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Violation Not Found</h1>
          <p className="text-muted-foreground mb-8">The requested violation report could not be found.</p>
          <Button onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => router.back()}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold">{violation.title}</h1>
              <p className="text-muted-foreground">Violation Report #{violation.id}</p>
            </div>
          </div>
          {currentUser?.role === "authority" && (
            <Button onClick={handleReview}>
              <Eye className="mr-2 h-4 w-4" />
              Review Report
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Images/Videos */}
            <Card>
              <CardHeader>
                <CardTitle>Evidence</CardTitle>
                <CardDescription>Images and videos submitted with this report</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {violation.images.map((image, index) => (
                    <div key={index} className="aspect-video bg-muted rounded-lg overflow-hidden relative group">
                      <img
                        src={image || "/placeholder.svg"}
                        alt={`Evidence ${index + 1}`}
                        className="w-full h-full object-cover cursor-pointer transition-transform group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                        <Camera className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </div>
                  ))}
                  {violation.videos?.map((video, index) => (
                    <div key={index} className="aspect-video bg-muted rounded-lg overflow-hidden relative group">
                      <div className="w-full h-full flex items-center justify-center">
                        <Video className="h-12 w-12 text-muted-foreground" />
                      </div>
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                        <Video className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle>Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">{violation.description}</p>
              </CardContent>
            </Card>

            {/* AI Analysis */}
            {violation.aiAnalysis && (
              <Card>
                <CardHeader>
                  <CardTitle>AI Analysis</CardTitle>
                  <CardDescription>Automated violation detection results</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium">Confidence Score</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex-1 bg-muted rounded-full h-2">
                          <div
                            className="bg-primary h-2 rounded-full transition-all"
                            style={{ width: `${violation.aiAnalysis.confidence * 100}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium">
                          {(violation.aiAnalysis.confidence * 100).toFixed(0)}%
                        </span>
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Risk Level</Label>
                      <div className="mt-1">
                        <Badge variant={getRiskLevelColor(violation.aiAnalysis.riskLevel)} className="capitalize">
                          {violation.aiAnalysis.riskLevel}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-medium">Detected Violations</Label>
                    <ul className="mt-2 space-y-1">
                      {violation.aiAnalysis.detectedViolations.map((violationItem, index) => (
                        <li key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                          {violationItem}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Review Information */}
            {violation.reviewedBy && (
              <Card>
                <CardHeader>
                  <CardTitle>Review Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium">Reviewed By</Label>
                      <p className="text-sm text-muted-foreground mt-1">{violation.reviewedBy}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Review Date</Label>
                      <p className="text-sm text-muted-foreground mt-1">
                        {violation.reviewedAt && new Date(violation.reviewedAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  {violation.reviewNotes && (
                    <div>
                      <Label className="text-sm font-medium">Review Notes</Label>
                      <p className="text-sm text-muted-foreground mt-1">{violation.reviewNotes}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Status */}
            <Card>
              <CardHeader>
                <CardTitle>Status</CardTitle>
              </CardHeader>
              <CardContent>
                <Badge variant={getStatusColor(violation.status)} className="flex items-center gap-2 w-fit">
                  {getStatusIcon(violation.status)}
                  <span className="capitalize">{violation.status.replace("-", " ")}</span>
                </Badge>
              </CardContent>
            </Card>

            {/* Report Details */}
            <Card>
              <CardHeader>
                <CardTitle>Report Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Reported by</p>
                    <p className="text-sm text-muted-foreground">{violation.userName}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Date Reported</p>
                    <p className="text-sm text-muted-foreground">{new Date(violation.timestamp).toLocaleString()}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Location</p>
                    <p className="text-sm text-muted-foreground">{violation.location.address}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {violation.location.coordinates.lat}, {violation.location.coordinates.lng}
                    </p>
                  </div>
                </div>

                <Separator />

                <div>
                  <p className="text-sm font-medium mb-2">Category</p>
                  <Badge variant="outline" className="capitalize">
                    {violation.category}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Map */}
            <Card>
              <CardHeader>
                <CardTitle>Location Map</CardTitle>
              </CardHeader>
              <CardContent>
                <MapComponent
                  center={violation.location.coordinates}
                  markers={[
                    {
                      id: violation.id,
                      position: violation.location.coordinates,
                      title: violation.title,
                      category: violation.category,
                      status: violation.status,
                    },
                  ]}
                  height="300px"
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Review Dialog */}
      <Dialog open={isReviewDialogOpen} onOpenChange={setIsReviewDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Review Report</DialogTitle>
            <DialogDescription>Update the status and add review notes for this report</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                value={reviewData.status}
                onValueChange={(value) => setReviewData((prev) => ({ ...prev, status: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="under-review">Under Review</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Review Notes</Label>
              <Textarea
                placeholder="Add notes about your review decision..."
                value={reviewData.notes}
                onChange={(e) => setReviewData((prev) => ({ ...prev, notes: e.target.value }))}
                rows={3}
              />
            </div>

            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setIsReviewDialogOpen(false)} disabled={isSubmittingReview}>
                Cancel
              </Button>
              <Button onClick={submitReview} disabled={isSubmittingReview}>
                {isSubmittingReview ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit Review"
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
