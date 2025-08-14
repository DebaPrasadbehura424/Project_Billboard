"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import {
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  Search,
  Filter,
  Eye,
  MapPin,
  Calendar,
  AlertTriangle,
  Loader2,
} from "lucide-react"
import type { ViolationReport, DashboardStats } from "@/lib/types"

// Mock data for demonstration
const mockStats: DashboardStats = {
  totalReports: 156,
  pendingReports: 23,
  approvedReports: 98,
  rejectedReports: 35,
}

const mockAllReports: ViolationReport[] = [
  {
    id: "1",
    userId: "1",
    userName: "John Doe",
    title: "Oversized Billboard on Main Street",
    description: "Billboard exceeds permitted size limits by approximately 30%",
    category: "size",
    location: {
      address: "123 Main Street, Downtown",
      coordinates: { lat: 40.7128, lng: -74.006 },
    },
    images: ["/oversized-billboard.png"],
    timestamp: "2024-01-15T10:30:00Z",
    status: "pending",
    aiAnalysis: {
      confidence: 0.92,
      detectedViolations: ["Size exceeds permitted dimensions"],
      riskLevel: "medium",
    },
  },
  {
    id: "2",
    userId: "2",
    userName: "Jane Smith",
    title: "Billboard in Restricted Zone",
    description: "Billboard placed too close to intersection, creating safety hazard",
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
      detectedViolations: ["Placement violates safety regulations"],
      riskLevel: "high",
    },
  },
  {
    id: "3",
    userId: "3",
    userName: "Mike Johnson",
    title: "Inappropriate Content Display",
    description: "Billboard contains content not suitable for family viewing area",
    category: "content",
    location: {
      address: "789 Family Street, Suburbs",
      coordinates: { lat: 40.7282, lng: -73.7949 },
    },
    images: ["/generic-billboard.png"],
    timestamp: "2024-01-10T09:15:00Z",
    status: "approved",
    reviewedBy: "Authority User",
    reviewedAt: "2024-01-11T11:30:00Z",
  },
  {
    id: "4",
    userId: "4",
    userName: "Sarah Wilson",
    title: "Structural Safety Concern",
    description: "Billboard appears to be improperly secured and poses falling hazard",
    category: "hazard",
    location: {
      address: "321 Safety Boulevard, Industrial",
      coordinates: { lat: 40.7505, lng: -73.9934 },
    },
    images: ["/generic-billboard.png"],
    timestamp: "2024-01-08T14:20:00Z",
    status: "rejected",
    reviewedBy: "Authority User",
    reviewedAt: "2024-01-09T16:45:00Z",
    reviewNotes: "Inspection confirmed structure meets safety standards",
  },
  {
    id: "5",
    userId: "5",
    userName: "David Brown",
    title: "Unauthorized Billboard Installation",
    description: "New billboard installed without proper permits",
    category: "placement",
    location: {
      address: "654 Commerce Street, Business District",
      coordinates: { lat: 40.7614, lng: -73.9776 },
    },
    images: ["/generic-billboard.png"],
    timestamp: "2024-01-05T11:10:00Z",
    status: "pending",
    aiAnalysis: {
      confidence: 0.78,
      detectedViolations: ["No permit on file"],
      riskLevel: "low",
    },
  },
]

interface AuthorityDashboardProps {
  user: any
}

