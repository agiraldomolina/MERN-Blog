import { Alert, Button, Modal, TextInput } from 'flowbite-react'
import {Link} from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import {useSelector} from 'react-redux'
import { getDownloadURL, getStorage, ref, uploadBytesResumable} from 'firebase/storage'
import {app} from '../firebase'
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import {
  updateStart,
  updateSuccess,
  updateFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
  signOutStart,
  signOutSuccess,
  signOutFailure
} from '../redux/user/userSlice'
import {useDispatch} from'react-redux'
import { HiOutlineCheckCircle, HiOutlineExclamationCircle, HiXCircle } from "react-icons/hi";

export default function DashProfile() {
  const {currentUser, error, loading} = useSelector((state) => state.user)
  const [imageFile, setImageFile] = useState(null)
  const [imageFileUrl, setImageFileUrl] = useState(null)
  const filePickerRef = useRef()
  const [imageFileUploadingProgress, setImageFileUploadingProgress] = useState(null)
  const [imageFileUploadError, setImageFileUploadError] = useState(null)
  const [imageFileUploading, setImageFileUploading] = useState(false);
  const [updateUserSuccess, setUpdateUserSuccess] = useState(null)
  const [updateUserError, setUpdateUserError] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState({})
  const dispatch = useDispatch()
  //console.log(imageFileUploadingProgress, imageFileUploadError)
  const handleImageChange = (event) => {
    const file = event.target.files[0]
    setImageFile(event.target.files[0])
    if(file) {
      setImageFileUrl(file)
      // setImageFileUrl exists only in the browser, so we can use it
      setImageFileUrl(URL.createObjectURL(file))
    }
  };
  
  useEffect(() => {
    if(imageFile){
      uploadImage()
    }
  },[imageFile]);
  
  const uploadImage = async () => {
    setImageFileUploading(true)
    setImageFileUploadError(null)
    const storage = getStorage(app)
    const fileName =new Date().getTime() + imageFile.name
    const storageRef = ref(storage, fileName)
    const uploadTask = uploadBytesResumable(storageRef, imageFile)
    uploadTask.on(
      'state_changed', (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImageFileUploadingProgress(progress.toFixed(0))
      },
      ()=>{
        setImageFileUploadError('Could not upload image, file must be smaller than 2MB')
        setImageFileUploadingProgress(null)
        setImageFile(null)
        setImageFileUrl(null)
        setImageFileUploading(false)
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downLoadURL) => {
          setImageFileUrl(downLoadURL);
          setFormData({...formData, profilePicture: downLoadURL });
          setImageFileUploading(false)
          setUpdateUserError(null)
        })
      }
    )
  };

const handleChange = (event) => {
  setFormData({...formData, [event.target.id]: event.target.value });
}

