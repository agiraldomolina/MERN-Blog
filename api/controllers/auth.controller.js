import User from "../models/user.model.js";
import bcryptjs from 'bcryptjs'

export const signup =async(req,res)=>{
    try {
        const {username,email,password} = req.body;
        if(!username ||!email ||!password || username === "" || email === '' || password === "") return res.json({message:'All fields are required'});

        const hashedPassword = bcryptjs.hashSync(password, 10)
    
        const newUser = new User({
            username,
            email,
            password : hashedPassword
        });
    
        await newUser.save();
        res.json({message:'User created successfully'});        
    } catch (error) {
        res.status(500).json({message:error.message});
    }
    // destructuring info from body
}