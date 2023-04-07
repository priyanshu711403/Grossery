import userModel from "../models/userModel.js";
import { comparePassword, hashPassword } from '../helpers/authHelper.js';
import JWT  from "jsonwebtoken";
import router from '../routes/authRoutes.js';

export const registerController = async (req,res) => {
    try {
        const {name,email,password,phone,address,answer}=req.body;
        //validations
        if(!name)
            return res.send({message:'Name is required'});
        if(!email)
            return res.send({message:'Email is required'});
        if(!password)
            res.send({message:'Password is required'});
        if(!phone)
            res.send({message:'Phone no. is required'});
        if(!address)
            res.send({message:'Address is required'});
        if(!answer)
            res.send({message:'Answer is required'});
        //check user
        const existingUser= await userModel.findOne({email});
        //existing User
        if(existingUser){
            return res.status(200).send({
                success: false,
                message: 'Already Registered, Please Login'
            });
        }
        //Register user
        const hashedPassword =await hashPassword(password);
        //save
        const user = await new userModel({name,email,phone,address,password: hashedPassword,answer}).save();
        res.status(201).send({
            success:true,
            message:"Signed Up successfully",
            user
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            message:'Error in registration',
            error
        });
    }
};

export const loginController = async(req,res) => {
    try {
        const {email,password}=req.body;
        if(!email || !password){
            return res.status(404).send({success:false, message: 'Invalid email or password'});
        }
        //check user
        const user= await userModel.findOne({email});
        if(!user){
            return res.status(404).send({
                success:false,
                message:'Email not Registered'
            });
        }
        const match = await comparePassword(password,user.password);
        if(!match){
            res.status(200).send({
                success: false,
                message: 'Invalid Password'
            });
        }
        const token= await JWT.sign({_id: user._id},process.env.JWT_SECRET,{expiresIn:"7d"});
        res.status(200).send({
            success:true, 
            message:'Logged-in Succesfully',
            user:{name:user.name,email:user.email,phone:user.phone,address:user.address,
            role: user.role},
            token
        });    
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error in login',
            error
        });
    }
};

//forgotPasswordController
export const forgotPasswordController=async (req,res)=>{
    try {
        const {email,answer,newPassword}=req.body;
        if(!email){
            res.status(400).send({message:'Email is required'});
        }
        if(!answer){
            res.status(400).send({message:'Answer is required'});
        }
        if(!newPassword){
            res.status(400).send({message:'New Password is required'});
        }
        const user =await userModel.findOne({email,answer});
        //validation
        if(!user){
            return res.status(404).send({
                success:false,
                message:'Wrong email or answer'
            });
        }
        const hashed= await hashPassword(newPassword);
        await userModel.findByIdAndUpdate(user._id,{password:hashed});
        res.status(200).send({
            success:true,
            message: 'Password reset successfully'
        });
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            message: 'Something went wrong',
            error
        });
    }
};

//TEST controller
export const testController = async (req,res) => {
    res.send('Protected route')
};