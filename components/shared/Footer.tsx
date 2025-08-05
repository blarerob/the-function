import React from 'react';
import Link from "next/link";
import Image from "next/image";

const Footer = () => {
  return (
    <footer className='border-t'>
      <div className='flex-center wrapper between flex flex-col
       text-center sm:flex-row'>
          <Link href='/'>
              <Image
                src='/functionsLogo.png'
                alt='logo'
                width={100}
                height={100}
              />
          </Link>
          <p className='mt-2'>2025 Events. All Rights reserved</p>
      </div>
    </footer>
  );
};

export default Footer;