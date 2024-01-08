import { Alert, Button, FileInput, Select, TextInput } from 'flowbite-react'
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import {useSelector} from'react-redux';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import {app} from '../firebase.js'
import { useEffect, useState } from 'react';
import { CircularProgressbar } from'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import {useNavigate, useParams} from'react-router-dom';
export default function UpdatePost() {
    const {currentUser} = useSelector(state => state.user);
    const [file, setFile] = useState(null);
    const [imageUploadProgress, setImageUploadProgress] = useState(null);
    const [imageUploadError, setImageUploadError] = useState(null);
    const [publishError , setPublishError] = useState(null);
    const [formData, setFormData] = useState([])
    const params = useParams();
    const postId = params.postId;
    console.log('post Id: ' + postId);
    
    const navigate = useNavigate();

    useEffect(() => {
        try {
            const fetchPost = async () => {
                //const postId = params.postId;
                const response = await fetch(`/api/post/getposts?postId=${postId}`);
                const data=await response.json();
                const post = data.posts[0];
                console.log(post.image);
                if(!response.ok || data.success === false) {
                    setPublishError(data.message);
                    return;
                }
                setPublishError(null);
                setFormData(data.posts[0]);
                console.log('formData: ' + formData.image);
            }
            fetchPost();
        } catch (error) {
            console.log(error);
        }
    },[postId]);

    const handleUploadImage = async() => {
        try {
            if (!file) {
                setImageUploadError('Please select an image');
                return;
            }
            setImageUploadError(null);
            const storage = getStorage(app);
            const fileName = new Date().getTime() + '-' + file.name;
            const storageRef = ref(storage, fileName);
            const uploadTask = uploadBytesResumable(storageRef, file);
            uploadTask.on(
                'state_changed', (snapshot) => {
                    const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
                    setImageUploadProgress(progress.toFixed(0));
            }, (error) => {
                setImageUploadError('Image upload failed');
                setImageUploadProgress(null);
                setFile(null);
            },
            ()=> {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    setImageUploadProgress(null);
                    setImageUploadError(null);
                    setFormData({...formData, image: downloadURL });
                })
            }
            )
        } catch (error) {
           setImageUploadError(error.message); 
           setImageUploadProgress(null);
        }
    }

    const handleSubmit= async (e) => {
        e.preventDefault();
        console.log(postId);
        console.log(currentUser._id);
        try {
            const res = await fetch(`/api/post/updatepost/${postId}/${currentUser._id}`, {
                method: 'PUt',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            const data = await res.json();
            if (!res.ok || data.success === false) {
                setPublishError(data.message);
                return;
            } else {
                setPublishError(null); 
                navigate(`/post/${data.slug}`);         
            }
        } catch (error) {
            setPublishError('Something went wrong');
        }
    }

  return (
    <div
        className='p-3 max-w-3xl mx-auto min-h-screen'
    >
        <h1
            className='text-center font-semibold text-3xl my-7'
        >
            Update post
        </h1>
        <form 
            className='flex flex-col gap-4'
            onSubmit={handleSubmit}
        >
            <div 
                className="flex flex-col gap-4 sm:flex-row justify-between"
            >
                <TextInput
                    type='text'
                    id='title'
                    required
                    placeholder='Title'
                    className='flex-1'
                    onChange={(e) => setFormData({...formData, title: e.target.value })}
                    value = {formData.title}
                />
                <Select
                    onChange={(e) => setFormData({...formData, category: e.target.value })}
                    value={formData.category}
                >
                    <option value='uncategorized'>Select  a category</option>
                    <option value='Nutrition and Healthy Eating'>Nutrition and Healthy Eating </option>
                    <option value='Fitness and Exercise'>Fitness and Exercise</option>
                    <option value='Mental Health and Mindfulness'>Mental Health and Mindfulness</option>
                    <option value='Lifestyle and Wellness Tips'>Lifestyle and Wellness Tips</option>
                </Select>
            </div>
            <div 
                className="flex gap-4 items-center justify-between border-2 border-teal-400 p-3 rounded-lg"
            >
                <FileInput
                    type='file'
                    accept='image/*'
                    onChange={(e)=>setFile(e.target.files[0])}
                    className='file'
                />
                <Button
                    type='button'
                    gradientDuoTone='purpleToBlue'
                    size='sm'
                    outline
                    onClick={handleUploadImage}
                    disabled={imageUploadProgress}
                >
                    {
                        imageUploadProgress? (
                            <div
                                className='w-16 h-16'
                            >
                                <CircularProgressbar
                                    value={imageUploadProgress || 0} 
                                    text={`${imageUploadProgress || 0}%`}
                                />
                            </div>
                        ):(
                            'Upload Image'
                        )
                    }
                </Button>
            </div>
            {imageUploadError && 
                <Alert color='failure' >
                    {imageUploadError} 
                </Alert>
            }
            {
                formData.image && (
                    <img 
                        src={formData.image} 
                        alt="upload image"
                        className="w-full h-72 object-cover"
                    />
                )
            }
            <ReactQuill 
                theme='snow'
                placeholder='Write your post here...'
                className='h-72 mb-12'
                required
                onChange={(value)=>setFormData({...formData, content: value })}
                value={formData.content}
            />
            <Button type='submit' gradientDuoTone='purpleToPink'>Update post</Button>
            {
                publishError && (
                    <Alert color='failure' className='mt-5' >
                        {publishError} 
                    </Alert>
                )
            }
        </form>
    </div>
  )
}
