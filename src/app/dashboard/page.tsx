"use client";
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import type { Star } from '../../types';
import {
    TicketIcon,
    UserIcon,
    CalendarIcon,
    ChevronRightIcon
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import ProfileSection from './ProfileSection';
import Loading from '~/app/components/Loading';
import type { TicketsResponse } from '~/types';
import type { TicketWithShowingAndMovie } from '~/types';

export default function UserDashboard() {
    const [activeTab, setActiveTab] = useState('tickets');
    const { status } = useSession();
    const router = useRouter();
    const [stars, setStars] = useState<Star[]>([]);
    const [tickets, setTickets] = useState<TicketWithShowingAndMovie[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const starArray = Array.from({ length: 200 }).map((_, index) => ({
            id: index,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            scale: Math.random() * 1.05,
            duration: `${Math.random() + 4}s`,
            delay: `${Math.random()}s`,
        }));

        const getTickets = async () => {
            const response = await fetch('/api/tickets');
            const data = await response.json() as TicketsResponse;
            setTickets(data.tickets);
            setIsLoading(false);
        }

        getTickets().catch((error) => {
            console.error('Error fetching tickets:', error);
            setIsLoading(false);
        });
        setStars(starArray);
    }, []);

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/signin')
        }
    }, [router, status])

    if (status === 'loading' || status === 'unauthenticated') {
        return (
            <Loading stars={stars} />
        );
    }

    if (isLoading) {
        return (
            <main className='max-w-screen h-screen overflow-hidden flex flex-col bg-black justify-center items-center relative'>
                <div className='absolute w-full h-full z-10'>
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
                <div className='text-white text-3xl font-lexend animate-pulse'>
                    Fetching Tickets...
                </div>
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
                            <AnimatePresence mode="wait">
                                {activeTab === 'tickets' && (
                                    <motion.div
                                        key="tickets"
                                        initial={{ opacity: 0, x: 50 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -50 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <h1 className='text-4xl text-white font-lexend font-bold mb-8'>
                                            My Tickets
                                        </h1>

                                        <div className='space-y-6'>
                                            {tickets.length === 0 && (
                                                <div className='text-white/70 text-center text-xl'>
                                                    You don&apos;t have any tickets yet.
                                                    <Link href='/#tickets'>
                                                        <p className='text-white underline'>Buy one now!</p>
                                                    </Link>
                                                </div>
                                            )}

                                            {tickets.map((ticket) => (
                                                <div
                                                    key={ticket.ticket.id}
                                                    className='bg-white/5 border border-white/10 rounded-xl md:justify-between overflow-hidden flex md:items-center md:flex-row flex-col gap-6 p-6 hover:border-white/20 transition-all'
                                                >
                                                    <div className='flex flex-row gap-4'>
                                                        <Image
                                                            src={ticket.movie.image}
                                                            alt="Ticket QR Code"
                                                            width={100}
                                                            height={100}
                                                            className='rounded-lg'
                                                        />
                                                        <div className='flex-1'>
                                                            <h3 className='text-2xl text-white font-lexend'>
                                                                {ticket.movie.name}
                                                            </h3>
                                                            <div className='text-white/70 space-y-1'>
                                                                <p className='flex items-center gap-2'>
                                                                    <CalendarIcon size={16} />
                                                                    {new Date(ticket.showing.start_time).toLocaleString()}
                                                                </p>
                                                                <p>Ticket ID: {ticket.ticket.id}</p>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className='md:text-right text-left'>
                                                        <p className='text-2xl text-white font-lexend'>
                                                            ${ticket.movie.price}
                                                        </p>
                                                        <Link
                                                            href={`/ticket/${ticket.ticket.id}`}
                                                            className='text-white/70 hover:text-white flex items-center gap-1'
                                                        >
                                                            Details <ChevronRightIcon size={16} />
                                                        </Link>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}

                                {activeTab === 'profile' && (
                                    <ProfileSection />
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>

                <Footer />
            </main>
        );
    }
}