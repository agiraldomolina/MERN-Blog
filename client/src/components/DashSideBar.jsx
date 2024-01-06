import { Sidebar } from 'flowbite-react'
import { useEffect, useState } from 'react';
import { HiArrowSmRight, HiDocumentText, HiUser } from 'react-icons/hi'
import { Link, useLocation } from 'react-router-dom';
import { useDispatch } from'react-redux';
import { useSelector } from 'react-redux';
import { signOutStart, signOutSuccess, signOutFailure } from '../redux/user/userSlice'


export default function DashSideBar() {
  const {currentUser} = useSelector(state => state.user);
    const location = useLocation();
    const dispatch = useDispatch();
  const [tab, setTab] = useState('');
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromURL = urlParams.get('tab');
    if (tabFromURL) {
      setTab(tabFromURL);
    }
  }, [location.search]);

  const handleSignOut = async () => {
    try {
      dispatch(signOutStart());
      const response = await fetch(`/api/user/signout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      !response.ok? dispatch(signOutFailure(data.message)) : dispatch(signOutSuccess())
    } catch (error) {
      dispatch(signOutFailure(error.message));
    }
  };
  
  return (
    <Sidebar className='w-full md:w-56'>
        <Sidebar.Items>
            <Sidebar.ItemGroup className='flex flex-col gap-1'>
                <Link to="/dashboard?tab=profile">
                    <Sidebar.Item 
                        active={tab === 'profile'}
                        icon={HiUser}
                        label={currentUser.isAdmin? 'Admin': 'User'}
                        labelColor='dark'
                        as='div'
                    >
                        Profile
                    </Sidebar.Item>
                </Link>
                {
                  currentUser.isAdmin && (
                    <Link to="/dashboard?tab=posts">
                        <Sidebar.Item 
                            active={tab === 'posts'}
                            icon={HiDocumentText}
                            as='div'
                        >
                            Posts
                        </Sidebar.Item>
                    </Link>
                  )
                }
                <Sidebar.Item 
                    icon={HiArrowSmRight}
                    className="cursor-pointer"
                    onClick = {handleSignOut}
                >
                    Sign Out
                </Sidebar.Item>
            </Sidebar.ItemGroup>
        </Sidebar.Items>
    </Sidebar>
  )
}
