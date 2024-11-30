const User=require("../models/User");
const bcrypt=require("bcrypt");
const jwt=require("jsonwebtoken");

require("dotenv").config();

const registerUser =async(req,res)=>{

    try {
        
        const{name,username,email,password,userType}=req.body;

        const userExist= await User.find({username});
        if(userExist){
            return res.status(400).json({
                message:"User already exist",
            })
        }

        const userEmail=await User.find({email});
        if(userEmail){
            return res.status(400).json({
                message:"User already exist",
            })
        }

        const hashedPassword=await bcrypt.hash(password,10);

        const newUser=User({
            name:name,
            email:email,
            password:hashedPassword,
            username:username,
            userType:userType
        });
        const savedUser=await newUser.save();

        res.status(201).json({
            message:"User created successfully",
            savedUser
        });



    } catch (error) {
        res.status(400).json({
            error:error.message,
            message:"Server error"
        });
    }
}



//login 
const loginUser=async(req,res)=>{

    const{username,password}=req.body;

    try {
        const user= await User.findOne({username});
        if(!user){
            res.status(400).json({
                message:"Invalid Credentials"
            });
        }

        const isMatched=bcrypt.compare(password,user.password);
        if(!isMatched){
            res.status(400).json({
                message:"Invalid password"
            });
        }

        const token=jwt.sign({userId:user._id,username:user.username},process.env.SECRET_KEY,{expiresIn:"1hr"});

        res.status(200).json*({
            message:"token genrated successful",
            token:token
        })


    } catch (error) {
        res.status(400).json({
            error:error.message,
            message:"Something wenr wrong Server error"
        }); 
    }
}



const getuser=async(req,res)=>{
    try {
        const user=await User.findOne({username:req.params.username}); 
        if(!user){
            res.status(400).json({
                message:"User not found"
            });
        }

        res.status(200).json*({user })
    } catch (error) {
        res.status(400).json({
            error:error.message,
            message:"Something while fectching user data"
        });  
    }
}


module.exports={registerUser,loginUser,getuser};