'use client';

import { usePathname } from 'next/navigation';
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs';
import MobileNav from '@/components/shared/MobileNav';

const Header = () => {
  const pathname = usePathname();

  return (
    <header className="w-full h-20 bg-gradient-to-r from-white to-black text-white shadow-md shadow-black flex items-center justify-center p-4 z-50 relative">
      <div className="wrapper flex items-center justify-between h-full w-full gap-4">
        <div className="md:-ml-14 md:gap-3 w-full">
          <Link href="/" className="hidden sm:flex w-36 sm:w-20 h-20 items-start sm:ml-0 ml-[-2rem]">
            <Image
              src="/functionsLogo.png"
              width={160}
              height={160}
              alt="Functions Logo"
              className="object-contain mr-15"
            />
          </Link>
          <Link href="/" className="flex text-purple-500 transition-all duration-300 hover:text-pink-400 hover:scale-105 sm:hidden items-center text-lg font-semibold ml-[-1rem]">
            Home
          </Link>
        </div>

        <div className="hidden sm:flex items-center gap-10">
          <SignedIn>
            <nav className="flex gap-10">
              <Link
                href="/"
                className={`text-lg font-semibold p-4 transition-all duration-300 hover:text-pink-400 hover:scale-105 ${
                  pathname === '/' ? 'text-pink-400' : 'text-white'
                }`}
              >
                Home
              </Link>
              <Link
                href="/events/create"
                className={`text-lg font-semibold p-4 transition-all duration-300 hover:text-pink-400 hover:scale-105 ${
                  pathname === '/events/create' ? 'text-pink-400' : 'text-white'
                }`}
              >
                Create
              </Link>
              <Link
                href="/profile"
                className={`text-lg font-semibold p-4 transition-all duration-300 hover:text-pink-400 hover:scale-105 
                 text-nowrap ${
                  pathname === '/profile' ? 'text-pink-400' : 'text-white'
                }`}
              >
                My Profile
              </Link>
            </nav>
          </SignedIn>
        </div>

        <div className="flex items-center gap-0">
          <SignedIn>
            <UserButton afterSignOutUrl="/" />
            <MobileNav />
          </SignedIn>
          <SignedOut>
            <div className="btn btn-sign-up-sign-in flex justify-center items-center p-4 gap-4 bg-white text-blue-500 rounded-full hover:bg-blue-100 transition-all duration-300">
              <Link href="/sign-up">Login</Link>
            </div>
          </SignedOut>
        </div>
      </div>
    </header>
  );
};

export default Header;