import React from 'react';
import Link from "next/link";
import Image from "next/image";
import {
    SignInButton,
    SignUpButton,
    SignedIn,
    SignedOut,
    UserButton,
} from '@clerk/nextjs'
import NavItems from "@/components/shared/NavItems";
import MobileNav from "@/components/shared/MobileNav";

export const HeaderButton = () => {
    return (
        <>
            <SignedOut>
               <div className="flex justify-end items-center p-4 gap-4 whitespace-nowrap">
                   <div className="btn btn-sign-up-sign-in">
                       <SignInButton />
                   </div>
                   <div className="btn btn-sign-up-sign-in cursor-pointer">
                       <SignUpButton />
                   </div>
               </div>
            </SignedOut>
                <SignedIn>
                    <UserButton />
                </SignedIn>
        </>
    );
};

const Header = () => {
  return (
<header className='w-full h-16 border-b flex items-center justify-center p-4'>
    <div className='wrapper flex items-center justify-center h-full w-full gap-4 sm:flex-row'>
               <div className='md:-ml-14 md:gap-3 w-full'>
                    <Link href='/' className='w-36'>
                        <Image
                            src='/assets/images/charger-header.png'
                            width={140}
                            height={140}
                            alt='J-Town District'
                            className='ml-2'
                        />
                    </Link>
                </div>
                    <SignedIn>
                        <nav className='md:justify-between items-center hidden md:flex w-full max-w-xs justify-center'>
                            <NavItems />
                      </nav>
                    </SignedIn>
                    <div className='flex w-full justify-end gap-3'>
                        <SignedIn>
                            <UserButton afterSignOutUrl='/' />
                            <MobileNav />
                        </SignedIn>
                    </div>
                     <div className="btn btn-sign-up-sign-in flex justify-center items-center p-4 gap-4">
                        <SignedOut>
                            <Link href='/sign-up' >
                               Login
                            </Link>
                        </SignedOut>
                     </div>
            </div>
        </header>
  );
};

export default Header;