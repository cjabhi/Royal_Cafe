import mongoose from "mongoose";

export const connectDB = async () => {
    await mongoose.connect('mongodb+srv://cjabhi:raunak@cluster0.5bpuo.mongodb.net/food-del').then(()=>console.log("DB Connected"));
    
}