export function AuthorityDashboard({ user }: AuthorityDashboardProps) {
  const [reports, setReports] = useState<ViolationReport[]>(mockAllReports)
  const [filteredReports, setFilteredReports] = useState<ViolationReport[]>(mockAllReports)
  const [selectedReport, setSelectedReport] = useState<ViolationReport | null>(null)
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false)
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false)
  const [reviewData, setReviewData] = useState({
    status: "",
    notes: "",
  })
  const [isLoading, setIsLoading] = useState(false)

  // Filter states
  const [filters, setFilters] = useState({
    search: "",
    status: "",
    category: "",
    dateFrom: "",
    dateTo: "",
  })

  // Apply filters
  const applyFilters = () => {
    let filtered = reports

    if (filters.search) {
      filtered = filtered.filter(
        (report) =>
          report.title.toLowerCase().includes(filters.search.toLowerCase()) ||
          report.location.address.toLowerCase().includes(filters.search.toLowerCase()) ||
          report.userName.toLowerCase().includes(filters.search.toLowerCase()),
      )
    }

    if (filters.status) {
      filtered = filtered.filter((report) => report.status === filters.status)
    }

    if (filters.category) {
      filtered = filtered.filter((report) => report.category === filters.category)
    }

    if (filters.dateFrom) {
      filtered = filtered.filter((report) => new Date(report.timestamp) >= new Date(filters.dateFrom))
    }

    if (filters.dateTo) {
      filtered = filtered.filter((report) => new Date(report.timestamp) <= new Date(filters.dateTo))
    }

    setFilteredReports(filtered)
  }

  // Handle filter changes
  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  // Clear filters
  const clearFilters = () => {
    setFilters({
      search: "",
      status: "",
      category: "",
      dateFrom: "",
      dateTo: "",
    })
    setFilteredReports(reports)
  }

  // View report details
  const viewReportDetails = (report: ViolationReport) => {
    setSelectedReport(report)
    setIsDetailDialogOpen(true)
  }

  // Start review process
  const startReview = (report: ViolationReport) => {
    setSelectedReport(report)
    setReviewData({
      status: report.status === "pending" ? "approved" : report.status,
      notes: report.reviewNotes || "",
    })
    setIsReviewDialogOpen(true)
  }

  // Submit review
  const submitReview = async () => {
    if (!selectedReport) return

    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Update report status
      const updatedReports = reports.map((report) =>
        report.id === selectedReport.id
          ? {
              ...report,
              status: reviewData.status as ViolationReport["status"],
              reviewedBy: user.name,
              reviewedAt: new Date().toISOString(),
              reviewNotes: reviewData.notes,
            }
          : report,
      )

      setReports(updatedReports)
      setFilteredReports(updatedReports)
      setIsReviewDialogOpen(false)
      setSelectedReport(null)
    } catch (error) {
      console.error("Error submitting review:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4" />
      case "approved":
        return <CheckCircle className="h-4 w-4" />
      case "rejected":
        return <XCircle className="h-4 w-4" />
      case "under-review":
        return <AlertTriangle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
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

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Authority Dashboard</h1>
        <p className="text-muted-foreground">Review and manage violation reports from citizens</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Reports</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.totalReports}</div>
            <p className="text-xs text-muted-foreground">All time submissions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.pendingReports}</div>
            <p className="text-xs text-muted-foreground">Awaiting review</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.approvedReports}</div>
            <p className="text-xs text-muted-foreground">Confirmed violations</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rejected</CardTitle>
            <XCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.rejectedReports}</div>
            <p className="text-xs text-muted-foreground">Not violations</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters & Search
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            <div className="space-y-2">
              <Label htmlFor="search">Search</Label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search reports..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange("search", e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={filters.status} onValueChange={(value) => handleFilterChange("status", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="under-review">Under Review</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={filters.category} onValueChange={(value) => handleFilterChange("category", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="All categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All categories</SelectItem>
                  <SelectItem value="size">Size</SelectItem>
                  <SelectItem value="placement">Placement</SelectItem>
                  <SelectItem value="content">Content</SelectItem>
                  <SelectItem value="hazard">Hazard</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dateFrom">Date From</Label>
              <Input
                id="dateFrom"
                type="date"
                value={filters.dateFrom}
                onChange={(e) => handleFilterChange("dateFrom", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dateTo">Date To</Label>
              <Input
                id="dateTo"
                type="date"
                value={filters.dateTo}
                onChange={(e) => handleFilterChange("dateTo", e.target.value)}
              />
            </div>
          </div>

          <div className="flex gap-2 mt-4">
            <Button onClick={applyFilters}>Apply Filters</Button>
            <Button variant="outline" onClick={clearFilters}>
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Reports Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Reports ({filteredReports.length})</CardTitle>
          <CardDescription>Manage and review violation reports from citizens</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Image</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Reporter</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>AI Risk</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredReports.map((report) => (
                <TableRow key={report.id}>
                  <TableCell>
                    <div className="w-16 h-12 bg-muted rounded flex items-center justify-center">
                      <img
                        src={report.images[0] || "/placeholder.svg"}
                        alt="Report"
                        className="w-full h-full object-cover rounded"
                        onError={(e) => {
                          e.currentTarget.style.display = "none"
                          e.currentTarget.nextElementSibling?.classList.remove("hidden")
                        }}
                      />
                      <div className="hidden text-xs text-muted-foreground">IMG</div>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium max-w-[200px]">
                    <div className="truncate">{report.title}</div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <span className="h-3 w-3" />
                      <span className="text-sm">{report.userName}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">
                      {report.category}
                    </Badge>
                  </TableCell>
                  <TableCell className="max-w-[150px]">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      <span className="text-sm truncate">{report.location.address}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span className="text-sm">{new Date(report.timestamp).toLocaleDateString()}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {report.aiAnalysis && (
                      <Badge variant={getRiskLevelColor(report.aiAnalysis.riskLevel)} className="capitalize">
                        {report.aiAnalysis.riskLevel}
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusColor(report.status)} className="flex items-center gap-1 w-fit">
                      {getStatusIcon(report.status)}
                      <span className="capitalize">{report.status.replace("-", " ")}</span>
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm" onClick={() => viewReportDetails(report)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => startReview(report)}>
                        Review
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Report Detail Dialog */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Report Details</DialogTitle>
            <DialogDescription>Full details of the violation report</DialogDescription>
          </DialogHeader>

          {selectedReport && (
            <div className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Reporter</Label>
                  <p className="text-sm text-muted-foreground">{selectedReport.userName}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Date Reported</Label>
                  <p className="text-sm text-muted-foreground">{new Date(selectedReport.timestamp).toLocaleString()}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Category</Label>
                  <Badge variant="outline" className="capitalize">
                    {selectedReport.category}
                  </Badge>
                </div>
                <div>
                  <Label className="text-sm font-medium">Status</Label>
                  <Badge variant={getStatusColor(selectedReport.status)} className="flex items-center gap-1 w-fit">
                    {getStatusIcon(selectedReport.status)}
                    <span className="capitalize">{selectedReport.status.replace("-", " ")}</span>
                  </Badge>
                </div>
              </div>

              {/* Title & Description */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Title</Label>
                <p className="text-sm">{selectedReport.title}</p>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Description</Label>
                <p className="text-sm text-muted-foreground">{selectedReport.description}</p>
              </div>

              {/* Location */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Location</Label>
                <p className="text-sm text-muted-foreground">{selectedReport.location.address}</p>
                <p className="text-xs text-muted-foreground">
                  Coordinates: {selectedReport.location.coordinates.lat}, {selectedReport.location.coordinates.lng}
                </p>
              </div>

              {/* AI Analysis */}
              {selectedReport.aiAnalysis && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium">AI Analysis</Label>
                  <div className="bg-muted/50 p-3 rounded-lg space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Confidence:</span>
                      <span className="text-sm font-medium">
                        {(selectedReport.aiAnalysis.confidence * 100).toFixed(0)}%
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Risk Level:</span>
                      <Badge variant={getRiskLevelColor(selectedReport.aiAnalysis.riskLevel)} className="capitalize">
                        {selectedReport.aiAnalysis.riskLevel}
                      </Badge>
                    </div>
                    <div>
                      <span className="text-sm">Detected Violations:</span>
                      <ul className="text-sm text-muted-foreground mt-1">
                        {selectedReport.aiAnalysis.detectedViolations.map((violation, index) => (
                          <li key={index}>• {violation}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* Images */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Evidence Images</Label>
                <div className="grid grid-cols-2 gap-4">
                  {selectedReport.images.map((image, index) => (
                    <div key={index} className="aspect-video bg-muted rounded-lg overflow-hidden">
                      <img
                        src={image || "/placeholder.svg"}
                        alt={`Evidence ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Review Info */}
              {selectedReport.reviewedBy && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Review Information</Label>
                  <div className="bg-muted/50 p-3 rounded-lg space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Reviewed by:</span>
                      <span className="text-sm font-medium">{selectedReport.reviewedBy}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Review date:</span>
                      <span className="text-sm font-medium">
                        {selectedReport.reviewedAt && new Date(selectedReport.reviewedAt).toLocaleString()}
                      </span>
                    </div>
                    {selectedReport.reviewNotes && (
                      <div>
                        <span className="text-sm">Notes:</span>
                        <p className="text-sm text-muted-foreground mt-1">{selectedReport.reviewNotes}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

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
              <Button variant="outline" onClick={() => setIsReviewDialogOpen(false)} disabled={isLoading}>
                Cancel
              </Button>
              <Button onClick={submitReview} disabled={isLoading}>
                {isLoading ? (
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
