'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import NavItems from "@/components/shared/NavItems";

const MobileNav = () => {
   const [isOpen, setIsOpen] = useState(false);

    const toggleDrawer = () => {
        setIsOpen(!isOpen);
    };

    const closeDrawer = () => {
        setIsOpen(false);
    };

   return (
       <nav className='md:hidden z-50 relative'>
           <div className="drawer drawer-end">
               <input id="my-drawer-4" type="checkbox" className="drawer-toggle" checked={isOpen} onChange={toggleDrawer} />
               <div className="drawer-content">
                   <label
                       htmlFor="my-drawer-4"
                       className="drawer-button relative w-24 h-24 flex items-center justify-center
                       cursor-pointer text-4xl text-white animate-float"
                       style={{ color: 'white' }}
                   >
                       🎈
                   </label>
               </div>
               <div className="drawer-side" onClick={closeDrawer}>
                   <label htmlFor="my-drawer-4" aria-label="close sidebar" className="drawer-overlay"></label>
                  <ul className="menu bg-gradient-to-b from-white via-pink-500 to-black text-white h-80 w-60 p-1 rounded-lg flex flex-col items-center">
                      <li className="mb-4 flex justify-center w-full">
                          <Image
                              src='/functionslogo.png'
                              width={100}
                              height={50}
                              alt='logo'
                              className='object-contain logo-animate-float'
                          />
                      </li>
                      <div>
                          <NavItems />
                      </div>
                  </ul>
               </div>
           </div>
       </nav>
   );
};

export default MobileNav;