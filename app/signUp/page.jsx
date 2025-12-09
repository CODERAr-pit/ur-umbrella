"use client";

import { useState } from "react";

export default function SignupPage() {
  const [form, setForm] = useState({
    user: "",
    email: "",
    password: "",
    phone: "",
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
    try {
      const res = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      const data = await res.json();
      if (res.ok) {
        setMessage(data.message);
        setForm({ user: '', email: '', password: '', phone: '', street: '', city: '', state: '', pincode: '' });
      } else {
        setMessage(data.error);
      }
    } catch (err) {
      console.error(err);
      setMessage("Something went wrong");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen p-5 bg-orange-50">
      <form onSubmit={handleSubmit} className="w-full max-w-md p-10 bg-white border-l-4 border-orange-500 rounded-xl shadow-lg">
        <h1 className="text-3xl font-extrabold mb-6 text-center text-orange-600">SIGN UP</h1>

        {message && <p className="mb-4 text-center text-red-500 font-semibold">{message}</p>}

        {Object.keys(form).map((key) => (
          <div className="mb-4" key={key}>
            <label className="block mb-1 font-bold text-gray-700 capitalize" htmlFor={key}>{key}</label>
            <input
              type={key === 'password' ? 'password' : 'text'}
              id={key}
              name={key}
              value={form[key]}
              onChange={handleChange}
              className="w-full p-3 border-2 border-orange-300 rounded focus:border-orange-500 focus:ring focus:ring-orange-200 outline-none"
              required
            />
          </div>
        ))}

        <button type="submit" className="w-full p-3 mt-4 bg-orange-500 text-white font-bold rounded hover:bg-orange-600 transition">Sign Up</button>
      </form>
    </div>
  );
}
