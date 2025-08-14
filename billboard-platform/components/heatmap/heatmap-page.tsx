"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, Clock, MapPin } from "lucide-react"

// Dummy data for violations
const violations = [
  {
    id: 1,
    location: "123 Main St, Downtown",
    type: "Size Violation",
    status: "flagged",
    reports: 3,
    coordinates: { lat: 40.7128, lng: -74.006 },
  },
  {
    id: 2,
    location: "456 Oak Ave, Midtown",
    type: "Placement",
    status: "under-review",
    reports: 1,
    coordinates: { lat: 40.7589, lng: -73.9851 },
  },
  {
    id: 3,
    location: "789 Pine St, Uptown",
    type: "Content",
    status: "resolved",
    reports: 2,
    coordinates: { lat: 40.7831, lng: -73.9712 },
  },
  {
    id: 4,
    location: "321 Elm St, Westside",
    type: "Safety Hazard",
    status: "flagged",
    reports: 5,
    coordinates: { lat: 40.7505, lng: -74.0087 },
  },
]

export function HeatmapPage() {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "flagged":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      case "under-review":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      case "resolved":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Public Violation Heatmap</h1>
        <p className="text-muted-foreground">Interactive map showing reported billboard violations across the city</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Map Placeholder */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Violation Map</CardTitle>
              <CardDescription>Click on pins to view violation details</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-muted/30 rounded-lg h-96 flex items-center justify-center">
                <div className="text-center space-y-2">
                  <MapPin className="h-12 w-12 text-muted-foreground mx-auto" />
                  <p className="text-muted-foreground">Interactive Map Component</p>
                  <p className="text-sm text-muted-foreground">Map would show pins for each violation location</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Violations List */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Recent Violations</CardTitle>
              <CardDescription>Latest reported billboard violations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {violations.map((violation) => (
                  <div key={violation.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <AlertTriangle className="h-4 w-4 text-orange-500" />
                        <span className="font-medium text-sm">{violation.type}</span>
                      </div>
                      <Badge className={getStatusColor(violation.status)}>{violation.status.replace("-", " ")}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{violation.location}</p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>
                        {violation.reports} report{violation.reports !== 1 ? "s" : ""}
                      </span>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-3 w-3" />
                        <span>2 days ago</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Statistics */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm">Total Violations</span>
                  <span className="font-medium">{violations.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Active Cases</span>
                  <span className="font-medium">{violations.filter((v) => v.status !== "resolved").length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Resolved</span>
                  <span className="font-medium">{violations.filter((v) => v.status === "resolved").length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Total Reports</span>
                  <span className="font-medium">{violations.reduce((sum, v) => sum + v.reports, 0)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
