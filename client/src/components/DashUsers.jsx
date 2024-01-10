import { Button, Modal, Table } from "flowbite-react";
import { useEffect, useState } from "react"
import {useSelector} from 'react-redux'
import { Link } from "react-router-dom";
import {HiOutlineCheckCircle, HiOutlineExclamationCircle, HiOutlineXCircle} from "react-icons/hi";


export default function DashUsers() {
  const {currentUser} = useSelector(state => state.user);
  const [users, setUsers] = useState([]);
  const [showmore, setShowmore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [userIdToDelete, setUserIdToDelete] = useState('');
  console.log(users);
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        //console.log('admin from client: ' + currentUser.isAdmin);
        const response = await fetch(`/api/user/getusers`);
        const data = await response.json();
        if (response.ok) {
          setUsers(data.users);
          if (data.users.length < 9) setShowmore(false);          
       }
        return data;
      } catch (error) {
        setUsers([]);
      }
    }
    if(currentUser.isAdmin) fetchUsers();
  },[currentUser._id]);

  const handleShowMore = async () => {
    const startIndex = users.length;
    console.log(startIndex);
    try {
      const response= await fetch (
        `/api/user/getusers?startIndex=${startIndex}`);
      const data = await response.json();
      if (response.ok) {
        setUsers((prev)=>[...prev, ...data.users]);
        if (data.users.length < 9) setShowmore(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteUser = async () => {
    setShowModal(false);
    try {
      const response = await fetch(`/api/user/delete/${userIdToDelete}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      if(!response.ok || data.success === false) {
        console.log(data.message);
        return;
      }else{
        setUsers((prev)=>
        prev.filter((user)=>user._id!== userIdToDelete)
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
      {currentUser.isAdmin && users.length > 0 ? ( 
        <>
        <Table
          hoverable className="shadow-md"
        >
          <Table.Head>
           <Table.HeadCell>Date created</Table.HeadCell>
           <Table.HeadCell>User Image</Table.HeadCell>
           <Table.HeadCell>Username</Table.HeadCell>
           <Table.HeadCell>Email</Table.HeadCell>
           <Table.HeadCell>Admin</Table.HeadCell>
           <Table.HeadCell>Delete</Table.HeadCell>
          </Table.Head>
          {users.map((user, index)=>(
            <Table.Body key={index} className="divide-y">
              <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                <Table.Cell>
                  {new Date(user.createdAt).toLocaleDateString()}
                </Table.Cell>
                <Table.Cell>
                    <img 
                        src={user.avatar} 
                        alt='user avatar' 
                        className="h-20 w-20 object-cover bg-gray-500 rounded-full"
                    />                 
                </Table.Cell>
                <Table.Cell>
                  {user.username}
                </Table.Cell>
                <Table.Cell>
                  {user.email}
                </Table.Cell>
                <Table.Cell>
                  {
                    user.isAdmin? (
                        <HiOutlineCheckCircle color="green" size='1.5rem'/>
                    ) : (
                        <HiOutlineXCircle size='1.5rem' className="text-red-500"/>
                    )
                  }
                </Table.Cell>
                <Table.Cell>
                  <span 
                    className="font-medium text-red-500 hover:underline cursor-pointer"
                    onClick={()=>{
                      setShowModal(true);
                      setUserIdToDelete(user._id);
                      console.log(user._id);
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
        <p>There are no users yet</p>
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
              Are you sure you want to delete this user?
            </h3>
            <div className='flex justify-center gap-4'>
              <Button color='failure' onClick={handleDeleteUser}>
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
