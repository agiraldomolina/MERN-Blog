import { useEffect, useState } from "react"
import moment from 'moment'
import {FaThumbsUp} from'react-icons/fa'
import PropTypes from 'prop-types';
import { useSelector } from "react-redux";
import { Button, Textarea } from "flowbite-react";


export default function Comment({comment, onLike, onEdit, onDelete}) {
  //console.log('commetId: ' + commentId);
  const [user, setUser] = useState({})
  const [isEditing, setIsEditing] = useState(false)
  const [editedContent, setEditedContent] = useState(comment.content);
  const {currentUser} = useSelector(state => state.user)
  //console.log('comment from comment component: ' + JSON.stringify(comment))
  

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userResponse = await fetch(`/api/user/${comment.userId}`);
        const userData = await userResponse.json();
        if (userData) {
          setUser(userData);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchUser();
  }, [comment]);

  const handleEdit=()=>{
    setIsEditing(true);
    setEditedContent(comment.content);
  };

 // const handleDelete=()=>{}

  const handleSave=async()=>{
    try {
      const response = await fetch (`/api/comment/editComment/${comment._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          content: editedContent
        })
      })
      if (response.ok) {
        setIsEditing(false);
        onEdit(comment, editedContent);
      }
    } catch (error) {
      console.log(error.message);
    }
  }

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
          {isEditing ? (
            <>
              <Textarea
                className="mb-2"
                value={editedContent}
                onChange={(e)=>setEditedContent(e.target.value)}
              />
              <div className="flex  justify-end gap-2 text-xs">
                <Button
                  type="button"
                  size='sm'
                  gradientDuoTone='purpleToBlue'
                  onClick={handleSave}
                >
                  Save
                </Button>
                <Button
                  type="button"
                  size='sm'
                  outline
                  gradientDuoTone='purpleToBlue'
                  onClick={()=>setIsEditing(false)}
                >
                  Cancel
                </Button>
              </div>
            </>
            ) : (
              <>
                <p className="text-gray-500 pb-2">
                  {comment.content}
                </p>
                <div className="flex items-center pt-2 text-xs dark:border-x-gray-700 max-w-fit gap-2">
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
                {
                  // verify if the user is the owner of the comment or if is admin
                  currentUser &&
                  comment &&
                  (comment.userId === currentUser._id ||
                  currentUser.isAdmin)  && (
                    <>
                      <button 
                        type='button' 
                        onClick={handleEdit}
                        className="text-gray-400 hover:text-blue-500"
                      >
                        Edit
                      </button>
                      <button 
                        type='button' 
                        onClick={()=>onDelete(comment._id)}
                        className="text-gray-400 hover:text-red-500"
                      >
                        Delete
                      </button>
                    </>
                  )
                }
                </div>
              </>
            )
        }
          
      </div>
    </div>
  )
}

Comment.propTypes = {
  comment: PropTypes.shape({
    _id: PropTypes.string,
    userId: PropTypes.string,
    createdAt: PropTypes.string,
    content: PropTypes.string,
  }).isRequired,
  onLike: PropTypes.func,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
};
