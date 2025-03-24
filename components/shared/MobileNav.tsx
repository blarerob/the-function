import React from 'react';
import Image from 'next/image';
import NavItems from "@/components/shared/NavItems";

const MobileNav = () => {
  return (
      <nav className='md:hidden'>
      <div className="drawer drawer-end">
          <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />
          <div className="drawer-content">
              <label htmlFor="my-drawer-4" className="drawer-button btn btn-jtown">
                  <Image
                  src='/assets/icons/menu.svg'
                  alt='Menu'
                  width={24}
                  height={24}
                  className='cursor-pointer'
              />
              </label>
          </div>
          <div className="drawer-side">
              <label htmlFor="my-drawer-4" aria-label="close sidebar" className="drawer-overlay"></label>
              <ul className="menu bg-base-200 text-base-content min-h-full w-80 p-4">
                  <Image
                        src='/assets/images/chargers-logo.png'
                        width={100}
                        height={38}
                        alt='logo'
                        />
                  <div className='menu mt-4 min-h-full w-80 p-4'>
                    <NavItems />
                  </div>
              </ul>
          </div>
      </div>
      </nav>
  );
};

export default MobileNav;