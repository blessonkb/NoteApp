const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const register = async (requestAnimationFrame,res)=>{
    const{name,email,password}=req.body;
    try {
        let user=await User.findOne({email});
        if(user){
            return res.status(400).json({message:"User already exists"});
        }
        user= new User({
            name,
            email,
            password
        });
        const salt=await bcrypt.genSalt(10);
        const hash=await bcrypt.hash(password,salt);
        user.password=hash;
        await User.save();
       return res.status(201).json({message:"User registered successfully"});

    } catch (error) {
        return res.status(500).json({message:"Internal server error"});

    }
};

const login= async (req,res)=>{
    const {email,password}=req.body;
    try {
        let user=await User.findOne({email});
        if(!user){
            return res.status(401).json({message:"invalid email or password"})
        }
        const isMatch=await bcrypt.compare(password,user.password);
        if (!isMatch){
            return res.status(401).json({message:"invalid password"})
        }
        const payload={
            userId:User._id,
            email:User.email
        }
        const token= jwt.sign(payload, process.env.JET_SECRET,{expiresIn:'1d'})
        res.json({token});
    } catch (error) { 
        res.status(500).json({message:"Internal server error"})
    }
};
module.exports={register,login};
