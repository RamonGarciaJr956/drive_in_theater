import React, { useState } from 'react';
import Image from 'next/image';
import { Edit2Icon, CameraIcon, UserIcon } from 'lucide-react';

export default function ProfileEditSection() {
    const [profile, setProfile] = useState({
        name: 'John Doe',
        email: 'john.doe@example.com',
        profileImage: ''
    });

    const [isEditing, setIsEditing] = useState(false);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfile(prev => ({
                    ...prev,
                    profileImage: reader.result as string
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = () => {
        setIsEditing(false);
    };

    return (
        <div>
            <h1 className='text-4xl text-white font-lexend font-bold mb-8'>
                Profile
            </h1>

            <div className='bg-white/5 border border-white/10 rounded-xl p-8 flex flex-col items-center'>
                <div className='relative group mb-6'>
                    {
                        profile.profileImage ? (
                            <Image
                                src={profile.profileImage}
                                alt="Profile"
                                width={150}
                                height={150}
                                className='rounded-full object-cover w-[150px] h-[150px]'
                            />
                        ) : (
                            <div className='bg-white/10 rounded-full w-[150px] h-[150px] flex justify-center items-center'>
                                <UserIcon className='text-white/50' size={64} />
                            </div>
                        )
                    }
                    <label
                        htmlFor="profile-image-upload"
                        className='absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-full cursor-pointer'
                    >
                        <CameraIcon className='text-white' />
                    </label>
                    <input
                        type="file"
                        id="profile-image-upload"
                        accept="image/*"
                        className='hidden'
                        onChange={handleImageUpload}
                    />
                </div>

                {!isEditing ? (
                    <div className='text-center'>
                        <h2 className='text-2xl text-white font-lexend'>{profile.name}</h2>
                        <p className='text-white/70 mb-4'>{profile.email}</p>
                        <button
                            onClick={() => setIsEditing(true)}
                            className='flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-lexend px-4 py-2 rounded-lg mx-auto'
                        >
                            <Edit2Icon size={16} /> Edit Profile
                        </button>
                    </div>
                ) : (
                    <div className='w-full max-w-md space-y-4'>
                        <div>
                            <label className='text-white/70 block mb-2'>Name</label>
                            <input
                                type="text"
                                value={profile.name}
                                onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
                                className='w-full bg-white/10 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/20'
                            />
                        </div>
                        <div>
                            <label className='text-white/70 block mb-2'>Email</label>
                            <input
                                type="email"
                                value={profile.email}
                                onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
                                className='w-full bg-white/10 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/20'
                            />
                        </div>
                        <div className='flex justify-end space-x-4'>
                            <button
                                onClick={() => setIsEditing(false)}
                                className='bg-white/10 hover:bg-white/20 text-white font-lexend px-4 py-2 rounded-lg'
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                className='bg-white/20 hover:bg-white/30 text-white font-lexend px-4 py-2 rounded-lg'
                            >
                                Save Changes
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}