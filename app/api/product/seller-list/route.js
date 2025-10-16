import ConnectDB from "@/config/db"
import authSeller from "@/lib/authSeller"
import Product from "@/models/product"
import { getAuth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"


export async function GET(request){
    try {
        const { userId } = getAuth(request)
        const isSeller = authSeller(userId)
        if(!isSeller){
           return NextResponse.json({ success: false, message: " Not Authorized" })
        }
        await ConnectDB()

        const product = await Product.find({})
        return NextResponse.json({ success: true, product })
        
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message })
    }
}