import User from "../models/user.model.js";
import { catchAsync } from "../utils/catchAsync.js"
import bcryptjs from 'bcryptjs';
import { errorHandler } from "../utils/error.js";


export const test = (req,res) => {
    res.json({message : "MERN api is working!"})
}

export const updateUser = catchAsync( async(req,res,next) => {
    // First check is req.user._id is equal to req.params.userId
    if(req.user._id !== req.params.userId) return next( errorHandler(403, 'You are not allow to update this user'));
    if (req.body.password){
        if(req.body.password.length < 6) return next( errorHandler(400, 'Password must be at least 6 characters'));
        req.body.password =  bcryptjs.hashSync(req.body.password, 10);
    }
    if (req.body.username){
        if(req.body.username.length < 7 || req.body.username.length > 20) return next( errorHandler(400, 'Username must be between 7 and 20 characters'));
        if(req.body.username.includes(' ')) return next( errorHandler(400, 'username can not contain spaces'));
        if(req.body.username !== req.body.username.toLowerCase()) return next( errorHandler(400, 'Username must be lowerCase'));
        if(!req.body.username.match(/^[a-zA-Z0-9]+$/)) return next( errorHandler(400,'Username can only contain letters and numbers'));       
    }
    const updatedUser = await User.findByIdAndUpdate(req.params.userId, {
        $set: {
            username: req.body.username,
            email: req.body.email,
            avatar: req.body.avatar,
            password: req.body.password
        },
    }, {new: true});
    const {password,...userWithoutPassword} = updatedUser._doc;
    res
    .status(200)
    .json(userWithoutPassword)
})