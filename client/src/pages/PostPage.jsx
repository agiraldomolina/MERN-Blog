import {Button, Spinner} from 'flowbite-react'
import { useState } from 'react';
import { useEffect } from 'react';
import {Link, useParams} from 'react-router-dom'

export default function PostPage() {
    const {postSlug} = useParams();useState
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [post, setPost] = useState(null);
    //console.log(postSlug);

    useEffect(() => {
        const fetchPost = async () => {
            try {
               setLoading(true); 
               const response = await fetch(`/api/post//getposts?slug=${postSlug}`);
               const data = await response.json();
               if (!response.ok){
                 setError(true);
                 setLoading(false);
                 return;
               }else{
                 setPost(data.posts[0]);
                 setLoading(false);
                 setError(false);
               }
            } catch (error) {
                setError(true);
                setLoading(false);
            }
        }
        fetchPost();
    }, [postSlug]);

    if (loading) return (
        <div className='flex justify-center items-center'>
            <Spinner size='xl'/>
        </div>
    )
  return (
    <main
        className='p-3 flex flex-col justify-center max-w-6xl max-auto min-h-screen mx-auto  sm:mx-auto md:mx-auto'
    >
        <h1 
            className='text-3xl mt-10 p-3 text-center font-serif max-w-2xl mx-auto lg:text-4xl'
        >
            {post && post.title}
        </h1>
        <Link 
            to={`/search?category=${post && post.category}`}
            className='self-center mt-5'
        >
            <Button color='gray' pill size='xs'>
                {post && post.category}
            </Button>
        </Link>
        <img 
            src={post && post.image}
            className='mt-10 p-3 max-h-[600px] w-full object-cover'
        />
        <div className='flex justify-between p-3 border-b border-slate-500 mx-auto w-full max-w-2xl text-xs'>
            <span>{post && new Date(post.createdAt).toLocaleDateString()}</span>
            <span className='italic'>{post && (post.content.length /1000).toFixed(0)} mins read</span>
        </div>
        <div className='p-3 max-w-2xl mx-auto w-full post-content' dangerouslySetInnerHTML={{__html: post && post.content}}>

        </div>
    </main>
  )
}
