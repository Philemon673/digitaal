import ConnectDB from "@/config/db"
import Product from "@/models/product"
import User from "@/models/user"
import { NextResponse } from "next/server"

export async function GET(request){
    try {
        await ConnectDB()

        const products = await Product.find({}).lean()
        const userIds = [...new Set(products.map(p => p.userId))]
        const users = await User.find({ clerkId: { $in: userIds } }).lean()
        
        const productsWithSeller = products.map(p => {
            const seller = users.find(u => u.clerkId === p.userId)
            return {
                ...p,
                sellerEmail: seller ? seller.email : null,
                sellerPhone: seller?.phone || null,
            }
        })

        return NextResponse.json({ success: true, product: productsWithSeller })
        
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message })
    }
}