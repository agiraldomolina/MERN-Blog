import Post from "../models/post.model.js";
import { catchAsync } from "../utils/catchAsync.js";
import { errorHandler } from "../utils/error.js";

export const create = catchAsync(async (req, res, next) => {
    //console.log(req.user._id);
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
});

export const deletePost = catchAsync(async (req, res, next) => {
    if (req.params.userId!== req.user._id || !req.user.isAdmin) return next(errorHandler(403, 'You are not authorized to perform this action'));
    await Post.findByIdAndDelete(req.params.postId);
    res
    .status(200)
    .json('The post has been deleted')
});

export const updatePost = catchAsync(async (req, res, next) => {
    if (req.params.userId!== req.user._id ||!req.user.isAdmin) return next(errorHandler(403, 'You are not authorized to perform this action'));
    //console.log(req.body);
    const updatedPost = await Post.findByIdAndUpdate(
        req.params.postId, 
        {
            $set: {
                title: req.body.title,
                content: req.body.content,
                category: req.body.category,
                image: req.body.image,
            },         
        }, { new: true });
    res
   .status(200)
   .json(updatedPost);   
})

export const getPosts = catchAsync(async (req, res, next) => {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.order === 'asc'? 1 : -1;
    const posts = await Post.find({
        ...(req.query.userId && { userId: req.query.userId }),
        ...(req.query.category && { category: req.query.category }),
        ...(req.query.slug && { slug: req.query.slug }),
        ...(req.query.postId && { _id: req.query.postId }),
        ...(req.query.searchTerm && {
            $or:[
                { title: { $regex: req.query.searchTerm, $options: 'i' } },
                { content: { $regex: req.query.searchTerm, $options: 'i' } }
                ],
            }),      
         })
         .sort({ updatedAt: sortDirection })
         .skip(startIndex)
         .limit(limit)
         
    const totalPosts = await Post.countDocuments();

    const now = new Date();

    const oneMonthAgo = new Date(
        now.getFullYear(),
        now.getMonth() - 1,
        now.getDate()
    )

    const lastmonthPosts = await Post.countDocuments({
        createdAt: {
            $gte: oneMonthAgo
        }
    });

    res.status(200).json({
        posts,
        totalPosts,
        lastmonthPosts
    });
});

