import {Link} from 'react-router-dom'
import CallToAction from '../components/CallToAction'
import { useEffect, useState } from 'react';
import PostCard from '../components/PostCard';

export default function Home() {
  const [posts, setPosts] = useState([]);
    
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch('/api/post/getposts');
        const data = await res.json();
        if (!res.ok || data.success === false) {
          throw new Error(data.message);
        }
        setPosts(data.posts);
      } catch (error) {
        console.error(error);
      }
    }
    fetchPosts();
  }, []);


  return (
    <div>
      {/* div for the top section */}
      <div className='flex flex-col gap-6 pt-28 px-5 pb-5 max-w-6xl mx-auto'>
        <h1 className=' text-gray-600 text-3xl font-bold  lg:text-6xl dark:text-gray-400'
        >
            Welcome to our <span className='text-teal-600'>lifestyle blog!</span>
        </h1>
        <p
          className=' text-gray-500 text-sm sm:text-lg dark:text-gray-400'
        >
          We're thrilled to have you join us in this space where we share inspiring and practical articles focusing on holistic well-being, healthy living, and mindfulness. We believe in the importance of cultivating a balanced life that nurtures your mind, body, and spirit.<br/><br/>

          In each post, we'll guide you on a journey toward wellness, offering science-backed information, personal stories, and practical tips that you can easily incorporate into your daily routine.<br/><br/>

          Thank you for being a part of our community! We hope you find inspiration, motivation, and practical tools to build a path towards a healthier and more balanced lifestyle.

          Let's embark on this wellness journey together!
        </p>
        <Link 
          to='/search'
          className='text-xs sm:text-sm text-teal-500 font-bold hover:underline'>
          View all posts
        </Link>
      </div>
      {/* div for the action component section */}
      <div className='p-3 bg-slate-200 dark:bg-slate-800 rounded-lg'>
        <CallToAction/>
      </div>
      {/* div for posts cards */}
      <div className='max-w-6xl mx-auto p-3 flex flex-col gap-8 px-7'>
        {
          posts && posts.length > 0 && (
            <>
            <div className='flex flex-col gap-7'>
              <h2 className='text-2xl font-semibold text-center'>Recent Post</h2>
            </div>
            <div className='flex-wrap flex gap-2 justify-center'>
              {posts.map((post) => (
                <PostCard post={post} key={post.id} />
              ))}
            </div>
            <Link to={'/search'} className='text-lg text-teal-500 hover:underline text-center' >
                View all posts
            </Link>
            </>
          )
        }

      </div>
    </div>
  )
}
