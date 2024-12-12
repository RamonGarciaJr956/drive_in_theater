/* eslint-disable @typescript-eslint/no-unsafe-call */
import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Edit2Icon, CameraIcon, UserIcon, XIcon, SaveIcon } from 'lucide-react';
import { useSession } from 'next-auth/react';
import Compressor from 'compressorjs';
import { useUploadThing } from '~/utils/uploadthing';

async function compressImage(file: File): Promise<File> {
    return new Promise((resolve, reject) => {
        new Compressor(file, {
            quality: 0.6,
            maxWidth: 500,
            maxHeight: 500,
            mimeType: 'image/webp',

            async success(result: Blob) {
                const compressedFile = new File([result], file.name, {
                    type: result.type,
                    lastModified: Date.now(),
                });
                resolve(compressedFile);
            },

            error(err: Error) {
                reject(new Error(err.message));
            },
        });
    });
}

export default function ProfileEditSection() {
    const { data: session, update } = useSession();
    const [profile, setProfile] = useState({
        name: session?.user?.name ?? '',
        email: session?.user?.email ?? '',
        profileImage: session?.user?.image ?? ''
    });

    async function updateProfile(profileData : { name: string, email: string, profileImage: string } ) {
        const response = await fetch('/api/update-profile', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(profileData),
        });

        if (response.ok) {
            await update();
        } else {
            console.error('Failed to update profile');
        }
    }

    const { startUpload } = useUploadThing("imageUploader", {
        onClientUploadComplete: () => {
            console.log("uploaded successfully!");
        },
        onUploadError: () => {
            console.error("error occurred while uploading");
        },
        onUploadBegin: (fileName: string) => {
            console.log("upload has begun for", fileName);
        },
    });

    const [isEditing, setIsEditing] = useState(false);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const compressed = await compressImage(file);
            const uploadResult = await startUpload([compressed]);
            if (uploadResult?.[0]) {
                setProfile(prev => ({
                    ...prev,
                    profileImage: uploadResult?.[0]?.url ?? ''
                }));
                await updateProfile({ ...profile, profileImage: uploadResult?.[0]?.url ?? '' });
            }
        }
    };

    const handleSave = async () => {
        setIsEditing(false);
        await updateProfile(profile);
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

                <AnimatePresence mode="wait">
                    {!isEditing ? (
                        <motion.div
                            key="view-mode"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                            className='text-center'
                        >
                            <h2 className='text-2xl text-white font-lexend'>
                                {profile.name}
                            </h2>
                            <p className='text-white/70 mb-4'>
                                {profile.email}
                            </p>
                            <button
                                onClick={() => setIsEditing(true)}
                                className='flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-lexend px-4 py-2 rounded-lg mx-auto'
                            >
                                <Edit2Icon size={16} /> Edit Profile
                            </button>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="edit-mode"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                            className='w-full max-w-md space-y-4'
                        >
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
                                    className='flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-lexend px-4 py-2 rounded-lg'
                                >
                                    <XIcon size={16} /> Cancel
                                </button>
                                <button
                                    onClick={handleSave}
                                    className='flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white font-lexend px-4 py-2 rounded-lg'
                                >
                                    <SaveIcon size={16} /> Save Changes
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}