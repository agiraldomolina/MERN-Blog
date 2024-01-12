import { Link } from 'react-router-dom'
import PageLogo from '../assets/PageLogo.png'

export default function CallToAction() {
  return (
    <div id='first' className='flex flex-col justify-center items-center md:flex-row  p-5 border border-teal-500  rounded-tl-3xl rounded-br-3xl text-center gap-4 md:justify-between'>
        <div className='flex-1 justify-center flex flex-col'>
            <h2 className='text-2xl'>Embark on a Journey to Wellness!</h2>
            <p className='text-gray-500 my-2 dark:text-gray-300'>If you're passionate about embracing a healthier lifestyle, discovering well-being tips, and nourishing your mind, body, and soul, then you're in the right place.</p>

        </div>
        <div id='second' className='flex-1'>
            <div className='p-7 flex justify-center'>
                <Link to="/"
                    className='self-center whitespace-nowrap text-sm sm:text-xl font-semibold dark:text-white'>
                    <span
                        className='px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white'
                    >  Alba's  </span>
                    Blog
                </Link>
                <img className='h-50 w-40' src={PageLogo} alt="blog image" />
            </div>

        </div>
    </div>
  )
}
