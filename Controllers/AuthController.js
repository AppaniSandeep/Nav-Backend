const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken");

const UserModel = require("../Models/user");

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
        console.log(e)
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
        console.log(e)
        res.status(500).json({message:"Internal Server Errror",success:false})
    }
}

const home = async (req, res) => {
    try {
        const userData = await UserModel.find()
        if (userData.length === 0) {
            return res.status(404).json({message:"No Users Found", success:false})
        }
        res.status(200).json({message:"Users Retrieved Successful", data:userData, success:true})
    }catch (e) {
        res.status(500).json({message: "Internal Server Error", success:false})
    }
}


module.exports = {
    signup,
    login,
    home
}
