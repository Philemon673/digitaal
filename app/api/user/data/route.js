import ConnectDB from "@/config/db";
import User from "@/models/user";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";


export async function GET(request){

    try {
        const { userId } = getAuth (request)

        await ConnectDB()
        const user = await user.findById(userId)
         
        if(!user){
          return NextResponse.json({ success: false, message: "user not found"})
            
        }
        return NextResponse.json({ success: true, User})

        
    } catch (error) {
        
          return NextResponse.json({ success: false, message: error.message} )
            
    }
}