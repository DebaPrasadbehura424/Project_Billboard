export interface User {
  id: string
  email: string
  name: string
  role: "citizen" | "authority"
  createdAt: string
}

export interface ViolationReport {
  id: string
  userId: string
  userName: string
  title: string
  description: string
  category: "size" | "placement" | "content" | "hazard"
  location: {
    address: string
    coordinates: {
      lat: number
      lng: number
    }
  }
  images: string[]
  videos?: string[]
  timestamp: string
  status: "pending" | "approved" | "rejected" | "under-review"
  reviewedBy?: string
  reviewedAt?: string
  reviewNotes?: string
  aiAnalysis?: {
    confidence: number
    detectedViolations: string[]
    riskLevel: "low" | "medium" | "high"
  }
}

export interface DashboardStats {
  totalReports: number
  pendingReports: number
  approvedReports: number
  rejectedReports: number
  myReports?: number
}
