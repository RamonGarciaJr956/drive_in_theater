import { motion } from 'framer-motion'
import React, { useEffect, useState } from 'react'
import ProfileEditSection from './ProfileEditSection'
import { GemIcon, StarIcon } from 'lucide-react';
import type { LoyaltyPointsResponse, LoyaltyPoints } from '../../types';

function ProfileSection() {
    const [isLoading, setIsLoading] = useState(true)
    const [loyaltyPoints, setLoyaltyPoints] = useState<LoyaltyPoints>()

    useEffect(() => {
        const getLoyaltyPoints = async () => {
            const response = await fetch('/api/loyalty-points')
            const data = await response.json() as LoyaltyPointsResponse
            setLoyaltyPoints(data.loyaltyPoints[0])
            setIsLoading(false)
        }

        getLoyaltyPoints().catch((err) => {
            console.log(err)
            setIsLoading(false)
        })
    }, [])

    if (isLoading) {
        return <div>Loading...</div>
    }
    
    return (
        <motion.div
            key="profile"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
        >
            <div className='grid md:grid-cols-[1fr_300px] gap-8'>
                <div>
                    <ProfileEditSection />
                </div>

                <div className='bg-white/5 border border-white/10 rounded-xl p-6 h-fit'>
                    <div className='flex items-center gap-3 mb-6'>
                        <GemIcon className='text-blue-400' />
                        <h2 className='text-2xl text-white font-lexend'>
                            Loyalty Rewards
                        </h2>
                    </div>

                    <div className='space-y-4'>
                        <div className='bg-white/10 rounded-lg p-4'>
                            <div className='flex justify-between items-center mb-2'>
                                <span className='text-white/70'>Current Tier</span>
                                <span className='text-white font-bold'>
                                    {loyaltyPoints?.tier_name}
                                </span>
                            </div>
                            <div className='w-full bg-white/20 rounded-full h-2.5 mt-2'>
                                <div
                                    className='bg-blue-500 h-2.5 rounded-full'
                                    style={{ width: `${loyaltyPoints?.tier_progress_percentage}%` }}
                                />
                            </div>
                        </div>

                        <div className='bg-white/10 rounded-lg p-4 flex justify-between items-center'>
                            <div className='flex items-center gap-2'>
                                <StarIcon className='text-yellow-400' />
                                <span className='text-white/70'>Total Points</span>
                            </div>
                            <span className='text-white font-bold text-2xl'>
                                {loyaltyPoints?.total_points}
                            </span>
                        </div>

                        <div className='bg-white/10 rounded-lg p-4'>
                            <p className='text-white/70'>
                                {loyaltyPoints!.next_tier_points - loyaltyPoints!.total_points} points until
                                <span className='text-white font-bold ml-1'>Gold Tier</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    )
}

export default ProfileSection