"use client";
import { X } from 'lucide-react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';

interface MobileMenuProps {
  isOpen: boolean;
  toggleMenuAction: () => void;
}

export default function MobileMenu({ isOpen, toggleMenuAction }: MobileMenuProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="fixed top-0 left-0 w-full h-full bg-black/75 z-50 backdrop-blur-sm md:hidden"
        >
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="flex flex-col h-full justify-center items-center"
          >
            <ul className='flex flex-col space-y-8 text-center'>
              <motion.li
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.4, ease: "easeOut" }}
              >
                <Link
                  href={'/'}
                  onClick={toggleMenuAction}
                  className="text-white text-3xl font-lexend font-light py-2 block transition-all duration-300 hover:text-white/70"
                >
                  Home
                </Link>
              </motion.li>
              <motion.li
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.4, ease: "easeOut" }}
              >
                <Link
                  href={'/#faq'}
                  onClick={toggleMenuAction}
                  className="text-white text-3xl font-lexend font-light py-2 block transition-all duration-300 hover:text-white/70"
                >
                  FAQ
                </Link>
              </motion.li>

              <hr className='w-[90%] mx-auto border-white/50 border-1' />

              <motion.li
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.4, ease: "easeOut" }}
              >
                <Link
                  href={'/#tickets'}
                  onClick={toggleMenuAction}
                  className="text-white text-3xl font-lexend font-light py-2 block transition-all duration-300 hover:text-white/70"
                >
                  Buy Your Tickets
                </Link>
              </motion.li>

              <motion.li
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.4, ease: "easeOut" }}
                className='flex justify-center'
              >
                <Link
                  href={'/signin'}
                  onClick={toggleMenuAction}
                  className="text-white text-3xl font-lexend font-light py-2 block transition-all duration-300 hover:text-white/70"
                >
                  Login
                </Link>
              </motion.li>
            </ul>

            {/* Close button */}
            <motion.button
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ delay: 0.4, duration: 0.3, ease: "easeOut" }}
              onClick={toggleMenuAction}
              className="absolute top-6 right-6 text-white hover:text-white/70 transition-all duration-300"
            >
              <X size={32} />
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}