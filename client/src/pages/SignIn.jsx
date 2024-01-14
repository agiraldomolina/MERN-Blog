
import { Alert, Button, Label, Spinner, TextInput } from 'flowbite-react'
import { useState } from 'react'
import { useDispatch, useSelector} from'react-redux'
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from '../redux/user/userSlice'
import { Link, useNavigate } from 'react-router-dom'
import { FaEye, FaEyeSlash } from'react-icons/fa'
import {HiMail} from'react-icons/hi'
import OAuth from '../components/OAuth'

export default function SignIn() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const{loading, error:errorMessage} = useSelector(state => state.user)
  
  const [ formData, setFormData ] = useState({});
  const [ showPassword, setShowPassword ] = useState(true);

  const handleChange = (event) => {
    // Ths code allow to read new value from the input and keep the values of the others inputs
    setFormData({...formData, [event.target.id]: event.target.value.trim() })
  }
  console.log(formData)
  console.log(formData)

  const handleSubmit = async(event) => {
    event.preventDefault();
    if (!formData.email ||!formData.password) {
      return dispatch(signInFailure('Please fill out all the fields'));
    }
    try {
      dispatch(signInStart());
      // we need to create a proxy which is specfyed in the vite.config.js file n order this fetch is called
      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
        
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(signInFailure(data.message));
      }  
      
      if (res.ok) {
        dispatch(signInSuccess(data));  // data is the user object craeted thanks the payload
        navigate('/')
      }       
    } catch (error) {
      dispatch(signInFailure(error.message));
    }
  }
  return (
    <div className='min-h-screen mt-20 gap-5'> 
      <div className="flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center">
      {/* left side */}
        <div className="flex-1">
        <Link to="/"
            className='font-bold dark:text-white text-4xl'>
            <span
                className='px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white'
            >  Alba's  </span>
            Blog
        </Link>
        <p className='text-sm mt-5'>
          This a demo project. You can sign in with your email and password <br />or with Google
        </p>

        </div>
      {/* right side */}
        <div className="flex-1">
          <form 
            className='flex flex-col gap-4'
            onSubmit={handleSubmit}>
            <div className='mb-2 block'>
              <Label value='Your Email' />
              <TextInput
                type='email'
                rightIcon={HiMail}
                placeholder='name@company.com'
                id='email'
                onChange={handleChange}
              />
            </div>
            <div>
              <Label value='Your password' />
              <div onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? (
                <TextInput
                  type="text"
                  placeholder=""
                  id="password"
                  rightIcon={FaEye}
                  onChange={handleChange}
                />
              ) : (
                <TextInput
                  type="password"
                  placeholder=""
                  id="password"
                  rightIcon={FaEyeSlash}
                  onChange={handleChange}
                />
              )}
            </div>
            </div>
            <Button 
              gradientDuoTone='purpleToPink' 
              type='submit'
              disabled={loading}
            >
              {
                loading? (
                  <>
                    <Spinner size='sm'/>
                    <span className='pl-3'>Loading...</span>
                  </>
                ) : (
                  'Sign In'
                )
              }
            </Button>
            <OAuth/>
          </form>
          <div className='flex gap-2 text-sm mt-5'>
            <span>Dont have an account?</span>
            <Link to='/sign-up' className='text-blue-500'>
              Sign Up
            </Link>
          </div>
          {
            errorMessage && (
              <Alert className='mt-5' color='failure'>
                {errorMessage}
              </Alert>
            )
          }
        </div>
      </div>
    </div>
  )
}


