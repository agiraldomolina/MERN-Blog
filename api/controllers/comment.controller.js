import Comment from '../models/Comment.model.js';
import { catchAsync } from '../utils/catchAsync.js'
import { errorHandler } from '../utils/error.js';

export const createComment = catchAsync(async (req, res, next) => {
    //console.log('hi from create comment');
    //console.log(req.body);
    const { content, postId, userId } = req.body;
    //console.log(postId);

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
});

export const getPostComments = catchAsync(async (req, res, next) => {
    // console.log('hi from get post comments');
    // console.log(req.params.postId);
    const postComments = await Comment.find({postId: req.params.postId}).sort({'createdAt': -1});
    //console.log(postComments);
    res
    .status(200)
    .json(postComments)
});

export const getPostComment = catchAsync(async (req, res, next) => {
    // console.log('hi from get post comment');
    // console.log(req.params);
    // console.log(req.params.postCommentId);
    const postComment = await Comment.findById(req.params.postCommentId);
    //console.log(postComment);
    res
    .status(200)
    .json(postComment)
})

export const likeComment = catchAsync(async (req, res, next) => {
    const comment = await Comment.findById(req.params.commentId);
    //console.log('comment from likeComment: ' + comment);
    if(!comment) return next(errorHandler(404, 'Comment not found'));

    const userIndex = comment.likes.indexOf(req.user._id);

    if(userIndex === -1) {
        comment.numberOfLikes += 1;
        comment.likes.push(req.user._id);
    }else{
        comment.likes.splice(userIndex, 1);
        comment.numberOfLikes -= 1;
    }

    await comment.save();
    res
    .status(200)
    .json(comment);
    //console.log(comment);
});

export const editComment = catchAsync(async (req, res, next) => {
    const comment = await Comment.findById(req.params.commentId);
    //console.log('comment from editComment:'+ comment);
    if(!comment) return next(errorHandler(404, 'Comment not found'));
    if(!req.user.isAdmin && comment.userId!== req.user._id) return next(errorHandler(401, 'You are not allowed to edit this comment'));

    const editedComment = await Comment.findByIdAndUpdate(req.params.commentId,
        {
            content: req.body.content
        },
        {new: true});

    res
  .status(200)
  .json(editedComment);
});

export const deleteComment = catchAsync(async (req, res, next) => {
    const comment = await Comment.findById(req.params.commentId);
    //console.log('comment from deleteComment:'+ comment);
    if(!comment) return next(errorHandler(404, 'Comment not found'));
    if(!req.user.isAdmin && comment.userId!== req.user._id) return next(errorHandler(401, 'You are not allowed to delete this comment'));
    await Comment.findByIdAndDelete(req.params.commentId);
    res
    .status(200)
    .json('Comment deleted successfully');
})