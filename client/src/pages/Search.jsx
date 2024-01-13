import { Button, Select, TextInput } from 'flowbite-react'
import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import PostCard from '../components/PostCard';
export default function Search() {
    const [sideBarData, setSideBarData] = useState({
        searchTerm: '',
        sort: 'desc',
        category: 'uncategorized',
    });

    console.log(sideBarData);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showMore, setShowMore] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const searchTermFromUrl = urlParams.get('searchTerm');
        const sortFromUrl = urlParams.get('sort');
        const categoryFromUrl = urlParams.get('category');
        //console.log('category from useEffect' + categoryFromUrl);
    
        setSideBarData({
            ...sideBarData,
            searchTerm: searchTermFromUrl,
            sort: sortFromUrl,
            category: categoryFromUrl,
        });
    
        const fetchPosts = async () => {
            setLoading(true);
            setShowMore(false);
            const searchQuery = urlParams.toString();
            const response = await fetch(`/api/post/getposts?${searchQuery}`);
    
            if (!response.ok) {
                setLoading(false);
                return;
            }
    
            if (response.ok) {
                const data = await response.json();
                setPosts(data.posts);
                setLoading(false);
                data.posts.length === 9 ? setShowMore(true) : setShowMore(false);
            }
        };
    
        fetchPosts();
    }, [location.search]);
    

    const handleChange =(event)=>{
        if(event.target.id ==='searchTerm'){
            setSideBarData({
             ...sideBarData,
                searchTerm: event.target.value,
            })
        }
        if(event.target.id ==='sort'){
            const order =event.target.value || 'desc';
            setSideBarData({...sideBarData,sort: order,
            })
        }

        if(event.target.id === 'category'){
            const category =event.target.value || 'uncategorized';
            setSideBarData({...sideBarData, category})
        }
    }

    const handleSubmit =(event)=>{
        event.preventDefault();
        const urlParams = new URLSearchParams();
        urlParams.set('searchTerm', sideBarData.searchTerm);
        urlParams.set('sort', sideBarData.sort);
        urlParams.set('category', sideBarData.category);
        const searchQuery=urlParams.toString();
        console.log('searchQuery from handleSubmit:' + searchQuery);
        navigate(`/search?${searchQuery}`);
    }

    const handleShowMore = async () => {
        const startIndex = posts.length;
        const urlParams = new URLSearchParams();
        urlParams.set('startIndex', startIndex);
        const searchQuery=urlParams.toString();
        const response = await fetch(`/api/post/getposts?${searchQuery}`);
        if (!response.ok) return
        if (response.ok) {
            const data = await response.json();
            setPosts([...posts,...data.posts]);
            data.posts.length === 9? setShowMore(true) : setShowMore(false);
        }
    }

  return (
    <div className='flex flex-col md:flex-row'>
        <div className='p-7 border-b md:border-r md:min-h-screen border-gray-500'>
            <form className='flex flex-col gap-8' onSubmit={handleSubmit}>
                {/* div for search term */}
                <div className='flex items-center gap-2'>
                    <label className='whitespace-nowrap font-semibold'> Search term:</label>
                    <TextInput
                        placeholder='Search...'
                        id='searchTerm'
                        type='text'
                        value={sideBarData.searchTerm}
                        onChange={handleChange}
                    />
                </div>
                {/* di for sort select */}
                <div className='flex items-center gap-2'>
                    <label className='font-semibold'> Category: </label>
                    <Select
                        onChange={handleChange}
                        value={sideBarData.category}
                        id='category'
                    >
                        <option value='uncategorized'>Uncategorized</option>
                        <option value='Nutrition and Healthy Eating'>Nutrition and Healthy Eating </option>
                        <option value='Fitness and Exercise'>Fitness and Exercise</option>
                        <option value='Mental Health and Mindfulness'>Mental Health and Mindfulness</option>
                        <option value='Lifestyle and Wellness Tips'>Lifestyle and Wellness Tips</option>
                    </Select>
                </div>
                <div className='flex items-center gap-2'>
                    <label className='font-semibold'> Sort: </label>
                    <Select
                        onChange={handleChange}
                        Value={sideBarData.sort}
                        id='sort'
                    >
                        <option value='asc'>Oldest</option>
                        <option value='desc'>Latest</option>
                    </Select>
                </div>
                <Button
                    type='submit'
                    outline
                    gradientDuoTone='purpleToPink'
                    className='w-full'
                >
                    Apply Filters
                </Button>
            </form>
        </div>
        {/* div for displaying posts */}
        <div className='w-full'>
            <h1 
                className='text-3xl font-semibold sm:border-b border-gray-500 p-3 mt-5'
            >
                Posts Results
            </h1>
            <div className='p-7  flex flex-wrap gap-4 justify-center'>
                {
                    !loading && posts.length === 0 && 
                    <p
                        className='text-xl text-gray-500'
                    >
                        No posts found.
                    </p>
                }
                {
                    loading && (
                        <p>Loading...</p>
                    )
                }
                {
                    !loading && 
                    posts.length > 0 &&
                    posts.map((post,index)=>
                    <PostCard
                        key={index}
                        post={post}
                    />) 
                }
                {
                    showMore && 
                        <button 
                            className='text-teal-500 text-lg hover:underline p-7 w-full'
                            onClick={handleShowMore}
                        >
                            Show More
                        </button>
                }
            </div>
        </div>
    </div>
  )
}
