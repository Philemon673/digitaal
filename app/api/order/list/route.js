import ConnectDB from "@/config/db";
import Order from "@/models/order";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    // Get userId from Clerk authentication
    const { userId } = getAuth(request);
    if (!userId) {
      return NextResponse.json({ success: false, message: "User not authenticated" }, { status: 401 });
    }

    // Connect to MongoDB
    await ConnectDB();

    // Fetch orders for the logged-in user
    // Use lean() for faster reads and avoid Mongoose document overhead
    const orders = await Order.find({ userId })
      .populate({ path: "address", select: "fullName area city state" })
      .populate({ path: "items.product", select: "name offerPrice" })
      .lean();

    return NextResponse.json({ success: true, orders });
  } catch (error) {
    console.error("Error fetching user orders:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
