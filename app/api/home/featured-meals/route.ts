import { NextResponse } from 'next/server'

export async function GET() {
  const featuredMeals = [
    {
      id: "a833d019-56d6-45c1-9b74-78588703e7e6",
      name: "Pizza Pices",
      description: "Deshi Pizza",
      price: 180,
      image: "https://media.istockphoto.com/id/187248625/photo/pepperoni-pizza.jpg?b=1&s=612x612&w=0&k=20&c=PiYdpOdMmoJDChL_6FV2yvIff1OYJrETf4tizMsX6Sg=",
      category: "Bangladeshi",
      providerName: "Pasta Point Uttara Branch"
    },
    {
      id: "e87672f4-21dc-4f08-b715-5d1601ec14e7",
      name: "Pasta",
      description: "American Pasta",
      price: 12.99,
      image: "https://example.com/pasta.jpg",
      category: "Desserts",
      providerName: "Pasta Point Uttara Branch"
    },
    {
      id: "3b0067ce-136c-47b2-9a6f-274f9381481f",
      name: "Pasta",
      description: "American Pasta",
      price: 12.99,
      image: "https://example.com/pasta.jpg",
      category: "Desserts",
      providerName: "Pasta Point Uttara Branch"
    },
    {
      id: "66784cdf-96f8-455f-bc3e-2926c6964e1c",
      name: "Pasta",
      description: "American Pasta",
      price: 12.99,
      image: "https://example.com/pasta.jpg",
      category: "Desserts",
      providerName: "Pasta Point Uttara Branch"
    },
    {
      id: "9b015723-b454-436a-a599-212cbd8c9993",
      name: "Pasta",
      description: "American Pasta",
      price: 12.99,
      image: "https://example.com/pasta.jpg",
      category: "Desserts",
      providerName: "Pasta Point Uttara Branch"
    },
    {
      id: "7151b7dc-ce13-48d5-9a1b-139b6eace33b",
      name: "Pasta",
      description: "American Pasta",
      price: 12.99,
      image: "https://example.com/pasta.jpg",
      category: "Desserts",
      providerName: "Pasta Point Uttara Branch"
    }
  ]

  return NextResponse.json(featuredMeals)
}
