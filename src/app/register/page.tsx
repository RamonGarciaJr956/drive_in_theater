"use client";

import { User, Lock, Mail } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { signIn } from 'next-auth/react'
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordError, setPasswordError] = useState('')

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

  useEffect(() => {
    if (password && confirmPassword && password !== confirmPassword) {
      setPasswordError('Passwords do not match')
    } else {
      setPasswordError('')
    }
  }, [password, confirmPassword])

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
            <h1 className='text-4xl font-lexend text-white text-center mb-4 uppercase'>
              Register
            </h1>

            <form className='space-y-6'>
              {passwordError && (
                <p className='text-red-500 text-sm text-center'>{passwordError}</p>
              )}

              <div className='relative'>
                <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                  <User className='text-white/50' size={20} />
                </div>
                <input
                  type="text"
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className='w-full bg-white/10 border border-white/20 rounded-lg py-3 pl-10 pr-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30'
                />
              </div>

              <div className='relative'>
                <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                  <Mail className='text-white/50' size={20} />
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
                  minLength={8}
                  className='w-full bg-white/10 border border-white/20 rounded-lg py-3 pl-10 pr-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30'
                />
              </div>

              <div className='relative'>
                <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                  <Lock className='text-white/50' size={20} />
                </div>
                <input
                  type="password"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={8}
                  className='w-full bg-white/10 border border-white/20 rounded-lg py-3 pl-10 pr-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30'
                />
              </div>

              <button
                type="submit"
                className='w-full bg-white/10 hover:bg-white/20 text-white font-bold py-3 rounded-lg transition-all duration-300 ease-in-out hover:shadow-lg'
              >
                Create Account
              </button>

              <div className='flex items-center justify-center my-4'>
                <div className='h-px bg-white/20 w-full'></div>
                <span className='px-4 text-white/50'>OR</span>
                <div className='h-px bg-white/20 w-full'></div>
              </div>

              <button
                type="button"
                onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
                className='w-full flex items-center justify-center gap-3 bg-white/10 hover:bg-white/20 text-white font-bold py-3 rounded-lg transition-all duration-300 ease-in-out hover:shadow-lg'
              >
                Continue with Google
              </button>
            </form>

            <div className='text-center mt-6'>
              <Link href="/signin" className='text-white/50 hover:text-white transition-colors'>
                Already have an account? Sign In
              </Link>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </main>
  )
}