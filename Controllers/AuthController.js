const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken");
const UserModel = require("../Models/user");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD
    }
})

const signup = async (req,res) => {
    try{
        const {username,email,password} = req.body;
        const user = await UserModel.findOne({email})
        if (user){
            return res.status(400).send("User Already Exist")
        }
        const userModel= new UserModel({username,email,password});
        userModel.password = await bcrypt.hash(password,10);
        await userModel.save();
        res.status(201).json({message:"Signup successfull",success:true})
    }catch(e){
        res.status(500).json({message:"Internal Server Error",success:false})
    }
}


const login = async (req,res) => {
    try{
        const {username,password} = req.body;
        const user = await UserModel.findOne({username})
        const errorMsg = "Authorization failed username or password wrong";

        if (!user){
            return res.status(400).json({message:errorMsg,success:false})
        }
        const isPasswordMathced = await bcrypt.compare(password,user.password);
        if (!isPasswordMathced){
            return res.status(400).json({message:errorMsg,success:false})
        }
        const jwtToken =  jwt.sign({username:user.username,_id:user._id},process.env.JWT_SECRET,{expiresIn:"24h"})

        res.status(200).json({message:"Login successfully",jwtToken,username:user.username,success:true})

    }catch(e){
        res.status(500).json({message:"Internal Server Errror",success:false})
    }
}

const home = async (req, res) => {
    try {
        const userData = await UserModel.find();
        if (userData.length === 0) {
            return res.status(404).json({message: "No users found", success:false})
        }
        res.status(200).json({message: "Users retrieved successfully", data: userData, success:true})

    }catch(e){
        res.status(500).json({message: "Internal Server Error", success:false})
    }
}

const deleteUser = async (req, res) => {
    try {
        const {id} = req.params;
        const user = await UserModel.findByIdAndDelete(id);
        if (!user){
            return res.status(404).json({message: "User not found", success:false})
        }
        res.status(200).json({message: "User deleted successfully", success:true})
    }catch(e){
        res.status(500).json({message: "Internal Server Error", success:false})
    }
}


const forgetPassword = async (req, res) => {
    const {email} = req.body;

    try {
        const user = await UserModel.findOne({email});
        if (!user){
            return res.status(404).json({message:"User does not exist", success:false})
        }
        const resetToken = jwt.sign({username:user.username,_id:user._id}, process.env.JWT_SECRET,{expiresIn:"10m"})
        const expiry = Date.now() + 10 * 60 * 1000;

        user.resetToken = resetToken;
        user.resetTokenExpiry = expiry;
        await user.save();

        const resetLink = `https://nav-client.vercel.app/reset-password/${resetToken}`;

        await transporter.sendMail({
            from: process.env.EMAIL,
            to: user.email,
            subject: "Password Reset Request",
            html:`
            <h3>Password Reset</h3>
            <p>Click the below link:</p>
            <a href="${resetLink}">${resetLink}</a>
            `
        })

        res.status(200).json({message:"The Reset Token sent successfully",resetToken,username:user.username,success:true})
    }catch(e){
        res.status(500).json({message:"Internal Server Error", success:false})
    }
}

const getResetPasswordPage = async (req, res) => {
    const {resetToken} = req.params;

    const user = await UserModel.findOne({resetToken, resetTokenExpiry: {$gt: Date.now()}});

    if (!user) {
        return res.status(400).json({message:"Invalid or expired token"});
    }

    res.status(200).json({message:"Valid token", username:user.username, success:true}) 
}

const resetPassword = async (req, res) => {
    const {resetToken} = req.params;
    const {newPassword} = req.body;

    try{
        const user = await UserModel.findOne({resetToken, resetTokenExpiry:{$gt: Date.now()}});
        if (!user){
            return res.status(404).json({message:"Invalid user or expired token", success:false})
        }
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedNewPassword;
        user.resetToken = null;
        user.resetTokenExpiry = null;
        await user.save();
        res.status(200).json({message:"The Password Reset Successfully", success:true});
    }catch(e){
        res.status(500).json({message:"Internal Server Error", success:false})
    }
}

module.exports = {
    signup,
    login,
    home,
    deleteUser,
    forgetPassword,
    getResetPasswordPage,
    resetPassword
}