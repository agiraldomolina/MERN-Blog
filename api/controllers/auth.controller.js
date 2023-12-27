import User from "../models/user.model.js";
import bcryptjs from 'bcryptjs'
import { errorHandler } from "../utils/error.js";
import { catchAsync } from "../utils/catchAsync.js";
import jwt  from "jsonwebtoken";

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

export const signin = catchAsync(async (req, res, next) => {
    // read from body
    const {email,password} = req.body;
    if(!email ||!password || email === '' || password === '') return next(errorHandler(400, "All fields are required"));

    //find user by email
    const user = await User.findOne({email});

    //chech if user is found anf if the password is correct
    if(!user || !await user.correctPassword(password, user.password)) return next(errorHandler(400, "Invalid email or password"));

    // create a token
    const token = jwt.sign({_id: user._id}, process.env.JWT_SECRET);

    // destructuring the user object
    const {password:pass, ...userWithoutPassword} = user._doc

    // send the token back to the client
    res
    .status(200)
    .cookie(
        'access_token', token,
        {httpOnly: true}
        )
    .json(userWithoutPassword)
})