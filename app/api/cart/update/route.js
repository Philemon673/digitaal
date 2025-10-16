import ConnectDB from "@/config/db"
import User from "@/models/user"
import { getAuth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"


export async function POST(request){
    try {
        const { userId} = getAuth(request)

        const { cartData } = await request.json()
        // Update cart in database

        await ConnectDB()
        const user = await User.findById(userId)
        
        // Update cart items
        user.cartItems = cartData
        await user.save()

        NextResponse.json({ success: true, message: "Cart updated successfully" })
        
    } catch (error) {
            NextResponse.json({ success: false, message: error.message })   
    }
}