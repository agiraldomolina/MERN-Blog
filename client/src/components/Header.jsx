import { Avatar, Button, Dropdown, Navbar, TextInput } from 'flowbite-react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { AiOutlineSearch} from'react-icons/ai'
import { FaMoon, FaSun } from 'react-icons/fa'
import {useSelector, useDispatch} from'react-redux'
import { changeTheme } from '../redux/theme/themeSlice';
import { signOutStart, signOutSuccess, signOutFailure } from '../redux/user/userSlice'
import { useEffect, useState } from 'react'

export default function Header() {
    const [searchTerm, setSearchTerm] = useState('');
    const { currentUser } = useSelector((state) => state.user);
    const {theme} = useSelector((state) => state.theme);
    const dispatch = useDispatch();
    const navigate= useNavigate();
    const path = useLocation().pathname;
    //console.log('Look for: ' + searchTerm);

    const handleSignOut = async () => {
        try {
          dispatch(signOutStart());
          const response = await fetch(`/api/user/signout`, {
            method: 'POST',
          });
          const data = await response.json();
          !response.ok? dispatch(signOutFailure(data.message)) : dispatch(signOutSuccess())
        } catch (error) {
          dispatch(signOutFailure(error.message));
        }
      };

      const handleSubmit =(event)=>{
        event.preventDefault();
        const urlParams = new URLSearchParams(location.search);
        urlParams.set('searchTerm', searchTerm);
        const searchQuery = urlParams.toString();
        navigate(`/search?${searchQuery}`);
      }

      useEffect(()=>{
        const urlParams= new URLSearchParams(location.search);
        const searchTermFromUrl = urlParams.get('searchTerm');
        if(searchTermFromUrl){
          setSearchTerm(searchTermFromUrl);
        }
      },[location.search])
      
  return (
    <>
    <Navbar className='border-b-2'>
        <Link to="/"
            className='self-center whitespace-nowrap text-sm sm:text-xl font-semibold dark:text-white'>
            <span
                className='px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white'
            >  Alba's  </span>
            Blog
        </Link>
        <form  onSubmit={handleSubmit}>
            <Link to='/search'>
                <TextInput
                    type='text'
                    placeholder='Search...'
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    rightIcon={AiOutlineSearch}
                    className='hidden lg:inline'
                ></TextInput>

            </Link>
        </form>
        <Link to='/search'>
            <Button 
                className='w-12 h-10 lg:hidden' 
                color='gray' 
                pill
            >
                <AiOutlineSearch />
            </Button>
        </Link>
        <div className="flex gap-2 md:order-2">
            <Button  
                className='w-12 h-10 hidden sm:inline' 
                color='gray' 
                pill 
                onClick={()=>dispatch(changeTheme())}
            >
                {
                    theme === 'dark'? <FaSun /> : <FaMoon />
                }
            </Button>
            {
                currentUser? (
                    <Dropdown
                        arrowIcon={false}
                        inline
                        label=  {
                            <Avatar
                            alt='user'
                            img={currentUser.avatar}
                            rounded
                            />
                        }
                    >
                        <Dropdown.Header>
                            <span className='block text-sm'>@{currentUser.username}</span>
                            <span className='block text-sm font-medium truncate'>{currentUser.email}</span>
                        </Dropdown.Header>
                           <Link to={'/dashboard?tab=profile'}>
                                <Dropdown.Item>Profile</Dropdown.Item>
                           </Link>
                           <Dropdown.Divider/>
                           <Dropdown.Item onClick={handleSignOut}>Sign Out</Dropdown.Item>

                    </Dropdown>

                ):
                (
                    <Link to='/sign-in'>
                        <Button gradientDuoTone='purpleToBlue' outline>
                            Sign In
                        </Button>
                    </Link>
                )
            }
            <Navbar.Toggle />
        </div>
        <Navbar.Collapse>
            <Navbar.Link active={path ==="/"} as={'div'}>
                <Link to='/'>
                    Home
                </Link>
            </Navbar.Link>
            <Navbar.Link active={path ==="/about"} as={'div'}>
                <Link to='/about'>
                    About
                </Link>
            </Navbar.Link>
            <Navbar.Link active={path ==="/projects"} as={'div'} >
                <Link to='/projects'>
                    Projects
                </Link>
            </Navbar.Link>
        </Navbar.Collapse>
    </Navbar>    
    </>
  )
}
