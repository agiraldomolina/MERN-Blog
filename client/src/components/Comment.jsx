import { useEffect, useState } from "react"
import moment from 'moment'


export default function Comment({comment}) {
  console.log('comment from comment component: ' + comment)
  const [user, setUser] = useState({})
  // console.log(user)
  // console.log(user.avatar)

  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await fetch(`/api/user/${comment.userId}`)
        const data=await response.json()
        if (data) {
          setUser(data)
        }
      } catch (error) {
        console.log(error)
      }
    }
    getUser()
  }, [comment])

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
      </div>
    </div>
  )
}
