"use client";
import React, { useEffect, useState, use } from 'react';
import Image from 'next/image';
import {
    TicketIcon,
    CalendarIcon,
    ClockIcon,
    MapPinIcon,
    QrCodeIcon,
    DollarSignIcon
} from 'lucide-react';
import { motion } from 'framer-motion';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import type { Star } from '../../../types';
import Loading from '~/app/components/Loading';
import type { TicketResponse, TicketWithShowingAndMovie } from '~/types';
import { useQRCode } from 'next-qrcode';

export default function Page({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = use(params);
    const { status } = useSession();
    const router = useRouter();
    const [stars, setStars] = useState<Star[]>([]);
    const [ticket, setTicket] = useState<TicketWithShowingAndMovie>();
    const [isLoading, setIsLoading] = useState(true);
    const { Image: QrImage } = useQRCode();

    useEffect(() => {
        const starArray = Array.from({ length: 200 }).map((_, index) => ({
            id: index,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            scale: Math.random() * 1.05,
            duration: `${Math.random() + 4}s`,
            delay: `${Math.random()}s`,
        }));

        const getTicket = async () => {
            const response = await fetch(`/api/ticket?id=${slug}`);
            const data = await response.json() as TicketResponse;
            setTicket(data.ticket[0]);
            setIsLoading(false);
        }

        getTicket().catch((err) => {
            console.log(err);
            setIsLoading(false);
        });
        setStars(starArray);
    }, [slug]);

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
                    Fetching Ticket...
                </div>
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

                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className='container mx-auto px-4 md:px-52 md:py-4 z-20'
                >
                    <div className='grid md:grid-cols-2 gap-8'>
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3, duration: 0.5 }}
                            className='bg-white/5 border border-white/10 rounded-xl p-8 flex flex-col'
                        >
                            <h1 className='text-4xl text-white font-lexend font-bold mb-6'>
                                Order Details
                            </h1>

                            <div className='space-y-5 flex flex-col'>
                                {['id', 'date', 'time', 'location', 'totalPrice'].map((detail, index) => (
                                    <motion.div
                                        key={detail}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.4 + (index * 0.1), duration: 0.3 }}
                                        className='flex items-center gap-4'
                                    >
                                        {detail === 'id' && (
                                            <>
                                                <TicketIcon className='text-white/70' />
                                                <div>
                                                    <h3 className='text-xl text-white font-lexend'>
                                                        Ticket ID: {ticket?.ticket.id}
                                                    </h3>
                                                    <p className='text-white/70'>Digital Ticket</p>
                                                </div>
                                            </>
                                        )}
                                        {detail === 'date' && (
                                            <>
                                                <CalendarIcon className='text-white/70' />
                                                <div>
                                                    <h3 className='text-xl text-white font-lexend'>
                                                        Date
                                                    </h3>
                                                    <p className='text-white/70'>{new Date(ticket?.showing.start_time ?? '').toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                                </div>
                                            </>
                                        )}
                                        {detail === 'time' && (
                                            <>
                                                <ClockIcon className='text-white/70' />
                                                <div>
                                                    <h3 className='text-xl text-white font-lexend'>
                                                        Show Time
                                                    </h3>
                                                    <p className='text-white/70'>{new Date(ticket?.showing.start_time ?? '').toLocaleDateString()}</p>
                                                </div>
                                            </>
                                        )}
                                        {detail === 'location' && (
                                            <>
                                                <MapPinIcon className='text-white/70' />
                                                <div>
                                                    <h3 className='text-xl text-white font-lexend'>
                                                        Location
                                                    </h3>
                                                    <p className='text-white/70'>{ticket?.showing.location}</p>
                                                </div>
                                            </>
                                        )}
                                        {detail === 'totalPrice' && (
                                            <>
                                                <DollarSignIcon className='text-white/70' />
                                                <div>
                                                    <h3 className='text-xl text-white font-lexend'>
                                                        Total Price
                                                    </h3>
                                                    <p className='text-white/70'>${ticket?.movie.price}</p>
                                                </div>
                                            </>
                                        )}
                                    </motion.div>
                                ))}
                            </div>

                            <motion.div
                                initial={{ opacity: 0, y: 50 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.7, duration: 0.5 }}
                                className='mt-5 flex flex-col gap-4'
                            >
                                <div className='flex items-center gap-4'>
                                    <QrCodeIcon className='text-white/70' />
                                    <h3 className='text-xl text-white font-lexend'>
                                        Digital Ticket
                                    </h3>
                                </div>
                                <div className='flex flex-col items-center gap-4 text-center'>
                                    <div className='overflow-hidden rounded-lg'>
                                        <QrImage
                                            text={ticket?.ticket.id ?? ''}
                                            options={{
                                                type: 'image/jpeg',
                                                quality: 0.3,
                                                errorCorrectionLevel: 'M',
                                                margin: 3,
                                                scale: 4,
                                                width: 400,
                                                color: {
                                                    dark: '#000000FF',
                                                    light: '#FFFFFFFF',
                                                },
                                            }}
                                        />
                                    </div>
                                    <p className='text-white/70 text-lg'>
                                        This QR code is your digital ticket. Show this at the entrance to gain access to the event.
                                    </p>
                                </div>
                            </motion.div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4, duration: 0.5 }}
                            className='bg-white/5 border border-white/10 rounded-xl p-8'
                        >
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: 0.5, duration: 0.5 }}
                                className='relative w-full aspect-[2/3] mb-6'
                            >
                                <Image
                                    src={ticket?.movie.image ?? ''}
                                    alt={ticket?.movie.name ?? 'Movie Poster'}
                                    fill
                                    className='object-cover rounded-xl'
                                />
                            </motion.div>

                            <h2 className='text-3xl text-white font-lexend font-bold mb-4'>
                                {ticket?.movie.name}
                            </h2>

                            <div className='space-y-4'>
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.6, duration: 0.5 }}
                                >
                                    <h3 className='text-xl text-white/70 font-lexend mb-2'>
                                        Cast
                                    </h3>
                                    <div className='flex flex-wrap gap-2'>
                                        {ticket?.movie.starring.cast.map((actor, index) => (
                                            <motion.span
                                                key={actor}
                                                initial={{ opacity: 0, scale: 0.8 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                transition={{
                                                    delay: 0.7 + (index * 0.1),
                                                    duration: 0.3
                                                }}
                                                className='bg-white/10 text-white/70 px-3 py-1 rounded-full text-sm'
                                            >
                                                {actor}
                                            </motion.span>
                                        ))}
                                    </div>
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.8, duration: 0.5 }}
                                    className='flex flex-row gap-8'
                                >
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.8, duration: 0.5 }}
                                    >
                                        <h3 className='text-xl text-white/70 font-lexend mb-2'>
                                            Genre
                                        </h3>
                                        <p className='text-white'>{ticket?.movie.genre}</p>
                                    </motion.div>

                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.9, duration: 0.5 }}
                                    >
                                        <h3 className='text-xl text-white/70 font-lexend mb-2'>
                                            Runtime
                                        </h3>
                                        <p className='text-white'>{ticket?.movie.duration} minutes</p>
                                    </motion.div>
                                </motion.div>
                            </div>
                        </motion.div>
                    </div>
                </motion.div >

                <Footer />
            </main >
        );
    }
}