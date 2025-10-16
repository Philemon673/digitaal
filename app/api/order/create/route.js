import { inngest } from "@/config/inngest";
import Product from "@/models/product";
import User from "@/models/user";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";



export async function POST(request) {
    try {
        const { userId } = getAuth(request)
        const { address, items } = await request.json()

        if (!address || items.length === 0) {
            return NextResponse.json({ success: false, message: "All fields are required" })
        }
        //calculate amount using items and the reduce method
        const amount = await items.reduce(async (acc, item) => {
            const Product = await Product.findById(item.product)
            return acc + Product.offerPrice * item.quantity
        }, 0)
        //create order object to be sent to inngest
        await inngest.send({
            name: 'order/created',
            data: {
                userId,
                address,
                items,
                amount: amount + Math.floor(amount * 0.025), //adding 2.5% tax to the amount
                date: Date.now()
            }
        })
        // clear user cart after order is created
        const user = await User.findById(userId)
        user.cartItems = {}
        await user.save()
        return NextResponse.json({ success: true, message: "Order created successfully" })

    } catch (error) {
        console.log(error)
        return NextResponse.json({ success: false, message: error.message })
    }

}