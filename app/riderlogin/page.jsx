"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RiderLogin() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const router = useRouter();

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit() {
    if (!form.email || !form.password) {
      alert("Please enter both email and password.");
      return;
    }

    try {
      console.log("🚀 Sending Login Request...");
      
      const response = await fetch('/api/riderlogin', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });

      const data = await response.json();
      console.log("✅ Server Response:", data);

      // CHECK: Look for success flag OR status 200
      if (response.ok && (data.success || response.status === 200)) {
        
        console.log("🔀 Redirecting to Dashboard...");
        
        // Force redirect
        router.push('/rider/dashboard');
        
        // Fallback: If router.push fails for some reason, use standard window location
        // window.location.href = '/rider/dashboard'; 

      } else {
        console.error("❌ Login Failed Logic:", data);
        alert(data.msg || "Login Failed");
      }

    } catch (error) {
      console.error("🔥 Network Error:", error);
      alert("Something went wrong. Check console.");
    }
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-white to-orange-400 flex justify-center items-center p-6">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-xl grid grid-cols-1 md:grid-cols-2 overflow-hidden">

        {/* LEFT SIDE */}
        <div className="bg-gradient-to-b from-white to-orange-400 p-10 flex flex-col justify-center items-center">
          <h1 className="text-3xl font-bold text-black text-center">
            Welcome Back, <br />
            <span className="text-green-800">Partner!</span>
          </h1>
        </div>

        {/* RIGHT SIDE: FORM */}
        <div className="p-12 flex flex-col justify-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Rider Login</h2>

          <div className="flex flex-col gap-5">
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={form.email}
              onChange={handleChange}
              className="border p-4 rounded-lg w-full text-black bg-gray-50"
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className="border p-4 rounded-lg w-full text-black bg-gray-50"
            />

            <button 
              onClick={handleSubmit} 
              className="mt-4 bg-black text-white w-full p-4 text-lg font-bold rounded-lg hover:bg-gray-800 transition"
            >
              Login
            </button>
            
            <button 
                onClick={() => router.push('/ridersignup')}
                className="text-center text-sm text-gray-500 hover:text-black mt-4"
            >
                Don't have an account? Sign up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}