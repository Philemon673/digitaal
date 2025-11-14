import { inngest } from "@/config/inngest";
import Product from "@/models/product";
import User from "@/models/user";
import Order from "@/models/order";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import ConnectDB from "@/config/db";

export async function POST(request) {
  try {
    await ConnectDB();

    const { userId } = getAuth(request);
    const { address, items } = await request.json();

    if (!address || !items || items.length === 0) {
      return NextResponse.json({ success: false, message: "All fields are required" });
    }

    // Calculate total amount
    let amount = 0;
    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) continue;
      amount += product.offerPrice * item.quantity;
    }

    const totalAmount = amount + Math.floor(amount * 0.025); // 2.5% tax

    // Create and save order in MongoDB
    const order = new Order({
      userId,
      items,
      amount: totalAmount,
      address,
      status: "pending",
      date: new Date()
    });
    await order.save();

    // Send event to Inngest
    await inngest.send({
      name: "order/created",
      data: {
        userId,
        address,
        items,
        amount: totalAmount,
        date: new Date(),
      },
    });

    // Clear user cart
    const user = await User.findOne({ clerkId: userId });
    if (user) {
      user.cartItem = {};
      await user.save();
    }

    return NextResponse.json({ success: true, message: "Order created successfully" });
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json({ success: false, message: error.message });
  }
}
