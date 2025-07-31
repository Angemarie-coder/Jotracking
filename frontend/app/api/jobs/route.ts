import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import api from "@/lib/api";

interface JwtPayload {
  userId: string;
  // Add other fields from your JWT payload if needed
}

function verifyToken(request: NextRequest): JwtPayload | null {
  const authHeader = request.headers.get("authorization")
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null
  }

  const token = authHeader.substring(7)
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key") as JwtPayload
    return decoded
  } catch {
    return null
  }
}

// Forward GET requests to the backend API
export async function GET(request: NextRequest) {
  try {
    const user = verifyToken(request)
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get the search params from the URL
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const page = searchParams.get('page') || '1'
    const limit = searchParams.get('limit') || '10'

    // Build query string for the backend API
    const queryParams = new URLSearchParams()
    if (status) queryParams.append('status', status)
    queryParams.append('page', page)
    queryParams.append('limit', limit)

    // Forward the request to the backend API
    const response = await api.get(`/api/jobs?${queryParams.toString()}`)
    return NextResponse.json(response.data)
  } catch (error: any) {
    console.error("Get jobs error:", error)
    return NextResponse.json(
      { error: error.response?.data?.message || "Failed to fetch jobs" },
      { status: error.response?.status || 500 }
    )
  }
}

// Forward POST requests to the backend API
export async function POST(request: NextRequest) {
  try {
    const user = verifyToken(request)
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const jobData = await request.json()

    // Validate required fields
    const requiredFields = ["title", "company", "location", "status"]
    for (const field of requiredFields) {
      if (!jobData[field]) {
        return NextResponse.json({ error: `${field} is required` }, { status: 400 })
      }
    }

    // Forward the request to the backend API
    const response = await api.post('/api/jobs', { ...jobData, userId: user.userId })
    return NextResponse.json(response.data, { status: 201 })
  } catch (error: any) {
    console.error("Create job error:", error)
    return NextResponse.json(
      { error: error.response?.data?.message || "Failed to create job" },
      { status: error.response?.status || 500 }
    )
  }
}
