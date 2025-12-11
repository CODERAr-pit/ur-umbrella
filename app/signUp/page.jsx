"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();
  
  // 1. Add 'role' and 'shopName' to state
  const [role, setRole] = useState("customer"); // Default is customer
  
  const [form, setForm] = useState({
    user: "",
    email: "",
    password: "",
    phone: "",
    shopName: "", // New field for sellers
    street: "",
    city: "",
    state: "",
    pincode: ""
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 2. Send the correct role and shopName
    const payload = {
      user: form.user,
      email: form.email,
      password: form.password,
      phone: form.phone,
      address: {
        street: form.street,
        city: form.city,
        state: form.state,
        pincode: form.pincode
      },
      role: role, // 'customer' or 'seller'
      shopName: role === 'seller' ? form.shopName : undefined // Only send shopName if seller
    };

    try {
      const res = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      
      if (res.ok) {
        setMessage("Signup Successful! Redirecting...");
        router.push('/login');
      } else {
        setMessage(data.msg || "Signup Failed");
      }
    } catch (err) {
      console.error(err);
      setMessage("Something went wrong");
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-lg">
        
        <h2 className="text-2xl font-bold mb-6 text-center">Create Account</h2>

        {/* 🔘 ROLE TOGGLE BUTTONS */}
        <div className="flex bg-gray-200 p-1 rounded-lg mb-6">
          <button 
            type="button"
            className={`flex-1 py-2 rounded-md font-medium transition ${role === 'customer' ? 'bg-white shadow text-black' : 'text-gray-500'}`}
            onClick={() => setRole('customer')}
          >
            Customer
          </button>
          <button 
            type="button"
            className={`flex-1 py-2 rounded-md font-medium transition ${role === 'seller' ? 'bg-white shadow text-black' : 'text-gray-500'}`}
            onClick={() => setRole('seller')}
          >
            Seller
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input name="user" placeholder="Full Name" onChange={handleChange} className="w-full border p-2 rounded" required />
          
          {/* 🏪 SHOW SHOP NAME ONLY IF SELLER */}
          {role === 'seller' && (
            <input 
              name="shopName" 
              placeholder="Shop Name (Required)" 
              onChange={handleChange} 
              className="w-full border p-2 rounded border-blue-500 bg-blue-50" 
              required 
            />
          )}

          <input name="email" type="email" placeholder="Email" onChange={handleChange} className="w-full border p-2 rounded" required />
          <input name="phone" placeholder="Phone" onChange={handleChange} className="w-full border p-2 rounded" required />
          <input name="password" type="password" placeholder="Password" onChange={handleChange} className="w-full border p-2 rounded" required />
          
          <div className="grid grid-cols-2 gap-2">
            <input name="street" placeholder="Street" onChange={handleChange} className="border p-2 rounded" required />
            <input name="city" placeholder="City" onChange={handleChange} className="border p-2 rounded" required />
            <input name="state" placeholder="State" onChange={handleChange} className="border p-2 rounded" required />
            <input name="pincode" placeholder="Pincode" onChange={handleChange} className="border p-2 rounded" required />
          </div>

          <button type="submit" className="w-full bg-black text-white py-3 rounded-lg font-bold hover:bg-gray-800 transition">
            Register as {role === 'seller' ? 'Seller' : 'Customer'}
          </button>
        </form>

        {message && <p className="mt-4 text-center text-red-600">{message}</p>}
      </div>
    </div>
  );
}