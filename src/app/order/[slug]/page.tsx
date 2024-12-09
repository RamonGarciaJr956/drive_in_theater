"use client";
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import {
    TicketIcon,
    CalendarIcon,
    ClockIcon,
    MapPinIcon,
    QrCodeIcon,
    DollarSignIcon,
    UsersIcon,
    Loader2
} from 'lucide-react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const mockMovieDetails = {
    id: 'MOANA2-001',
    movieName: 'Moana 2',
    date: 'June 12, 2024',
    time: '6:15 PM',
    price: 20,
    qrCode: '/qrcode_www.google.com.png',
    movieImage: '/moana 2.webp',
    location: '3116 Ash Avenue, McAllen, Texas 78501',
    numberOfTickets: 1,
    totalPrice: 20,
    cast: ['Dwayne Johnson', 'Nicole Scherzinger', 'Alan Tudyk', 'Rose Matafeo'],
    genre: 'Animation, Adventure',
    runtime: '100 minutes'
};

interface Star {
    id: number;
    top: string;
    left: string;
    scale: number;
    duration: string;
    delay: string;
}

export default function Page({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = React.use(params);
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

                <div className='container mx-auto px-4 md:px-52 md:py-4'>
                    <div className='grid md:grid-cols-2 gap-8'>
                        <div className='bg-white/5 border border-white/10 rounded-xl p-8 flex flex-col'>
                            <h1 className='text-4xl text-white font-lexend font-bold mb-6'>
                                Order Details
                            </h1>

                            <div className='space-y-4 flex flex-col'>
                                <div className='flex items-center gap-4'>
                                    <TicketIcon className='text-white/70' />
                                    <div>
                                        <h3 className='text-xl text-white font-lexend'>
                                            Ticket ID: {mockMovieDetails.id}
                                        </h3>
                                        <p className='text-white/70'>Digital Ticket</p>
                                    </div>
                                </div>

                                <div className='flex items-center gap-4'>
                                    <CalendarIcon className='text-white/70' />
                                    <div>
                                        <h3 className='text-xl text-white font-lexend'>
                                            Date
                                        </h3>
                                        <p className='text-white/70'>{mockMovieDetails.date}</p>
                                    </div>
                                </div>

                                <div className='flex items-center gap-4'>
                                    <ClockIcon className='text-white/70' />
                                    <div>
                                        <h3 className='text-xl text-white font-lexend'>
                                            Show Time
                                        </h3>
                                        <p className='text-white/70'>{mockMovieDetails.time}</p>
                                    </div>
                                </div>

                                <div className='flex items-center gap-4'>
                                    <MapPinIcon className='text-white/70' />
                                    <div>
                                        <h3 className='text-xl text-white font-lexend'>
                                            Location
                                        </h3>
                                        <p className='text-white/70'>{mockMovieDetails.location}</p>
                                    </div>
                                </div>

                                <div className='flex items-center gap-4'>
                                    <UsersIcon className='text-white/70' />
                                    <div>
                                        <h3 className='text-xl text-white font-lexend'>
                                            Number of Tickets
                                        </h3>
                                        <p className='text-white/70'>{mockMovieDetails.numberOfTickets}</p>
                                    </div>
                                </div>

                                <div className='flex items-center gap-4'>
                                    <DollarSignIcon className='text-white/70' />
                                    <div>
                                        <h3 className='text-xl text-white font-lexend'>
                                            Total Price
                                        </h3>
                                        <p className='text-white/70'>${mockMovieDetails.totalPrice}</p>
                                    </div>
                                </div>
                            </div>

                            <div className='mt-8 flex flex-col gap-4'>
                                <div className='flex items-center gap-4'>
                                    <QrCodeIcon className='text-white/70' />
                                    <h3 className='text-xl text-white font-lexend'>
                                        Digital Ticket
                                    </h3>
                                </div>
                                <div className='flex flex-col items-center gap-4 text-center'>
                                    <Image
                                        src={mockMovieDetails.qrCode}
                                        alt="Ticket QR Code"
                                        width={400}
                                        height={400}
                                        className='rounded-lg'
                                    />
                                    <p className='text-white/70 text-lg'>
                                        This QR code is your digital ticket. Show this at the entrance to gain access to the event.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className='bg-white/5 border border-white/10 rounded-xl p-8'>
                            <div className='relative w-full aspect-[2/3] mb-6'>
                                <Image
                                    src={mockMovieDetails.movieImage}
                                    alt={mockMovieDetails.movieName}
                                    fill
                                    className='object-cover rounded-xl'
                                />
                            </div>

                            <h2 className='text-3xl text-white font-lexend font-bold mb-4'>
                                {mockMovieDetails.movieName}
                            </h2>

                            <div className='space-y-4'>
                                <div>
                                    <h3 className='text-xl text-white/70 font-lexend mb-2'>
                                        Cast
                                    </h3>
                                    <div className='flex flex-wrap gap-2'>
                                        {mockMovieDetails.cast.map((actor) => (
                                            <span
                                                key={actor}
                                                className='bg-white/10 text-white/70 px-3 py-1 rounded-full text-sm'
                                            >
                                                {actor}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <h3 className='text-xl text-white/70 font-lexend mb-2'>
                                        Genre
                                    </h3>
                                    <p className='text-white'>{mockMovieDetails.genre}</p>
                                </div>

                                <div>
                                    <h3 className='text-xl text-white/70 font-lexend mb-2'>
                                        Runtime
                                    </h3>
                                    <p className='text-white'>{mockMovieDetails.runtime}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <Footer />
            </main>
        );
    }
}