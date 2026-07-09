import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";
import {config} from "../config/config.js";

//token generation and sending response
async function sendTokenResponse(user, res, message) {

    const token = jwt.sign({
        id: user._id
    }, config.JWT_SECRET,{
        expiresIn: "7d"
    })

    res.cookie("token", token)

    res.status(200).json({
        message,
        success: true,
        user:{
            id: user._id,
            email: user.email,
            contact: user.contact,
            fullName: user.fullName,
            role: user.role
        }
    })

}   

//register a new user
export const register = async (req, res) =>{
    const {email, password, fullName, isSeller} = req.body;
    try{
        const existingUser = await userModel.findOne({email});

        if(existingUser){
            return res.status(400).json({message: "User with this email or contact already exists"});
        }

        const user = await userModel.create({
            email,
            password,
            fullName,
            role: isSeller ? "seller" : "buyer"
        })

        await sendTokenResponse(user, res, "User registered successfully");

    } catch(error){
        console.error("Error during user registration:", error);
        res.status(500).json({message: "Internal server error"});
    }
}

//login a user
export const login = async (req, res) =>{
    const {email, password} = req.body;

    try{
        const user = await userModel.findOne({email})

        if(!user){
            return res.status(400).json({message: "Invalid email or password"});
        }

        const isMatch = await user.comparePassword(password);

        if(!isMatch){
            return res.status(400).json({message: "Invalid  password"});
        }

        await sendTokenResponse(user, res, "User logged in successfully");

    } catch(error){
        console.error("Error during user login:", error);
        res.status(500).json({message: "Internal server error"});
    }
}

//google callback
export const googleCallback = async (req, res) => {

    const {id, emails, displayName, photos} = req.user
    const email = emails[0].value
    const profilePicture = photos[0].value

    let user = await userModel.findOne({email})

    if(!user){
        user = await userModel.create({
            email,
            googleId: id,
            fullName: displayName,
            profilePicture
        })
    }   

    const token = jwt.sign({
        id:user._id,
    }, config.JWT_SECRET, {
        expiresIn: "7d"
    })

    res.cookie("token", token)
    
    res.redirect(`http://localhost:3000/`)

}

//get user details
export const getMe = async (req, res) =>{

    const user = req.user

    res.status(200).json({
        message: "User fetched successfully",
        success: true,
        user:{
            id: user._id,
            email: user.email,
            fullName: user.fullName,
            role: user.role
        }
    })

}