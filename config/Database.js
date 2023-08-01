import mongoose from "mongoose";

export const connectDB = async()=>{
    try {
        const {connection} = await mongoose.connect(process.env.MONGO_URI,{
            dbName:"axleadmin"
        });
        console.log(`MongoDB connected with ${connection.host}`);
    } catch (error) {
        console.log(error)
    }
}