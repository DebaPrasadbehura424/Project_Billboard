"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Navigation, ZoomIn, ZoomOut, Layers } from "lucide-react"

interface MapMarker {
  id: string
  position: {
    lat: number
    lng: number
  }
  title: string
  category: string
  status: string
  riskLevel?: string
  reportCount?: number
}

interface MapComponentProps {
  center: {
    lat: number
    lng: number
  }
  markers: MapMarker[]
  height?: string
  showHeatmap?: boolean
}

export function MapComponent({ center, markers, height = "400px", showHeatmap = false }: MapComponentProps) {
  const [selectedMarker, setSelectedMarker] = useState<MapMarker | null>(null)
  const [mapView, setMapView] = useState<"street" | "satellite">("street")
  const [zoom, setZoom] = useState(12)

  const getMarkerColor = (marker: MapMarker) => {
    if (marker.riskLevel === "high") return "bg-red-500"
    if (marker.status === "approved") return "bg-green-500"
    if (marker.status === "under-review") return "bg-yellow-500"
    return "bg-blue-500"
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
    <div className="relative" style={{ height }}>
      {/* Map Container */}
      <div className="w-full h-full bg-muted rounded-lg relative overflow-hidden">
        {/* Mock Map Background */}
        <div
          className={`w-full h-full ${
            mapView === "satellite" ? "bg-green-900" : "bg-gray-200"
          } relative transition-colors`}
        >
          {/* Grid Pattern for Street View */}
          {mapView === "street" && (
            <div className="absolute inset-0 opacity-20">
              <div className="grid grid-cols-8 grid-rows-6 h-full w-full">
                {Array.from({ length: 48 }).map((_, i) => (
                  <div key={i} className="border border-gray-400" />
                ))}
              </div>
            </div>
          )}

          {/* Map Controls */}
          <div className="absolute top-4 right-4 flex flex-col gap-2">
            <Button
              variant="secondary"
              size="icon"
              onClick={() => setZoom(Math.min(zoom + 1, 18))}
              className="bg-white/90 hover:bg-white"
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              onClick={() => setZoom(Math.max(zoom - 1, 1))}
              className="bg-white/90 hover:bg-white"
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              onClick={() => setMapView(mapView === "street" ? "satellite" : "street")}
              className="bg-white/90 hover:bg-white"
            >
              <Layers className="h-4 w-4" />
            </Button>
          </div>

          {/* Center Marker */}
          <div
            className="absolute transform -translate-x-1/2 -translate-y-1/2"
            style={{
              left: "50%",
              top: "50%",
            }}
          >
            <Navigation className="h-6 w-6 text-primary" />
          </div>

          {/* Violation Markers */}
          {markers.map((marker, index) => {
            // Calculate position relative to center (mock positioning)
            const offsetX = (marker.position.lng - center.lng) * 1000 + 50
            const offsetY = (center.lat - marker.position.lat) * 1000 + 50

            return (
              <div
                key={marker.id}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
                style={{
                  left: `${Math.max(10, Math.min(90, 50 + offsetX))}%`,
                  top: `${Math.max(10, Math.min(90, 50 + offsetY))}%`,
                }}
                onClick={() => setSelectedMarker(marker)}
              >
                <div className="relative">
                  <div
                    className={`w-4 h-4 rounded-full ${getMarkerColor(
                      marker,
                    )} border-2 border-white shadow-lg animate-pulse`}
                  />
                  {marker.reportCount && marker.reportCount > 1 && (
                    <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {marker.reportCount}
                    </div>
                  )}
                </div>
              </div>
            )
          })}

          {/* Heatmap Overlay */}
          {showHeatmap && (
            <div className="absolute inset-0 pointer-events-none">
              {markers.map((marker, index) => {
                const offsetX = (marker.position.lng - center.lng) * 1000 + 50
                const offsetY = (center.lat - marker.position.lat) * 1000 + 50
                const intensity = marker.riskLevel === "high" ? 0.8 : marker.riskLevel === "medium" ? 0.5 : 0.3

                return (
                  <div
                    key={`heatmap-${marker.id}`}
                    className="absolute transform -translate-x-1/2 -translate-y-1/2"
                    style={{
                      left: `${Math.max(10, Math.min(90, 50 + offsetX))}%`,
                      top: `${Math.max(10, Math.min(90, 50 + offsetY))}%`,
                    }}
                  >
                    <div
                      className="w-20 h-20 rounded-full bg-red-500 opacity-20 blur-sm"
                      style={{ opacity: intensity * 0.3 }}
                    />
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Map Info */}
        <div className="absolute bottom-4 left-4 bg-white/90 rounded px-3 py-2 text-sm">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            <span>Zoom: {zoom}</span>
            <span>•</span>
            <span className="capitalize">{mapView} view</span>
          </div>
        </div>
      </div>

      {/* Selected Marker Info */}
      {selectedMarker && (
        <Card className="absolute top-4 left-4 w-80 bg-white/95 backdrop-blur">
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-3">
              <h3 className="font-semibold text-sm">{selectedMarker.title}</h3>
              <Button variant="ghost" size="sm" onClick={() => setSelectedMarker(null)} className="h-6 w-6 p-0">
                ×
              </Button>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="capitalize">
                  {selectedMarker.category}
                </Badge>
                <Badge variant={getStatusColor(selectedMarker.status)} className="capitalize">
                  {selectedMarker.status.replace("-", " ")}
                </Badge>
                {selectedMarker.riskLevel && (
                  <Badge variant={getRiskLevelColor(selectedMarker.riskLevel)} className="capitalize">
                    {selectedMarker.riskLevel}
                  </Badge>
                )}
              </div>

              <div className="text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  <span>
                    {selectedMarker.position.lat.toFixed(4)}, {selectedMarker.position.lng.toFixed(4)}
                  </span>
                </div>
                {selectedMarker.reportCount && selectedMarker.reportCount > 1 && (
                  <div className="mt-1">
                    <span>{selectedMarker.reportCount} reports at this location</span>
                  </div>
                )}
              </div>

              <Button size="sm" className="w-full mt-3" asChild>
                <a href={`/violation/${selectedMarker.id}`}>View Details</a>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
