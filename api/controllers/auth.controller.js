import User from "../models/user.model.js";
import bcryptjs from 'bcryptjs'
import { errorHandler } from "../utils/error.js";
import { catchAsync } from "../utils/catchAsync.js";

export const signup = catchAsync(async (req, res, next) => {
    const {username,email,password} = req.body;
    if(!username ||!email ||!password || username === "" || email === '' || password === "") return next(errorHandler(400, "All fields are required"));

    const hashedPassword = bcryptjs.hashSync(password, 10)

    const newUser = new User({
        username,
        email,
        password : hashedPassword
    });

    await newUser.save();
    res.json({message:'User created successfully'});
});