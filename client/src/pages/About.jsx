import React from 'react'
import CallToAction from '../components/CallToAction'

export default function About() {
  return (
    <div className='min-h-screen flex items-center justify-center'>
      <div className='max-w-2xl mx-auto p-3 text-center'>
        <div className='flex flex-col gap-5'>
          <h1 className='font-semibold text-3xl md:text-6xl text-center my-7'>About Alba's Blog</h1>
          <div className='text-md text-gray-500'>
            <p>Alba's blog is created to share tips and useful information about a healthy and balanced lifestyle.<br/> I hope you find the information on my blog enjoyable and helpful.</p>
          </div>
          <div>
            <CallToAction />
          </div>
        </div>
      </div>
    </div>
  )
}
