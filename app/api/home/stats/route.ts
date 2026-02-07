import { NextResponse } from 'next/server'

export async function GET() {
  const stats = {
    totalMeals: 14,
    totalProviders: 5,
    totalUsers: 9,
    totalReviews: 3
  }

  return NextResponse.json(stats)
}
