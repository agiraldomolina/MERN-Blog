import { Alert, Button,  Textarea } from 'flowbite-react';
import { useEffect, useState } from 'react';
import {useSelector} from 'react-redux'
import { Link, useNavigate } from 'react-router-dom';
import Comment from './Comment';

export default function CommentSection({postId}) {
    const {currentUser} = useSelector(state => state.user);
    const [comment, setComment] = useState('');
    const [postComments, setPostComments] = useState([]);
    const [commentError, setCommentError] = useState(null);
    const navigate = useNavigate();
    //console.log('postComments starting code:' + JSON.stringify(postComments));

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (comment.length > 200) return;
        try {
            const response = await fetch('/api/comment/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    content: comment,
                    postId,
                    userId: currentUser._id
                })
            })
            const data = await response.json();
            if(response.ok){
                setComment('');
                setCommentError(null);
                setPostComments([data, ...postComments]);
            }
            
        } catch (error) {
            setCommentError(error.message);
        }
    };

    const fetchPostComments = async () => {
        //console.log(postId);
        try {
            const response = await fetch(`/api/comment/getPostComments/${postId}`);
            if (response.ok) {
                const data = await response.json();
                setPostComments(data);
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {   
        // setPostComments(postComments.map(comment => 
        //     comment._id === commentId
        //       ? { ...comment, likes: data.likes, numberOfLikes: data.likes.length }
        //       : comment
        //   ));   
        fetchPostComments();
    }, [postId]);

    const handleLike = async (commentId) => {
        try {
            if (!currentUser) {
                navigate('/sign-in');
                return
            }
            const response = await fetch(`/api/comment/likeComment/${commentId}`, {
                method: 'PUT',
                })
                if (response.ok) {
                    const data = await response.json();
                    //console.log(data);
                    setPostComments((prevComments) =>
                        prevComments.map((comment) =>
                            comment._id === commentId
                            ? { ...comment, likes: data.likes, numberOfLikes: data.likes.length }
                            : comment
                        )
                    );

                    // console.log('postComments from if inside handleKike: ' + JSON.stringify(postComments));
                    //fetchPostComments();
                    // console.log('postComment from handleLike: ' + JSON.stringify(postComments));
                  }
              
        } catch (error) {
            console.log(error.message);
        }
    }

  return (
    <div className='p-3 max-w-2xl mx-auto w-full'>
        {currentUser? 
        (
            <div className='flex items-center gap-1 my-5 text-gray-500 text-s'>
                <p>Signed in as</p>
                <img className='h-10 w-210 object-cover rounded-full' src={currentUser.avatar} alt="profile image" />
                <Link to={'/dashboard?tab=profile'} className='text-xs text-cyan-600 hover:underline'>
                    @{currentUser.username}
                </Link>
            </div>
        ):(
            <div className='text-sm text-teal-500 my-5 flex gap-1'>
                You must be Signed in to comment. 
                <Link className='text-blue-500 hover:underline' to='/sign-in'>
                    Sign in
                </Link>
                
            </div>
        )}
        {currentUser && (
            <form 
                className='border border-teal-500 rounded-md p-3'
                onSubmit={handleSubmit}
            >
                <Textarea
                    placeholder='Add a comment...'
                    rows='3'
                    maxLength='200'
                    onChange={(event)=> setComment(event.target.value)}
                    value={comment}
                />
                <div className='flex justify-between items-center mt-5'>
                    <p 
                        className='text-gray-500 text-xs'
                    >
                        {200 - comment.length} characters remaining
                    </p>
                    <Button
                        outline
                        gradientDuoTone='purpleToBlue'
                        type='submit'
                    >
                        Submit
                    </Button>
                </div>
                {commentError && (
                    <Alert color='failure' className='mt-5'>
                        {commentError}
                    </Alert>

                )}
            </form>
        )}
        {
            postComments.length === 0 ?(
                <p className='text-sm my-5'>No comments yet!</p>
            ):(
                <>
                <div className='text-sm my-5 flex items-center gap-1'>
                    <p>Comments</p>
                    <div className='border border-y-gray-400 py-1 px-2 rounded-lg'>
                        <p>{postComments.length}</p>
                    </div>
                </div>
                 {/* loop througth all comments and display them */}
                {
                    postComments.map((comment, index) => (
                        //console.log('postComment from throuble part:', comment);
                        //console.log('comment id from throuble part:', comment._id);
                        <Comment 
                            key={index} 
                            comment={comment} 
                            onLike={handleLike}
                            
                        />
                    ))
                }
                </>
            )
        }
    </div>
  );
}