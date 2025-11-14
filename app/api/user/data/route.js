/* API to get user data */
import ConnectDB from "@/config/db";
import User from "@/models/user";
import { getAuth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const { userId } = getAuth(request);

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "unauthorized" },
        { status: 401 }
      );
    }

    await ConnectDB();

    let user = await User.findOne({ clerkId: userId });

    if (!user) {
      const clerkUser = await currentUser(request); // ✅ pass request

      if (!clerkUser) {
        return NextResponse.json(
          { success: false, message: "Clerk user not found" },
          { status: 404 }
        );
      }

      const email = clerkUser.emailAddresses?.[0]?.emailAddress || "";
      const name = `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim();
      const imageUrl = clerkUser.imageUrl || clerkUser.profileImageUrl || "";
      const role = clerkUser.publicMetadata?.role || "buyer";

      user = await User.findOne({ email });

      if (!user) {
        user = await User.create({
          clerkId: userId,
          name,
          email,
          imageUrl,
          role,
        });
      } else {
        user.clerkId = userId;
        user.role = role;
        await user.save();
      }
    } else {
      const clerkUser = await currentUser(request); // ✅ pass request again
      const clerkRole = clerkUser?.publicMetadata?.role;
      if (clerkRole && clerkRole !== user.role) {
        user.role = clerkRole;
        await user.save();
      }
    }

    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
