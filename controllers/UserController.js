import { UserModel } from "../models/useModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const register = async (req, res)=>{
    try {
        const {name, email, phone, password} = req.body;

        if(!name || !email || !phone || !password){
            return res.json({
                success: false,
                message: "Somthing Went Wrong!"
            })
        }

        const existUser = await UserModel.findOne({email});

        if(existUser){
            return res.json({
                success: false,
                message: "User Already Exist!"
            })
        }

        const hashpassword = await bcrypt.hash(password,10);

        const user = await UserModel.create({
            name, 
            email,
            phone,
            password: hashpassword
        });

        const token = jwt.sign({Id: user._id}, process.env.SECRET_KEY, {expiresIn: "7d"});

        res.cookie("token", token, {
            httpOnly: true
        })

        res.json({
            success: true,
            message: "You Registered Successfully!",
            registered_user: user
        })

    } catch (error) {
        console.log(error.message);
    }
}

export const login = async (req, res)=>{
    try {
        const { email, password} = req.body;

        if(!email || !password){
            return res.json({
                success: false,
                message: "Somthing Went Wrong!"
            })
        }

        const existUser = await UserModel.findOne({email});

        if(!existUser){
            return res.json({
                success: false,
                message: "User Already Exist!"
            })
        }

        const isMatch = await bcrypt.compare(password, existUser.password);

        if(!isMatch){
            return res.json({
                success: false,
                message: "Password is Incorrect!"
            })
        }

        const token = jwt.sign({Id: existUser._id}, process.env.SECRET_KEY, {expiresIn: "7d"});

        res.cookie("token", token, {
            httpOnly: true
        })

        res.json({
            success: true,
            message: "You Logged In Successfully!"
        })

    } catch (error) {
        console.log(error.message);
    }
}

export const isAuth = async (req, res)=>{
    
    try {
        const userId = req.user.id;
        const user = await UserModel.findById(userId).select("-password");

        res.json({
            success: true,
            user
        })
    } catch (error) {
        console.log(error.message)
        res.json({
            success: false,
            message: error.message
        })
    }
}

export const logout = async (req, res)=>{
    try {
        res.clearCookie("token", {
            httpOnly: true
        })

        res.json({
            success: true,
            message: "You Logged Out Successfully!",
            last_message: "Bye!"
        })
    } catch (error) {
        console.log(error.message)
        res.json({
            success: false,
            message: error.message
        })
    }
}

