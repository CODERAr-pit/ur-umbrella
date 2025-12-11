"use client"
import React from "react"; 
import { assets } from "@/assets/assets";
import Link from "next/link"
import { useAppContext } from "@/context/AppContext";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react"; 
// ❌ REMOVED: import { authOptions } ... (Don't import server code here!)

const Navbar = () => {

  // ✅ FIX 1: No arguments needed for client-side hook
  const { data: session } = useSession(); 
  
  const { router } = useAppContext();

  return (
    <nav className="flex items-center justify-between px-6 md:px-16 lg:px-32 py-3 border-b border-gray-300 text-gray-700">
      <Image
        className="cursor-pointer w-28 md:w-32"
        onClick={() => router.push('/')}
        src={assets.logo}
        alt="logo"
      />
      
      {/* Desktop Menu */}
      <div className="flex items-center gap-4 lg:gap-8 max-md:hidden">
        <Link href="/" className="hover:text-gray-900 transition">Home</Link>
        <Link href="/all-products" className="hover:text-gray-900 transition">Shop</Link>
        <Link href="/" className="hover:text-gray-900 transition">About Us</Link>
        <Link href="/" className="hover:text-gray-900 transition">Contact</Link>

        {/* ✅ FIX 2: Safe check using optional chaining (?.) */}
        {session?.user?.role === "seller" && (
            <button onClick={() => router.push('/seller')} className="text-xs border px-4 py-1.5 rounded-full">
                Seller Dashboard
            </button>
        )}
      </div>

      <ul className="hidden md:flex items-center gap-4 ">
        <Image className="w-4 h-4" src={assets.search_icon} alt="search icon" />
        
        {session ? (
          <div className="flex items-center gap-2 cursor-pointer group relative">
             <Image 
                src={session.user?.image || assets.user_icon} 
                alt="user" 
                width={25} 
                height={25} 
                className="rounded-full"
             />
             {/* ✅ FIX 3: Safe access */}
             <p className="text-sm font-medium">{session.user?.name}</p>
             
             <div className="absolute hidden group-hover:block top-full right-0 pt-2 z-10">
                <div className="bg-white border rounded shadow-md p-2 w-32">
                   <button onClick={() => signOut()} className="text-sm hover:text-red-500 w-full text-left">Logout</button>
                </div>
             </div>
          </div>
        ) : (
          <button onClick={() => router.push('/login')} className="flex items-center gap-2 hover:text-gray-900 transition">
            <Image src={assets.user_icon} alt="user icon" />
            Login
          </button>
        )}
      </ul>

      <div className="flex items-center md:hidden gap-3">
        {/* Safe check for mobile as well */}
        {session?.user?.role === "seller" && (
            <button onClick={() => router.push('/seller')} className="text-xs border px-4 py-1.5 rounded-full">
                Seller Dashboard
            </button>
        )}
        
        <button onClick={() => session ? router.push('/account') : router.push('/login')} className="flex items-center gap-2 hover:text-gray-900 transition">
          <Image src={session?.user?.image || assets.user_icon} width={20} height={20} className="rounded-full" alt="user icon" />
          {session ? session.user?.name : "Login"}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;