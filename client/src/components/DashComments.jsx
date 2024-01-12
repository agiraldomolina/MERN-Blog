import { Button, Modal, Table } from "flowbite-react";
import { useEffect, useState } from "react"
import {useSelector} from 'react-redux'
import { Link } from "react-router-dom";
import {HiOutlineCheckCircle, HiOutlineExclamationCircle, HiOutlineXCircle} from "react-icons/hi";


export default function DashComments() {
  const {currentUser} = useSelector(state => state.user);
  const [comments, setComments] = useState([]);
  const [showmore, setShowmore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [commentIdToDelete, setCommentIdToDelete] = useState('');
  console.log(comments);
  useEffect(() => {
    const fetchComments = async () => {
      try {
        //console.log('admin from client: ' + currentUser.isAdmin);
        const response = await fetch(`/api/comment/getComments`);
        const data = await response.json();
        if (response.ok) {
          setComments(data.comments);
          if (data.comments.length < 9) setShowmore(false);          
       }
        return data;
      } catch (error) {
        setComments([]);
      }
    }
    if(currentUser.isAdmin) fetchComments();
  },[currentUser._id]);

  const handleShowMore = async () => {
    const startIndex = comments.length;
    console.log(startIndex);
    try {
      const response= await fetch (
        `/api/comment/getPostComments?startIndex=${startIndex}`);
      const data = await response.json();
      if (response.ok) {
        setComments((prev)=>[...prev, ...data.comments]);
        if (data.comments.length < 9) setShowmore(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteComment = async () => {
    setShowModal(false);
    try {
      const response = await fetch(`/api/comment/deleteComment/${commentIdToDelete}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      if(!response.ok || data.success === false) {
        console.log(data.message);
        return;
      }else{
        setComments((prev)=>
        prev.filter((comment)=>comment._id!== commentIdToDelete)
        )   
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div
      className="table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500"
    >
      {currentUser.isAdmin && comments.length > 0 ? ( 
        <>
        <Table
          hoverable className="shadow-md"
        >
          <Table.Head>
           <Table.HeadCell>Date updated</Table.HeadCell>
           <Table.HeadCell>Comment content</Table.HeadCell>
           <Table.HeadCell>Number of likes</Table.HeadCell>
           <Table.HeadCell>PostId</Table.HeadCell>
           <Table.HeadCell>UserId</Table.HeadCell>
           <Table.HeadCell>Delete</Table.HeadCell>
          </Table.Head>
          {comments.map((comment, index)=>(
            <Table.Body key={index} className="divide-y">
              <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                <Table.Cell>
                  {new Date(comment.updatedAt).toLocaleDateString()}
                </Table.Cell>
                <Table.Cell>
                  {comment.content}
                </Table.Cell>
                <Table.Cell>
                  {comment.numberOfLikes}
                </Table.Cell>
                <Table.Cell>
                  {comment.postId}
                </Table.Cell>
                <Table.Cell>
                  {comment.userId}
                </Table.Cell>
                <Table.Cell>
                  <span 
                    className="font-medium text-red-500 hover:underline cursor-pointer"
                    onClick={()=>{
                      setShowModal(true);
                      setCommentIdToDelete(comment._id);
                      //console.log(comment._id);
                    }}
                  >
                    Delete
                  </span>
                </Table.Cell>
              </Table.Row>
            </Table.Body>
          ))}
        </Table>
        {
          showmore && (
            <button 
            onClick={handleShowMore}  
            className="w-full text-teal-400 font-semibold self-center text-sm py-7"
            >
              Show more
            </button>
          )
        }
        </>
      ):(
        <p>There are no comments yet</p>
      )}

      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        popup
        size='md'
      >
        <Modal.Header />
        <Modal.Body>
          <div className='text-center'>
            <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto' />
            <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>
              Are you sure you want to delete this comment?
            </h3>
            <div className='flex justify-center gap-4'>
              <Button color='failure' onClick={handleDeleteComment}>
                Yes, I'm sure
              </Button>
              <Button color='gray' onClick={() => setShowModal(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
