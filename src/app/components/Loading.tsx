import React from 'react'
import type { Star } from '../../types'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { Loader2 } from 'lucide-react'

function Loading({ stars }: { stars: Star[] }) {
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
    )
}

export default Loading