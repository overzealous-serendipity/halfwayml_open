import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const HalfwayLogo = () => {
  return (
    <Link href="/" className="flex items-center ml-4">
      <div className="flex items-center gap-2 align-middle">
        <div className=" ">
          <Image 
            src="/logo1.svg" 
            alt="Logo" 
            width={32} 
            height={32}
            className="object-contain"
          />
        </div>
        <span className=" text-base text-gray-800 align-middle font-bold">
          halfway
        </span>
      </div>

    </Link>
  );
};

export default HalfwayLogo;