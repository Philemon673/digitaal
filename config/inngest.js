import { Inngest } from "inngest";
import ConnectDB from "./db";
import User from "@/models/user";

// Create a client to send and receive events
export const inngest = new Inngest({ id: "quickcart-next" });

// inngest function to save user data to database
export const syncUserCreation = inngest.createFunction(
    {
       id: "sync-user-from clerk",
    },
    {
        event: " clerk/user.created"
    },
    async ({ event }) =>{
        const { id, first_name, last_name, email_addresses, image_url } = event.data;
        //object to collect user data to be saved to database
        const userData = {
            _id: id,
            email: email_addresses[0].email_address,
            name: `${first_name} ${last_name}`,
            imageUrl: image_url,
        }
        await ConnectDB();
        await User.create(userData);
    }
)
// inngest function to update user data in database
export const syncUserUpdation = inngest.createFunction(
    {
        id: 'update-user-from-clerk'
    },
    {
        event: 'clerk/user.update'
    },
    async({event}) => {
         const { id, first_name, last_name, email_addresses, image_url } = event.data;
        //object to collect user data to be saved to database
        const userData = {
            _id: id,
            email: email_addresses[0].email_address,
            name: `${first_name} ${last_name}`,
            imageUrl: image_url,
        }
        await ConnectDB();
        await User.findByIdAndUpdate(id, userData)
    }
) 
//inngest function for delete user from the database
export const syncUserDeletion = inngest.createFunction(
    {
        id: 'delete-user-with-clerk'
    },
    {
        event: 'clerk/user.delete'
    },
    async({event}) => {
        //object to collect user data to be saved to database
        const { id } = event.data;

        await ConnectDB();
        await User.findByIdAndDelete(id)
    }
)