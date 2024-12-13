"use client";
import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import MobileMenu from './MobileMenu';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { signOut } from 'next-auth/react';

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { status } = useSession();

    const toggleMenuAction = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <div className="flex flex-row px-6 py-4 w-full justify-between items-center z-50">
            <Link href={'/'} className="mb-0">
                <Image src="/logo.webp" alt="logo" width={84} height={84} />
            </Link>

            <div className="md:hidden">
                <button
                    onClick={toggleMenuAction}
                    className="text-white focus:outline-none"
                >
                    {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            <ul className='hidden md:flex flex-row h-fit gap-6 font-lexend font-light items-center'>
                <li><Link href={'/'} className="text-white text-lg py-2 px-5 rounded-full hover:backdrop-blur-xl hover:bg-white/25">Home</Link></li>
                <li><Link href={'/#faq'} className="text-white text-lg py-2 px-5 rounded-full hover:backdrop-blur-xl hover:bg-white/25">FAQ</Link></li>
                <li><Link href={'/#tickets'} className="text-white text-lg py-3 px-5 rounded-sm backdrop-blur-xl bg-white/25 hover:bg-white/50">Buy Your Tickets</Link></li>
                {
                    status === 'authenticated' ? (
                        <>
                            <li><Link href={'/dashboard'} className="text-white text-lg py-3 px-5 rounded-sm backdrop-blur-xl bg-white/25 hover:bg-white/50">Dashboard</Link></li>
                            <li><a onClick={async () => await signOut({
                                callbackUrl: '/'
                            })} className="text-white text-lg py-3 px-5 rounded-sm backdrop-blur-xl bg-white/25 hover:bg-white/50 hover:cursor-pointer">Sign Out</a></li>
                        </>
                    ) : (
                        <li><Link href={'/signin'} className="text-white text-lg py-3 px-5 rounded-sm backdrop-blur-xl bg-white/25 hover:bg-white/50">Login</Link></li>
                    )
                }
            </ul>

            <MobileMenu isOpen={isMenuOpen} toggleMenuAction={toggleMenuAction} />
        </div>
    )
}
