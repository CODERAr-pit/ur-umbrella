"use client"
import React, { useState } from 'react'
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    email: "",
    password: ""
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(""); // Clear previous messages
    
    try {
      // Using NextAuth signIn
      const res = await signIn("credentials", {
        email: form.email,
        password: form.password,
        redirect: false, // false prevents auto-redirect so we can handle errors manually
      });

      if (res?.error) {
        // NextAuth usually hides whether it was email or password for security
        setMessage("Email ya password glt h bhai");
      } 
      else if (res?.ok) {
        setMessage("Login Ho Gya Bhai");
        router.refresh(); // Refresh to update session state
        router.push("/");
      }
    } catch (err) {
      setMessage("Login process fail ho gya mittar");
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen p-5 bg-white">
      <div className="w-full max-w-md border p-10 relative rounded-xl shadow-[8px_8px_0_#000]">
        <h1 className="text-2xl font-bold mb-8 text-black text-center">LOGIN</h1>

        {message && (
          <div className="mb-4 p-2 border-2 border-black text-center font-bold bg-yellow-100 text-black">
            {message}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-5">
            <label htmlFor="email" className="block mb-2 font-bold text-black">EMAIL</label>
            <input 
              type="email" 
              id="email" 
              name="email" 
              value={form.email}
              onChange={handleChange}
              placeholder="your@email.com" 
              className="w-full p-3 border-2 border-black rounded text-black focus:shadow-[4px_4px_0_#000] outline-none transition-all" 
            />
          </div>

          <div className="mb-5">
            <label htmlFor="password" className="block mb-2 font-bold text-black">PASSWORD</label>
            <input 
              type="password" 
              id="password" 
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••" 
              className="w-full p-3 border-2 border-black rounded text-black focus:shadow-[4px_4px_0_#000] outline-none transition-all" 
            />
          </div>

          <button type="submit" className="w-full p-3 bg-[#FF5E5B] border-2 border-black text-white font-bold mt-2 rounded hover:shadow-[4px_4px_0_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all">
            SIGN IN
          </button>
        </form>

        <div className="flex items-center my-6 font-bold text-black">
          <div className="flex-1 border-b-2 border-black"></div>
          <span className="mx-2">OR</span>
          <div className="flex-1 border-b-2 border-black"></div>
        </div>

        {/* You can also hook these up to NextAuth providers (Google, GitHub, etc.) later */}
        <div className="flex justify-center gap-4">
          <button onClick={() => signIn('google')} type="button" className="w-12 h-12 border-2 border-black flex justify-center items-center cursor-pointer hover:shadow-[4px_4px_0_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all text-black font-bold">G</button>
          <div className="w-12 h-12 border-2 border-black flex justify-center items-center cursor-pointer hover:shadow-[4px_4px_0_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all text-black font-bold">F</div>
          <div className="w-12 h-12 border-2 border-black flex justify-center items-center cursor-pointer hover:shadow-[4px_4px_0_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all text-black font-bold">X</div>
        </div>

        <div className="text-center mt-5 text-black">
          Don't have an account? <a href="/signUp" className="font-bold underline">Sign up</a>
        </div>
      </div>
    </div>
  );
}