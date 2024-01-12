import { Button, Table, TableHead } from "flowbite-react";
import { useEffect, useState } from "react";
import { HiArrowNarrowUp, HiDocumentText, HiOutlineAnnotation, HiOutlineArrowNarrowUp, HiOutlineUserCircle, HiOutlineUserGroup } from "react-icons/hi";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

export default function DashboardComp() {
    const [users, setUsers] = useState([]);
    const [comments, setComments] = useState([]);
    const [posts, setPosts] = useState([]);
    const [totalUsers, setTotalUsers] = useState(0);
    const [totalPosts, setTotalPosts] = useState(0);
    const [totalComments, setTotalComments] = useState(0);
    const [totalusersLastMonth, setTotalUsersLastMonth] = useState(0);
    const [totalpostsLastMonth, setTotalPostsLastMonth] = useState(0);
    const [totalcommentsLastMonth, setTotalCommentsLastMonth] = useState(0);
    const {currentUser} = useSelector(state => state.user);

    useEffect(()=>{
        const fetchUsers = async () => {
            try {
                const response = await fetch('/api/user/getusers?limit=5');
                const data=await response.json();
                if(response.ok){
                    setUsers(data.users);
                    setTotalUsers(data.totalUsers);
                    setTotalUsersLastMonth(data.lastMonthsUsers);
                }
            } catch (error) {
                console.log(error.message);
            }
        };
        const fetchComments = async () => {
            try {
                const response = await fetch('/api/comment/getcomments?limit=5');
                const data=await response.json();
                if(response.ok){
                    setComments(data.comments);
                    setTotalComments(data.totalComments);
                    setTotalCommentsLastMonth(data.lastMonthComments);
                }
            } catch (error) {
                console.log(error.message);
            }
        };

        const fetchPosts = async () => {
            try {
                const response = await fetch('/api/post/getposts?limit=5');
                const data=await response.json();
                if(response.ok){
                    setPosts(data.posts);
                    setTotalPosts(data.totalPosts);
                    setTotalPostsLastMonth(data.lastmonthPosts);
                }
            } catch (error) {
                console.log(error.message);
            }
        }
        if (currentUser.isAdmin) {
            fetchUsers();
            fetchComments();
            fetchPosts();
        }
    },[currentUser])

  return (
    <div className="p-3 md:mx-auto ">
        <div className="flex-wrap flex gap-4 justify-center">
            <div className="flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-72 w-full rounded-md shadow-md dark:shadow-slate-100 ">
                <div className="flex justify-between ">
                    <div >
                        <h3 className="text-gray-500 text-md uppercase">Total Users</h3>
                        <p className="text-2xl">{totalUsers}</p>
                    </div>
                        <HiOutlineUserGroup className="bg-teal-600 text-white rounded-full text-5xl p-3 shadow-lg"/>
                </div>
                    <div className="flex gap-2 text-sm">
                        <span className="text-green-500 flex items-center">
                            {totalusersLastMonth > 0 && <HiArrowNarrowUp/>} 
                            {totalusersLastMonth}
                        </span>
                        <div className="text-gray-500">last month</div>
                    </div>
            </div>
            <div className="flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-72 w-full rounded-md shadow-md dark:shadow-slate-100 ">
                <div className="flex justify-between ">
                    <div >
                        <h3 className="text-gray-500 text-md uppercase">Total Comments</h3>
                        <p className="text-2xl">{totalComments}</p>
                    </div>
                        <HiOutlineAnnotation className="bg-indigo-600 text-white rounded-full text-5xl p-3 shadow-lg"/>
                </div>
                    <div className="flex gap-2 text-sm">
                        <span className="text-green-500 flex items-center">
                            {totalcommentsLastMonth > 0 && <HiArrowNarrowUp/>} 
                            {totalcommentsLastMonth}
                        </span>
                        <div className="text-gray-500">last month</div>
                    </div>
            </div>
            <div className="flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-72 w-full rounded-md shadow-md dark:shadow-slate-100 ">
                <div className="flex justify-between ">
                    <div >
                        <h3 className="text-gray-500 text-md uppercase">Total Posts</h3>
                        <p className="text-2xl">{totalPosts}</p>
                    </div>
                        <HiDocumentText className="bg-lime-600 text-white rounded-full text-5xl p-3 shadow-lg"/>
                </div>
                    <div className="flex gap-2 text-sm">
                        <span className="text-green-500 flex items-center">
                            {totalpostsLastMonth > 0 && <HiArrowNarrowUp/>} 
                            {totalpostsLastMonth}
                        </span>
                        <div className="text-gray-500">last month</div>
                    </div>
            </div>
        </div>
        {/* div for tables */}
        <div className="flex flex-wrap gap-4 py-3 mx-auto justify-center">
            <div className="flex flex-col w-full md:w-auto shadow-md p-2 rounded-md dark:bg-gray-800 dark:shadow-slate-100">
                <div className="flex justify-between p-3 text-sm font-semibold">
                    <h1 className="text-center p-2">Recent Users</h1>
                    <Button outline gradientDuoTone='purpleToPink'>
                        <Link to="/dashboard?tab=users">See all</Link>
                    </Button>
                </div>
                <Table hoverable>
                    <Table.Head>
                        <Table.HeadCell>User Image</Table.HeadCell>
                        <Table.HeadCell className="flex w-auto items-center justify-center">Username</Table.HeadCell>
                    </Table.Head>
                    {users && users.map((user, index) => (
                        <Table.Body key={index} className="divide-y">
                            <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                <Table.Cell>
                                    <img src={user.avatar} className="w-10 h-10 rounded-full bg-gray-500" alt="User Image" />
                                </Table.Cell>
                                <Table.Cell className="text-center">
                                    {user.username}
                                </Table.Cell>
                            </Table.Row>
                        </Table.Body>
                    ))}
                </Table>
            </div>
            <div className="flex flex-col w-full md:w-auto shadow-md p-2 rounded-md dark:bg-gray-800 dark:shadow-slate-100">
                <div className="flex justify-between p-3 text-sm font-semibold">
                    <h1 className="text-center p-2">Recent Cooments</h1>
                    <Button outline gradientDuoTone='purpleToPink'>
                        <Link to="/dashboard?tab=comments">See all</Link>
                    </Button>
                </div>
                <Table hoverable>
                    <Table.Head>
                        <Table.HeadCell>Comment content</Table.HeadCell>
                        <Table.HeadCell className="flex w-auto items-center justify-center">
                            <p>Likes</p>
                        </Table.HeadCell>
                    </Table.Head>
                    {comments && comments.map((comment, index) => (
                        <Table.Body key={index} className="divide-y">
                            <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                <Table.Cell className="w-80">
                                    <p className="line-clamp-2">{comment.content}</p>
                                </Table.Cell>
                                <Table.Cell className="text-center">
                                    {comment.numberOfLikes}
                                </Table.Cell>
                            </Table.Row>
                        </Table.Body>
                    ))}
                </Table>
            </div>
            <div className="flex flex-col w-full md:w-auto shadow-md p-2 rounded-md dark:bg-gray-800 dark:shadow-slate-100">
                <div className="flex justify-between p-3 text-sm font-semibold">
                    <h1 className="text-center p-2">Recent Posts</h1>
                    <Button outline gradientDuoTone='purpleToPink'>
                        <Link to="/dashboard?tab=posts">See all</Link>
                    </Button>
                </div>
                <Table hoverable>
                    <Table.Head>
                        <Table.HeadCell>Post image</Table.HeadCell>
                        <Table.HeadCell>Title</Table.HeadCell>
                        <Table.HeadCell>Category</Table.HeadCell>
                    </Table.Head>
                    {posts && posts.map((post, index) => (
                        <Table.Body key={index} className="divide-y">
                            <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                <Table.Cell>
                                    <img src={post.image} className="w-14 h-10 rounded-md bg-gray-500" alt="post Image" />
                                </Table.Cell>
                                <Table.Cell className="w-80">
                                    <p className="line-clamp-2">{post.title}</p>
                                </Table.Cell>
                                <Table.Cell className="w-15">
                                    {post.category}
                                </Table.Cell>
                            </Table.Row>
                        </Table.Body>
                    ))}
                </Table>
            </div>
        </div>
    </div>
  )
}
