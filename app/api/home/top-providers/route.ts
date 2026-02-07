import { NextResponse } from 'next/server'

export async function GET() {
  const topProviders = [
    {
      id: "bd577185-dc62-4bee-8d81-02b4e4a75492",
      name: "Najib",
      totalMeals: 0
    },
    {
      id: "357ebb44-6c3b-43e3-acbc-94261628cd86",
      name: "Pasta Point Uttara",
      totalMeals: 0
    },
    {
      id: "e0cecc8a-81d1-4307-9dbc-1f7960f9a7c2",
      name: "Pasta Point Uttara Branch",
      totalMeals: 10
    },
    {
      id: "fabfce59-540b-4255-983c-f2bc5db25cce",
      name: "Urban Noodles",
      totalMeals: 2
    },
    {
      id: "d74f9493-17c8-4ff0-ad96-82028652b275",
      name: "Spice Garden",
      totalMeals: 2
    }
  ]

  return NextResponse.json(topProviders)
}
