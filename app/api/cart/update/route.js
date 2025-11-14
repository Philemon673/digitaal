import ConnectDB from "@/config/db";
import User from "@/models/user";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { userId } = getAuth(request);
    if (!userId) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const { cartData } = await request.json();

    await ConnectDB();

    // find user by clerkId, not userId
    let user = await User.findOne({ clerkId: userId });

    if (!user) {
      // if user doesn’t exist, create a new one
      user = new User({
        clerkId: userId,
        name: "Anonymous",
        email: "unknown@example.com",
        cartItem: cartData,
      });
    } else {
      // update existing user cart
      user.cartItem = cartData;
    }

    await user.save();

    return NextResponse.json({ success: true, message: "Cart updated successfully" });
  } catch (error) {
    console.error("Cart update error:", error);
    return NextResponse.json({ success: false, message: error.message });
  }
}
