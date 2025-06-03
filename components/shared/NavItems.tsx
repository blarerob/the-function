'use client';

import React from 'react';
import { headerLinks } from "@/consts";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NavItems = () => {
    const pathname = usePathname();

    return (
        <ul className='hidden md:flex md:justify-between w-full flex-col md:flex-row items-start md:items-center gap-5'>
            {headerLinks.map((link) => {
                const isActive = pathname === link.route;

                return (
                    <li
                        key={link.route}
                        className={`${
                            isActive ? 'text-purple-400 font-light' : 'text-gray-300 font-light'
                        } flex-center p-medium-16 whitespace-nowrap transition-all duration-300 hover:text-pink-400 hover:scale-105`}
                    >
                        <Link href={link.route} className="text-lg font-medium">
                            {link.label}
                        </Link>
                    </li>
                );
            })}
        </ul>
    );
};

export default NavItems;