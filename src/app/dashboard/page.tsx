"use client";
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
    TicketIcon,
    UserIcon,
    CreditCardIcon,
    CalendarIcon,
    ChevronRightIcon,
    Loader2
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProfileEditSection from './ProfileEditSection';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

const mockTickets = [
    {
        id: 'MOANA2-001',
        movieName: 'Moana 2',
        movieImage: '/moana 2.webp',
        date: 'June 12, 2024',
        time: '6:15 PM',
        price: 20,
        qrCode: '/ticket-qr-placeholder.png'
    },
    {
        id: 'GLAD2-002',
        movieName: 'Gladiator 2',
        movieImage: '/gladiator 2.jpeg',
        date: 'July 5, 2024',
        time: '6:15 PM',
        price: 20,
        qrCode: '/ticket-qr-placeholder.png'
    }
];

interface Star {
    id: number;
    top: string;
    left: string;
    scale: number;
    duration: string;
    delay: string;
}

export default function UserDashboard() {
    const [activeTab, setActiveTab] = useState('tickets');
    const { status } = useSession();
    const router = useRouter();
    const [stars, setStars] = useState<Star[]>([]);

    useEffect(() => {
        const starArray = Array.from({ length: 200 }).map((_, index) => ({
            id: index,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            scale: Math.random() * 1.05,
            duration: `${Math.random() + 4}s`,
            delay: `${Math.random()}s`,
        }));

        setStars(starArray);
    }, []);
    
    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/signin')
        }
    }, [router, status])

    if (status === 'loading' || status === 'unauthenticated') {
        return (
            <main className='max-w-screen min-h-screen overflow-hidden flex flex-col bg-black relative justify-between'>
                <Navbar />

                <div className="absolute w-full h-full">
                    {stars.map((star) => (
                        <div
                            key={star.id}
                            className="absolute w-1 h-1 bg-white/50 rounded-full animate-sparkle"
                            style={{
                                top: star.top,
                                left: star.left,
                                scale: star.scale,
                                animationDuration: star.duration,
                                animationDelay: star.delay,
                            }}
                        />
                    ))}
                </div>

                <div className='flex flex-col justify-center items-center gap-2'>
                    <Loader2 className='w-16 h-16 text-white animate-spin' />
                    <h3 className='text-white text-xl'>Loading...</h3>
                </div>

                <Footer />
            </main>
        );
    }

    if (status === 'authenticated') {
        return (
            <main className='max-w-screen min-h-screen overflow-hidden flex flex-col bg-black relative'>
                <Navbar />

                <div className="absolute w-full h-full">
                    {stars.map((star) => (
                        <div
                            key={star.id}
                            className="absolute w-1 h-1 bg-white/50 rounded-full animate-sparkle"
                            style={{
                                top: star.top,
                                left: star.left,
                                scale: star.scale,
                                animationDuration: star.duration,
                                animationDelay: star.delay,
                            }}
                        />
                    ))}
                </div>

                <div className='flex-1 container mx-auto px-4 py-12 z-10'>
                    <div className='grid md:grid-cols-[250px_1fr] gap-8'>
                        <div className='bg-white/5 border border-white/10 rounded-xl p-6 h-fit'>
                            <div className='space-y-2'>
                                {[
                                    {
                                        icon: <TicketIcon className='text-white/70' />,
                                        label: 'My Tickets',
                                        value: 'tickets'
                                    },
                                    {
                                        icon: <UserIcon className='text-white/70' />,
                                        label: 'Profile',
                                        value: 'profile'
                                    }
                                ].map((item) => (
                                    <button
                                        key={item.value}
                                        onClick={() => setActiveTab(item.value)}
                                        className={`w-full flex items-center gap-3 p-3 rounded-lg text-left ${activeTab === item.value ? 'bg-white/20 text-white' : 'text-white/70 hover:bg-white/10'}`}
                                    >
                                        {item.icon}
                                        <span className='font-lexend'>{item.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            {activeTab === 'tickets' && (
                                <div>
                                    <h1 className='text-4xl text-white font-lexend font-bold mb-8'>
                                        My Tickets
                                    </h1>

                                    <div className='space-y-6'>
                                        {mockTickets.map((ticket) => (
                                            <div
                                                key={ticket.id}
                                                className='bg-white/5 border border-white/10 rounded-xl overflow-hidden flex items-center gap-6 p-6 hover:border-white/20 transition-all'
                                            >
                                                <Image
                                                    src={ticket.movieImage}
                                                    alt="Ticket QR Code"
                                                    width={100}
                                                    height={100}
                                                    className='rounded-lg'
                                                />
                                                <div className='flex-1'>
                                                    <h3 className='text-2xl text-white font-lexend'>
                                                        {ticket.movieName}
                                                    </h3>
                                                    <div className='text-white/70 space-y-1'>
                                                        <p className='flex items-center gap-2'>
                                                            <CalendarIcon size={16} />
                                                            {ticket.date} at {ticket.time}
                                                        </p>
                                                        <p>Ticket ID: {ticket.id}</p>
                                                    </div>
                                                </div>
                                                <div className='text-right'>
                                                    <p className='text-2xl text-white font-lexend'>
                                                        ${ticket.price}
                                                    </p>
                                                    <Link
                                                        href={`/order/${ticket.id}`}
                                                        className='text-white/70 hover:text-white flex items-center gap-1'
                                                    >
                                                        Details <ChevronRightIcon size={16} />
                                                    </Link>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {activeTab === 'profile' && (
                                <ProfileEditSection />
                            )}
                        </div>
                    </div>
                </div>

                <Footer />
            </main>
        );
    }
}