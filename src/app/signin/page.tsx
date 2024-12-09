"use client";

import { User, Lock } from 'lucide-react'
import Link from 'next/link'
import { FormEvent, useEffect, useState } from 'react'
import { signIn } from 'next-auth/react'
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Signin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  
  interface Star {
    id: number;
    top: string;
    left: string;
    scale: number;
    duration: string;
    delay: string;
  }

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

  const handleSignIn = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const result = await signIn('credentials', {
        email: email,
        password: password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid Credentials Provided");
      }
    } catch (error) {
      setError("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <main className='min-w-screen min-h-screen overflow-hidden flex flex-col bg-black relative'>

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

      <div className='flex-1 flex flex-col max-w-screen max-h-screen z-10'>
        <Navbar />

        <div className='flex-1 flex justify-center items-center'>
          <div className='w-full max-w-md bg-white/5 border border-white/10 rounded-xl p-8 backdrop-blur-sm m-8'>
            <h1 className='text-4xl font-lexend text-white text-center mb-8 uppercase'>
              Login
            </h1>

            <form onSubmit={handleSignIn} className='space-y-6'>
              <div className='relative'>
                <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                  <User className='text-white/50' size={20} />
                </div>
                <input
                  type="email"
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className='w-full bg-white/10 border border-white/20 rounded-lg py-3 pl-10 pr-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30'
                />
              </div>

              <div className='relative'>
                <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                  <Lock className='text-white/50' size={20} />
                </div>
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className='w-full bg-white/10 border border-white/20 rounded-lg py-3 pl-10 pr-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30'
                />
              </div>

              <button
                type="submit"
                className='w-full bg-white/10 hover:bg-white/20 text-white font-bold py-3 rounded-lg transition-all duration-300 ease-in-out hover:shadow-lg'
              >
                Login
              </button>

              <div className='flex items-center justify-center my-4'>
                <div className='h-px bg-white/20 w-full'></div>
                <span className='px-4 text-white/50'>OR</span>
                <div className='h-px bg-white/20 w-full'></div>
              </div>

              <button
                type="button"
                onClick={() => signIn('google')}
                className='w-full flex items-center justify-center gap-3 bg-white/10 hover:bg-white/20 text-white font-bold py-3 rounded-lg transition-all duration-300 ease-in-out hover:shadow-lg'
              >
                Continue with Google
              </button>
            </form>

            <div className='text-center mt-6'>
              <Link href="/register" className='text-white/50 hover:text-white transition-colors'>
                Don&apos;t have an account? Register
              </Link>
              <Link href="/forgot-password" className='block text-white/50 hover:text-white transition-colors mt-2'>
                Forgot your password?
              </Link>
            </div>
          </div>
        </div>

        <Footer />
      </div>

    </main>
  )
}
