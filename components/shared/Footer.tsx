import React from 'react';
import Link from "next/link";
import Image from "next/image";

const Footer = () => {
  return (
    <footer className='border-t'>
      <div className='flex-center wrapper between flex flex-col
      gap-4 p-5 text-center sm:flex-row'>
          <Link href='/'>
              <Image
                src='/assets/images/chargers-logo.png'
                alt='logo'
                width={50}
                height={50}
              />
          </Link>
          <p className='mt-2'>2025 Events. All Rights reserved</p>
      </div>
    </footer>
  );
};

export default Footer;