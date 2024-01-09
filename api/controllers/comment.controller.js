import Comment from '../models/Comment.model.js';
import { catchAsync } from '../utils/catchAsync.js'
import { errorHandler } from '../utils/error.js';

export const createComment = catchAsync(async (req, res, next) => {
    console.log('hi from create comment');
    console.log(req.body);
    const { content, postId, userId } = req.body;
    console.log(postId);

    if(userId !== req.user._id) return next( errorHandler(401, 'You are not allowed to create comment'));

    const newComment = new Comment({
        content,
        postId,
        userId
    });
    await newComment.save();

    res
    .status(200)
    .json(newComment)
})