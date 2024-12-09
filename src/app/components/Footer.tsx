import { Facebook, Instagram } from 'lucide-react'
import React from 'react'
import Link from 'next/link'

function Footer() {
    return (
        <footer
            className='py-8 relative overflow-hidden'
        >
            <div className='max-w-4xl mx-auto relative z-10 flex flex-col md:flex-row justify-between items-center gap-2 md:gap-0'>
                <p className='text-white/50 text-lg font-lexend text-center md:text-left'>&copy; 2024 Valley&apos;s Drive In Theater - All Rights Reserved.</p>
                <div className='flex space-x-4 items-center'>
                    <div className='flex space-x-4 mr-4'>
                        <Link href='/' className='text-white/50 hover:text-white'>Home</Link>
                        <Link href='/#faq' className='text-white/50 hover:text-white'>FAQ</Link>
                        <Link href='/#tickets' className='text-white/50 hover:text-white'>Buy Your Tickets</Link>
                    </div>
                    <div className='flex space-x-4'>
                        <Link
                            href='https://www.instagram.com/valleysdriveintheater/'
                            target="_blank"
                            className='text-white/50 hover:text-white'
                        >
                            <Instagram size={24} />
                        </Link>
                        <Link
                            href='https://www.facebook.com/profile.php?id=100086438355565'
                            target="_blank"
                            className='text-white/50 hover:text-white'
                        >
                            <Facebook size={24} />
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer