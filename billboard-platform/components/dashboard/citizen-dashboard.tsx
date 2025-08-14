"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ReportViolationDialog } from "@/components/dashboard/report-violation-dialog"
import { Plus, FileText, Clock, CheckCircle, XCircle, AlertTriangle } from "lucide-react"
import type { User, ViolationReport, DashboardStats } from "@/lib/types"

// Mock data for demonstration
const mockStats: DashboardStats = {
  totalReports: 12,
  pendingReports: 3,
  approvedReports: 7,
  rejectedReports: 2,
  myReports: 12,
}

const mockReports: ViolationReport[] = [
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
    status: "approved",
    reviewedBy: "Authority User",
    reviewedAt: "2024-01-16T14:20:00Z",
    aiAnalysis: {
      confidence: 0.92,
      detectedViolations: ["Size exceeds permitted dimensions"],
      riskLevel: "medium",
    },
  },
  {
    id: "2",
    userId: "1",
    userName: "John Doe",
    title: "Billboard in Restricted Zone",
    description: "Billboard placed too close to intersection, creating safety hazard",
    category: "placement",
    location: {
      address: "456 Oak Avenue, Midtown",
      coordinates: { lat: 40.7589, lng: -73.9851 },
    },
    images: ["/intersection-billboard.png"],
    timestamp: "2024-01-12T15:45:00Z",
    status: "pending",
    aiAnalysis: {
      confidence: 0.87,
      detectedViolations: ["Placement violates safety regulations"],
      riskLevel: "high",
    },
  },
  {
    id: "3",
    userId: "1",
    userName: "John Doe",
    title: "Inappropriate Content Display",
    description: "Billboard contains content not suitable for family viewing area",
    category: "content",
    location: {
      address: "789 Family Street, Suburbs",
      coordinates: { lat: 40.7282, lng: -73.7949 },
    },
    images: ["/generic-billboard.png"],
    timestamp: "2024-01-10T09:15:00Z",
    status: "rejected",
    reviewedBy: "Authority User",
    reviewedAt: "2024-01-11T11:30:00Z",
    reviewNotes: "Content deemed appropriate after review",
  },
]

interface CitizenDashboardProps {
  user: User
}

export function CitizenDashboard({ user }: CitizenDashboardProps) {
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false)

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

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Welcome back, {user.name}</h1>
          <p className="text-muted-foreground">Track your violation reports and help keep your city compliant</p>
        </div>
        <Button onClick={() => setIsReportDialogOpen(true)} size="lg">
          <Plus className="mr-2 h-4 w-4" />
          Report Violation
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Reports</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.myReports}</div>
            <p className="text-xs text-muted-foreground">All time submissions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
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

      {/* Reports History */}
      <Card>
        <CardHeader>
          <CardTitle>Your Reports</CardTitle>
          <CardDescription>History of all violation reports you've submitted</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockReports.map((report) => (
                <TableRow key={report.id}>
                  <TableCell className="font-medium">{report.title}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">
                      {report.category}
                    </Badge>
                  </TableCell>
                  <TableCell className="max-w-[200px] truncate">{report.location.address}</TableCell>
                  <TableCell>{new Date(report.timestamp).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusColor(report.status)} className="flex items-center gap-1 w-fit">
                      {getStatusIcon(report.status)}
                      <span className="capitalize">{report.status}</span>
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Report Violation Dialog */}
      <ReportViolationDialog open={isReportDialogOpen} onOpenChange={setIsReportDialogOpen} />
    </div>
  )
}
