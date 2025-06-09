"use client"

import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Menu,  Search, ShoppingCart, X } from 'lucide-react'
import Link from 'next/link'
import React, { useState } from 'react'
import { ThemeToggle } from './ThemeToggle'
import { useRouter } from 'next/navigation'
import { useAuthContext } from '@/context/AuthContext'



const navLinks = [
    { label: 'Categories', href: '/' },
    { label: 'Sale', href: '/' },
    { label: 'Clearance', href: '/' },
    { label: 'New Stock', href: '/' },
    { label: 'Trending', href: '/' },
]

const Navbar = () => {
    const [mobileOpen, setMobileOpen] = useState(false)
    const { authUser } = useAuthContext()
    const router = useRouter();
    const handleLogout = async () => {
        try {
            await fetch(`/api/auth/logout`, {
                method: 'POST'
            });
            localStorage.removeItem('user')
            router.push('/login');
        } catch (err) {
            console.error("Logout failed", err);
        }
    }

    return (
        <nav className="sticky top-0 z-50 w-full    pt-3  bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className='flex items-center px-4 sm:px-6 lg:px-8 justify-end'>
                {['Help', 'Order & Returns', 'Hi, John'].map((link) => (
                    <Link
                        key={link}
                        href={link}
                        className="text-gray-700 dark:text-gray-100 hover:text-indigo-600 transition"
                    >
                        {link}
                    </Link>
                ))}
            </div>
            <div className="mx-auto px-4 sm:px-6 lg:px-8  h-16 flex items-center justify-between">
                <div className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
                    <h1 className='dark:text-white text-black text-3xl uppercase'>Ecommerce</h1>
                </div>
                <div className="hidden md:flex gap-8">
                    {navLinks.map(link => (
                        <Link
                            key={link.label}
                            href={link.href}
                            className="text-gray-700 dark:text-gray-100 hover:text-indigo-600 transition"
                        >
                            {link.label}
                        </Link>
                    ))}
                </div>
                <div className=" flex items-center dark:text-white text-black md:gap-8 gap-2">
                    <Search />
                    <ShoppingCart />
                    <ThemeToggle />
                    <button className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
                        {mobileOpen ? <X className='dark:text-white text-black' size={24} /> : <Menu className='dark:text-white text-black' size={24} />}
                    </button>
                </div>
            </div>

            <AnimatePresence>
                {mobileOpen && (
                    <motion.div
                        className="md:hidden bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-t-1 border-t-gray-100 px-4 py-4 space-y-4"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        {navLinks.map(link => (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setMobileOpen(false)}
                                className="block text-gray-700 dark:text-gray-100 hover:text-indigo-600"
                            >
                                {link.label}
                            </Link>
                        ))}
                        <div className="md:hidden flex items-center dark:text-white text-black md:gap-8 gap-2">
                            {authUser ? (
                                <button onClick={handleLogout} className="btn bg-[#ff691f] rounded-md px-3 h-9 self-center items-center flex">Logout</button>
                            ) : (
                                <Link href="/login" className="btn bg-[#ff691f] rounded-md px-3 h-9 self-center items-center flex">Login</Link>
                            )}
                            <a className="items-center dark:text-white text-black justify-center gap-2 whitespace-nowrap text-sm font-medium dark:bg-[#634c1c] dark:hover:bg-[#634c1e] bg-[#f0e4cb] hover:bg-[#f0e4cb] h-9 rounded-md px-3 inline-flex"
                                href="/onboarding">Join Us</a>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className='bg-[#F4F4F4] py-1 flex items-center justify-center gap-3'>
                <ChevronLeft />
                Get 10% off on business sign up
                <ChevronRight />
            </div>
        </nav>
    )
}

export default Navbar