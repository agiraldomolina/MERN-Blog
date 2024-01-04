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
    const token = jwt.sign({_id: user._id, isAdmin: user.isAdmin}, process.env.JWT_SECRET);

    // destructuring the user object
    const {password:pass, ...userWithoutPassword} = user._doc
    console.log('userWithoutPassword:'+ JSON.stringify(userWithoutPassword));

    // send the token back to the client
    res
    .status(200)
    .cookie(
        'access_token', token,
        {httpOnly: true}
        )
    .json(userWithoutPassword)
});


export const google = async (req, res, next) => {
    const { email, name, googlePhotoUrl } = req.body;
    try {
      const user = await User.findOne({ email });
      if (user) {
        const token = jwt.sign(
          { id: user._id, isAdmin: user.isAdmin },
          process.env.JWT_SECRET
        );
        const { password, ...rest } = user._doc;
        res
          .status(200)
          .cookie('access_token', token, {
            httpOnly: true,
          })
          .json(rest);
      } else {
        const generatedPassword =
          Math.random().toString(36).slice(-8) +
          Math.random().toString(36).slice(-8);
        const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
        const newUser = new User({
          username:
            name.toLowerCase().split(' ').join('') +
            Math.random().toString(9).slice(-4),
          email,
          password: hashedPassword,
          avatar: googlePhotoUrl,
        });
        await newUser.save();
        const token = jwt.sign(
          { id: newUser._id, isAdmin: newUser.isAdmin },
          process.env.JWT_SECRET
        );
        const { password, ...rest } = newUser._doc;
        res
          .status(200)
          .cookie('access_token', token, {
            httpOnly: true,
          })
          .json(rest);
      }
    } catch (error) {
      next(error);
    }
  };