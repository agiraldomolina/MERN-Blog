import { Alert, Button, Label, Spinner, TextInput } from 'flowbite-react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'


export default function SignUp() {
  const navigate = useNavigate();
  const [ errorMessage, setErrorMessage ] = useState(null);
  const [ loading, setLoading ] = useState(false);
  const [ formData, setFormData ] = useState({})
  const handleChange = (event) => {
    // Ths code allow to read new value from the input and keep the values of the others inputs
    setFormData({...formData, [event.target.id]: event.target.value.trim() })
  }
  console.log(formData)
  const handleSubmit = async(event) => {
    event.preventDefault();
    if (!formData.username ||!formData.email ||!formData.password) {
      return setErrorMessage('Please fill out all the fields');
    }
    try {
      setLoading(true);
      setErrorMessage(null);
      // we need to create a proxy which is specfyed in the vite.config.js file n order this fetch is called
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        setLoading(false);
        return setErrorMessage('Invalid information');
      }  
      setLoading(false);
      if (res.ok) navigate('/sign-in');       
    } catch (error) {
      setErrorMessage(error.message);
      setLoading(false);
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
          This a demo project. You can sign up with your email and password <br />or with Google
        </p>

        </div>
      {/* right side */}
        <div className="flex-1">
          <form 
            className='flex flex-col gap-4'
            onSubmit={handleSubmit}>
            <div>
              <Label value='Your Username' />
              <TextInput
                type='text'
                placeholder='Username'
                id='username'
                onChange={handleChange}
              />
            </div>
            <div>
              <Label value='Your Email' />
              <TextInput
                type='text'
                placeholder='Email'
                id='email'
                onChange={handleChange}
              />
            </div>
            <div>
              <Label value='Your username' />
              <TextInput
                type='password'
                placeholder='Password'
                id='password'
                onChange={handleChange}
              />
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
                  'Sign Up'
                )
              }
            </Button>
          </form>
          <div className='flex gap-2 text-sm mt-5'>
            <span>Have an account?</span>
            <Link to='/sig-in' className='text-blue-500'>
              Sign In
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