const handleSubmit = async(event) => {
  event.preventDefault()
  setUpdateUserError(null)
  setUpdateUserSuccess(null)
  // check is inputs are filled
  if(Object.keys(formData).length === 0){
    setUpdateUserError('No changes to save')
    return
  }
  //console.log(formData)
  if (imageFileUploading){
    setUpdateUserError('Please wait for image to be uploaded')
    return
  }
  try {
    dispatch(updateStart());
    console.log('current user from dashboard profile: ' +  currentUser._id)
    const response = await fetch(`/api/user/update/${currentUser._id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    });
    const data = await response.json();
    if (!response.ok){
      dispatch(updateFailure(data.message));
      setUpdateUserError(data.message);
    }else{
      dispatch(updateSuccess(data));
      setUpdateUserSuccess("User's profile updated successfully");
      //setUpdateUserError(null);
    }
  } catch (error) {
    dispatch(updateFailure(error.message));
    setUpdateUserError(error.message);
  }
}

const handleDeleteAccount = async () => {
  setShowModal(false);
  console.log('current user from dashboard profile: ' +  currentUser._id)
  try {
    dispatch(deleteUserStart());
    const response = await fetch(`/api/user/delete/${currentUser._id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const data = await response.json();
    if (!response.ok){
      dispatch(deleteUserFailure(data.message));

    }else{
      dispatch(deleteUserSuccess(data));
    }
  } catch (error) {
    dispatch(deleteUserFailure(error.message));
  }
};

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
}

  return (
    <div className='max-w-lg mx-auto p-3 w-full'>
      <h1 
        className='my-7 text-center font-semibold text-3xl'
      >
        Profile
      </h1>
      <form 
        className='flex flex-col gap-4'
        onSubmit={handleSubmit}
      >
        <input 
          type="file"
          accept='image/*'
          onChange={handleImageChange}
          className="file"
          ref={filePickerRef}
          hidden />
        <div 
          className="relative w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full"
          onClick={()=>filePickerRef.current.click()}
        >
          {imageFileUploadingProgress && (
            <CircularProgressbar 
              value={imageFileUploadingProgress || 0} 
              text={`${imageFileUploadingProgress}%`} 
              strokeWidth={5}
              styles={{
                root:{
                  width: '100%',
                  height: '100%',
                  position:'absolute',
                  top: 0,
                  left: 0,
                },
                path:{
                  stroke: `rgba(62,152,199,${imageFileUploadingProgress/100})`,
                }
              }} 
              /> 
          )}
          <img 
            src={imageFileUrl || currentUser.avatar} 
            alt="user image"
            className={`rounded-full w-full h-full object-cover border-8 border-[lightgray] ${
              imageFileUploadingProgress &&
              imageFileUploadingProgress < 100 &&
              'opacity-60'
            }`} />
       </div>
       {imageFileUploadError && <Alert color='failure' >{imageFileUploadError} </Alert>}
      <TextInput
        type='text'
        id='username'
        placeholder='username'
        defaultValue={currentUser.username}
        onChange={handleChange}
      />
      <TextInput
        type='email'
        id='email'
        placeholder='email'
        defaultValue={currentUser.email}
        onChange={handleChange}
      />
      <TextInput
        type='password'
        id='password'
        placeholder='password'
        onChange={handleChange}
      />
      <Button 
        type='submit'
        gradientDuoTone='purpleToBlue'
        outline
        disabled={loading || imageFileUploading}
        >
           {loading? 'Loading...': 'Update'}
        </Button>
      {
        currentUser.isAdmin  && (
          <Link to={'/create-post'}>
            <Button 
              type='button'
              gradientDuoTone='purpleToPink'
              className='w-full'
            >
              Create a post
            </Button>         
          </Link>
        )
      }
      </form>
      <div className="text-red-500 flex justify-between mt-5">
        <span 
          className='cursor-pointer'
          onClick={()=>setShowModal(true)}
          >
          Delete account
        </span>
        <span 
          className='cursor-pointer'
          onClick={handleSignOut}
        >
          Sign Out
        </span>
      </div>
        {updateUserSuccess && (
          <Alert 
            color='success'
            icon={HiOutlineCheckCircle} 
            className='mt-5'
          >
            {updateUserSuccess} 
          </Alert>)}
          {updateUserError && (
            <Alert 
              color='failure'
              icon={HiXCircle}
              className='mt-5'
            >
              {updateUserError}
            </Alert>
          )}
          {error && (
            <Alert 
              color='failure'
              icon={HiXCircle}
              className='mt-5'
            >
              {error}
            </Alert>
          )}
          <Modal 
            show={showModal}
            onClose={()=>setShowModal(false)}
            popup
            size='md'
          >
            <Modal.Header/> 
              <Modal.Body>
                <div className="text-center">
                  <HiOutlineExclamationCircle 
                    className='h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto'
                  />
                  <h1
                    className='text-lg text-gray-500 dark:text-gray-300 mb-2'
                  >
                    Are you sure you want to delete your account?
                  </h1>
                </div>
              </Modal.Body>
              <div className=" flex mx-auto gap-5 mb-6">
                <Button 
                  gradientDuoTone='purpleToBlue'
                  outline
                  onClick={()=>setShowModal(false)}
                >
                  No, cancel
                </Button>
                <Button 
                  gradientDuoTone='purpleToBlue'
                  outline
                  onClick={handleDeleteAccount}
                >
                  Yes, I'm sure
                </Button>
              </div>
          </Modal>

    </div>
  )
}
