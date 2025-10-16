import mongoose from "mongoose";



const orderSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        ref: 'User'
    },
    items: [{
       product: {
        type: string,
        required: true,
        ref: 'Product',
       },
         quantity: {
            type: Number,
            required: true,
         },
    }],
   amount: {
    type: Number,
    required: true,
   },
    address: {
    type: String,
    ref: 'Address',
    required: true
    },
    status: {
    type: String,
    required: true,
    defualt: 'order placed'
    },
    date: {
    type: Date,
    required: true,
    }
});
const Order = mongoose.models.order || mongoose.model('order', orderSchema);
export default Order;