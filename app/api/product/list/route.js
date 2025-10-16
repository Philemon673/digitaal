import ConnectDB from "@/config/db"
import Product from "@/models/product"
import { NextResponse } from "next/server"


export async function GET(request){
    try {
       
        await ConnectDB()

        const product = await Product.find({})
        return NextResponse.json({ success: true, product })
        
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message })
    }
}