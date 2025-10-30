import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config()

let cached = global.mongoose

if(!cached) {
    cached = global.mongoose = { conn: null, promise: null }
}

async function ConnectDB() {
    if ( cached.conn ) {
        console.log ("Using cached database connection");
        return cached.conn
    }

    if(!cached.promise) {
        const opts = {
            bufferCommands: false,
        }
        
        console.log("Connecting to database connection");
        cached.promise = mongoose.connect(`${process.env.MONGODB_URI}`,opts).then( (mongoose) => {
            return mongoose
        }).catch ((error)=>{
            console.error("connection failed", error.message);
            throw error;
        })
         cached.conn = await cached.promise
         return cached.conn
    }
}

export default ConnectDB;