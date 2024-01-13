import { Footer } from 'flowbite-react'
import { Link } from 'react-router-dom'
import {BsFacebook, BsInstagram, BsTwitter, BsGithub, BsLinkedin} from'react-icons/bs'

export default function FooterComponent() {
  return (
    <Footer 
        container
        className='border border-t-2 border-teal-500 py-2'
    >
        <div className="w-full max-w-7xl mx-auto">
            <div className="grid w-full justify-between sm:flex md:grid-cols-1">
                <div className="flex align-items-center">
                    <Link 
                        to="/"
                        className='self-center whitespace-nowrap text-lg sm:text-xl font-semibold dark:text-white'>
                        <span
                            className='px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white'
                        >  
                            Alba's  
                        </span>
                        Blog
                    </Link>
                </div>
                <div 
                    className="grid grid-cols-2 gap-8  sm:gap-6"
                >
                    
                    <div className="div">
                        <Footer.Title title='Follow us'/>
                        <Footer.LinkGroup col className='mb-0'>
                            <Footer.Link
                                href='https://www.github.com/agiraldomolina'
                                target='_blank'
                                rel='noopener noreferrer'
                            >
                                GitHub
                            </Footer.Link>
                            <Footer.Link
                                href='https://linkedin.com/in/alba-giraldo-6086a046/'
                                target='_blank'
                                rel='noopener noreferrer'
                            >
                                Linkedin
                            </Footer.Link>
                        </Footer.LinkGroup>
                    </div>
                    <div className="div">
                        <Footer.Title title='Legal'/>
                        <Footer.LinkGroup col>
                            <Footer.Link
                                href='#'
                            >
                                Privacy Policy
                            </Footer.Link>
                            <Footer.Link
                                href='#'
                            >
                                Terms & Conditions
                            </Footer.Link>
                        </Footer.LinkGroup>
                    </div>
                </div>
            </div>
            <Footer.Divider />
            <div className="w-full sm:flex sm:items-center sm:justify-between">
                <Footer.Copyright 
                    href='#' 
                    by="Alba's blog" 
                    year={new Date().getFullYear()}
                />
                <div className="flex gap-6 sm:mt-0 mt-4 sm:justify-center">
                    <Footer.Icon href='https://www.facebook.com/alba.n.giraldo.1'icon={BsFacebook}  target='_blank'/>
                    <Footer.Icon href='https://www.instagram.com/albitagiraldo2019/'icon={BsInstagram} target='blank' />
                    <Footer.Icon href='https://www.github.com/agiraldomolina'icon={BsGithub} />
                    <Footer.Icon href='https://linkedin.com/in/alba-giraldo-6086a046/'icon={BsLinkedin} />
                </div>
            </div>
        </div>
    </Footer>
  )
}
