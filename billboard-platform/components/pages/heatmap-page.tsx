"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MapComponent } from "@/components/ui/map-component"
import { Search, Filter, MapPin, AlertTriangle, Clock, CheckCircle, XCircle } from "lucide-react"

// Mock data for heatmap
const mockHeatmapData = [
  {
    id: "1",
    position: { lat: 40.7128, lng: -74.006 },
    title: "Oversized Billboard on Main Street",
    category: "size",
    status: "pending",
    riskLevel: "medium",
    reportCount: 3,
  },
  {
    id: "2",
    position: { lat: 40.7589, lng: -73.9851 },
    title: "Billboard in Restricted Zone",
    category: "placement",
    status: "under-review",
    riskLevel: "high",
    reportCount: 5,
  },
  {
    id: "3",
    position: { lat: 40.7282, lng: -73.7949 },
    title: "Inappropriate Content Display",
    category: "content",
    status: "approved",
    riskLevel: "low",
    reportCount: 2,
  },
  {
    id: "4",
    position: { lat: 40.7505, lng: -73.9934 },
    title: "Structural Safety Concern",
    category: "hazard",
    status: "rejected",
    riskLevel: "high",
    reportCount: 1,
  },
  {
    id: "5",
    position: { lat: 40.7614, lng: -73.9776 },
    title: "Unauthorized Billboard Installation",
    category: "placement",
    status: "pending",
    riskLevel: "low",
    reportCount: 4,
  },
  {
    id: "6",
    position: { lat: 40.7831, lng: -73.9712 },
    title: "Billboard Blocking Traffic Sign",
    category: "hazard",
    status: "approved",
    riskLevel: "high",
    reportCount: 7,
  },
  {
    id: "7",
    position: { lat: 40.7484, lng: -73.9857 },
    title: "Excessive Brightness Violation",
    category: "content",
    status: "under-review",
    riskLevel: "medium",
    reportCount: 2,
  },
  {
    id: "8",
    position: { lat: 40.735, lng: -74.002 },
    title: "Billboard in Residential Zone",
    category: "placement",
    status: "pending",
    riskLevel: "medium",
    reportCount: 3,
  },
]

const stats = {
  totalViolations: mockHeatmapData.length,
  highRisk: mockHeatmapData.filter((item) => item.riskLevel === "high").length,
  pending: mockHeatmapData.filter((item) => item.status === "pending").length,
  approved: mockHeatmapData.filter((item) => item.status === "approved").length,
}

export function HeatmapPage() {
  const [filteredData, setFilteredData] = useState(mockHeatmapData)
  const [filters, setFilters] = useState({
    search: "",
    status: "all",
    category: "all",
    riskLevel: "all",
  })

  const applyFilters = () => {
    let filtered = mockHeatmapData

    if (filters.search) {
      filtered = filtered.filter((item) => item.title.toLowerCase().includes(filters.search.toLowerCase()))
    }

    if (filters.status !== "all") {
      filtered = filtered.filter((item) => item.status === filters.status)
    }

    if (filters.category !== "all") {
      filtered = filtered.filter((item) => item.category === filters.category)
    }

    if (filters.riskLevel !== "all") {
      filtered = filtered.filter((item) => item.riskLevel === filters.riskLevel)
    }

    setFilteredData(filtered)
  }

  const clearFilters = () => {
    setFilters({
      search: "",
      status: "all",
      category: "all",
      riskLevel: "all",
    })
    setFilteredData(mockHeatmapData)
  }

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-3 w-3" />
      case "approved":
        return <CheckCircle className="h-3 w-3" />
      case "rejected":
        return <XCircle className="h-3 w-3" />
      case "under-review":
        return <AlertTriangle className="h-3 w-3" />
      default:
        return <Clock className="h-3 w-3" />
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
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">Public Violation Heatmap</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Interactive map showing all reported billboard violations across the city. Help keep your community
            compliant by viewing and reporting violations in your area.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Violations</CardTitle>
              <MapPin className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalViolations}</div>
              <p className="text-xs text-muted-foreground">Reported locations</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">High Risk</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.highRisk}</div>
              <p className="text-xs text-muted-foreground">Safety concerns</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pending}</div>
              <p className="text-xs text-muted-foreground">Awaiting review</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Confirmed</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.approved}</div>
              <p className="text-xs text-muted-foreground">Verified violations</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Map Filters
            </CardTitle>
            <CardDescription>Filter violations shown on the map</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="search">Search</Label>
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="search"
                    placeholder="Search violations..."
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
                <Label>Risk Level</Label>
                <Select value={filters.riskLevel} onValueChange={(value) => handleFilterChange("riskLevel", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="All risk levels" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All risk levels</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
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

        {/* Map */}
        <Card>
          <CardHeader>
            <CardTitle>Violation Locations ({filteredData.length})</CardTitle>
            <CardDescription>
              Click on map markers to view violation details. Red markers indicate high-risk violations.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <MapComponent
              center={{ lat: 40.7589, lng: -73.9851 }}
              markers={filteredData}
              height="600px"
              showHeatmap={true}
            />
          </CardContent>
        </Card>

        {/* Legend */}
        <Card>
          <CardHeader>
            <CardTitle>Map Legend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <h4 className="font-medium mb-2">Status</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge variant={getStatusColor("pending")} className="flex items-center gap-1">
                      {getStatusIcon("pending")}
                      Pending
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={getStatusColor("under-review")} className="flex items-center gap-1">
                      {getStatusIcon("under-review")}
                      Under Review
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={getStatusColor("approved")} className="flex items-center gap-1">
                      {getStatusIcon("approved")}
                      Approved
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={getStatusColor("rejected")} className="flex items-center gap-1">
                      {getStatusIcon("rejected")}
                      Rejected
                    </Badge>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Risk Level</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge variant={getRiskLevelColor("high")}>High Risk</Badge>
                    <span className="text-sm text-muted-foreground">Safety concerns</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={getRiskLevelColor("medium")}>Medium Risk</Badge>
                    <span className="text-sm text-muted-foreground">Compliance issues</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={getRiskLevelColor("low")}>Low Risk</Badge>
                    <span className="text-sm text-muted-foreground">Minor violations</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Categories</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">Size</Badge>
                    <span className="text-sm text-muted-foreground">Dimension violations</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">Placement</Badge>
                    <span className="text-sm text-muted-foreground">Location issues</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">Content</Badge>
                    <span className="text-sm text-muted-foreground">Inappropriate content</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">Hazard</Badge>
                    <span className="text-sm text-muted-foreground">Safety hazards</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">How to Help</h4>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>• Report new violations you discover</p>
                  <p>• Provide clear photos and descriptions</p>
                  <p>• Include accurate location information</p>
                  <p>• Help keep your community compliant</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
