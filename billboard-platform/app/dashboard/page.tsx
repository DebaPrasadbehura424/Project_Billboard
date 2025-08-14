"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { CitizenDashboard } from "@/components/dashboard/citizen-dashboard"
import { AuthorityDashboard } from "@/components/dashboard/authority-dashboard"
import { Loader2 } from "lucide-react"
import type { User } from "@/lib/types"

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/login")
      return
    }

    try {
      const parsedUser = JSON.parse(userData)
      setUser(parsedUser)
    } catch (error) {
      console.error("Error parsing user data:", error)
      router.push("/login")
    } finally {
      setIsLoading(false)
    }
  }, [router])

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {user.role === "citizen" ? <CitizenDashboard user={user} /> : <AuthorityDashboard user={user} />}
    </div>
  )
}
