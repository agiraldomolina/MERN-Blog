import Post from "../models/post.model.js";
import { catchAsync } from "../utils/catchAsync.js";
import { errorHandler } from "../utils/error.js";

export const create = catchAsync(async (req, res, next) => {
    console.log(req.user._id);
    if (!req.user.isAdmin) return next(errorHandler(403, 'You are not authorized to perform this action'));
    if (!req.body.title || !req.body.content) return next(errorHandler(400, 'Please provide a title and content'));
    const slug = req.body.title.split(' ').join('-').toLowerCase().replace(/[^a-zA-Z0-9-]/g, '-');  
    const newPost = new Post({
        ...req.body,slug, userId: req.user._id
    });
    const savedPost = await newPost.save();
    res
    .status(201)
    .json(savedPost);
})