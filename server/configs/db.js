import mongoose from "mongoose";

const connectDB = async()=>{
    try{
        mongoose.connection.on("connected",()=>{console.log("MongoDB connected")})

        let mongoURI = process.env.MONGODB_URI;

        const projectName = "Resume_Builder";

        if(!mongoURI) {
            throw new Error("MongoDB URI is not defined in environment variables");
        }

        if(mongoURI.endsWith("/")) {
            mongoURI = mongoURI.slice(0, -1);
        }
        await mongoose.connect(`${mongoURI}/${projectName}`)
    }catch(err){
        console.error("Error connecting to MongoDB:", err);
    }
}

export default connectDB;