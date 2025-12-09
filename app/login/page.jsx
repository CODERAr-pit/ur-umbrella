"use client"
import React from 'react'
import { useRouter } from "next/navigation"
// src/app/login/page.jsx




export default function LoginPage() {

    const [form,setForm]=useState({
        email: "",
        password: ""
    });
   const [message, setMessage] = useState("");
   const handleChange=(e)=>{
   setForm({ ...form, [e.target.name]: e.target.value });
    }

const handleSubmit=(e)=>{
e.preventDefault();
try{const res=fetch("/api/login",{
    method:"POST",
    headers:{ 'Content-Type': 'application/json' },
    body:JSON.stringify(form)})
    if(res.status===200){
        setMessage("Login Ho Gya Bhai")
        router.push("/");
    }
    else if(res.status===201){
        setMessage("Email glt h bhai");
    }
    else{
        setMessage("password glt h bhai");
    }
}
catch(err){
    setMessage("fetch nhi ho rh mittar");
}
}
  return (
    <div className="flex justify-center items-center min-h-screen p-5 bg-white">
      <div className="w-full max-w-md border p-10 relative rounded-xl shadow-[8px_8px_0_#000]">
        <h1 className="text-2xl font-bold mb-8 text-black text-center">LOGIN</h1>

        <div className="mb-5">
          <label htmlFor="email" className="block mb-2 font-bold text-black">EMAIL</label>
          <input type="email" id="email" placeholder="your@email.com" className="w-full p-3 border-2 border-black rounded text-black focus:shadow-[4px_4px_0_#000] outline-none transition-all" />
        </div>

        <div className="mb-5">
          <label htmlFor="password" className="block mb-2 font-bold text-black">PASSWORD</label>
          <input type="password" id="password" placeholder="••••••••" className="w-full p-3 border-2 border-black rounded text-black focus:shadow-[4px_4px_0_#000] outline-none transition-all" />
        </div>

        <button className="w-full p-3 bg-[#FF5E5B] border-2 border-black text-white font-bold mt-2 rounded hover:shadow-[4px_4px_0_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all">SIGN IN</button>

        <div className="flex items-center my-6 font-bold text-black">
          <div className="flex-1 border-b-2 border-black"></div>
          <span className="mx-2">OR</span>
          <div className="flex-1 border-b-2 border-black"></div>
        </div>

        <div className="flex justify-center gap-4">
          <div className="w-12 h-12 border-2 border-black flex justify-center items-center cursor-pointer hover:shadow-[4px_4px_0_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all">G</div>
          <div className="w-12 h-12 border-2 border-black flex justify-center items-center cursor-pointer hover:shadow-[4px_4px_0_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all">F</div>
          <div className="w-12 h-12 border-2 border-black flex justify-center items-center cursor-pointer hover:shadow-[4px_4px_0_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all">X</div>
        </div>

        <div className="text-center mt-5 text-black">
          Don't have an account? <a href="/signUp" className="font-bold underline">Sign up</a>
        </div>
      </div>
    </div>
  );
}
