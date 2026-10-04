import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Resume from "../models/Resume.js";

const generateToken = (userId) => {
    // Token generation logic here
    const token = jwt.sign({id: userId}, process.env.JWT_SECRET_KEY, {expiresIn: "10h"});
    return token;
};

//Post Method: Register a new user /api/users/register
export const registerUser = async (req, res) => {
    try{
        const { name, email, password } = req.body;

        // Check if require fields are present
        if(!name || !email || !password) {
            return res.status(400).json({message: "Please fill all the fields"});
        }

        //Check if user already exists
        const user = await User.findOne({email});

        if(user) {
            return res.status(400).json({message: "User already exists"});
        }

        //Create new user
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({
            name,
            email,
            password: hashedPassword
        });

        //Return Success response
        const token = generateToken(newUser._id);
        newUser.password = undefined; // Hide password in response
        return res.status(201).json({message: "User registered successfully", token, user: newUser});

    }catch(error){
        res.status(500).json({message: error.message});
    }
}

//Controller for user login
//Path POST /api/users/login

export const loginUser = async (req, res) => {
    try{
        const { email, password } = req.body;

        //check if user exists
        const user = await User.findOne({email});
        if(!user) {
            return res.status(400).json({message: "Invalid email or password"});
        }

        //Check if password is correct
        if(!user.comparePassword(password)) {
            return res.status(400).json({message: "Invalid email or password"});
        }

        //Return success response
        const token = generateToken(user._id);
        user.password = undefined; // Hide password in response 
        return res.status(200).json({message: "User logged in successfully", token, user});
    }catch(error){
        res.status(500).json({message: error.message});
    }
}

//Controller for getting user by Id.
//GET /api/users/:id

export const getUserById = async (req, res) => {
    try{
        const userId = req.userId; // Assuming user ID is available in req.userId after authentication middleware

        ///Check if user exists
        const user = await User.findById(userId);

        if(!user) {
            return res.status(404).json({message: "User not found"});
        }

        //return user
        user.password = undefined; // Hide password in response
        return res.status(200).json({user});

    }catch(error){
        res.status(500).json({message: error.message});
    }
}

//Controller for getting User Resume
//Path:- GET /api/users/resumes

export const getUserResumes  = async (req, res)=>{
    try{
        const userId = req.userId;
        //return user Resume
        const resumes = await Resume.find({userId})
        return res.status(200).json({resumes})


    }catch(err){
        return res.status(400).json({message: err.message})
    }
}