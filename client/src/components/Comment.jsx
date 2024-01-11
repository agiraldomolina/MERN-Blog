import { useEffect, useState } from "react"
import moment from 'moment'
import {FaThumbsUp} from'react-icons/fa'
import PropTypes from 'prop-types';
import { useSelector } from "react-redux";


export default function Comment({commentId, onLike, fetchPostComments}) {
  console.log('commetId: ' + commentId);
  const [user, setUser] = useState({})
  const [comment, setComment] = useState({})
  const {currentUser} = useSelector(state => state.user)
  console.log('comment from comment component: ' + JSON.stringify(comment))
  

  useEffect(() => {
    const fetchData = async () => {
      console.log('commentId from useEffect: ' + commentId);
      try {
        console.log('commentId from try: ' + commentId);
        // Obtener datos del comentario
        const commentResponse = await fetch(`/api/comment/getPostComment/${commentId}`,{
          method: 'GET',  
        });
        const commentData = await commentResponse.json();
        console.log('commentData from useEffect: ' + JSON.stringify(commentData));
        if (commentData) {
          setComment(commentData);
         //console.log(commentData);
          

          // Obtener datos del usuario
          const userResponse = await fetch(`/api/user/${commentData.userId}`);
          const userData = await userResponse.json();
          if (userData) {
            setUser(userData);
          }
          fetchPostComments()
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [commentId]);


  // const handleLike = () => {
  //   // Verificar que comment sea una entidad válida antes de acceder a sus propiedades
  //   if (comment && comment.createdAt) {
  //     onLike(comment._id);
  //   }
  // };

  return (
    <div className="flex p-4 border-b dark:border-gray-500 text-xs">
      <div className="flex-shrink-0 mr-3">
        <img className="w-10 h-10 rounded-full bg-gray-200" src={user.avatar} alt={user.username} />
      </div>
      <div className="flex-1">
        <div className="flex items-center mb-1">
          <span className="font-bold mr-1 text-xs truncate">
            {user ? `@${user.username}`: "anonymous user"}
            </span>
            <span className="text-gray-500 text-xs">
              {moment(comment.createdAt).fromNow()}
            </span>
          </div>
          <p className="text-gray-500 mb-2">
            {comment.content}
          </p>
          <div className="flex items-center pt-2 text-xs border-t dark:border-x-gray-700 max-w-fit gap-2">
            <button 
              type='button'  
              onClick={()=>onLike(comment._id)}
              className={`text-gray-400 hover:text-blue-500 ${
                currentUser &&
                comment &&
                comment.likes && // Verificar si comment.likes existe
                comment.likes.includes(currentUser._id) &&
                '!text-blue-500'
              }`}
            >
              <FaThumbsUp className="text-sm " />
            </button>
            <p className="text-gray-400">
              {
                comment.numberOfLikes > 0 &&  comment.numberOfLikes + " "+(comment.numberOfLikes === 1? "like" : "likes")
              }
            </p>
          </div>
      </div>
    </div>
  )
}

Comment.propTypes = {
  commentId: PropTypes.shape({
    _id: PropTypes.string,
    userId: PropTypes.string,
    createdAt: PropTypes.string,
    content: PropTypes.string,
  }).isRequired,
  onLike: PropTypes.func,
};
