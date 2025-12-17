"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RiderSignup() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    city: "",
    aadhar: "",
    drivingLicense: "",
    bikeRC: "",
    photo: "",
  });
  
  const router = useRouter();

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit() {
    // Basic validation
    if (!form.name || !form.email || !form.password) {
      alert("Please fill in all required fields");
      return;
    }

    try {
      const response = await fetch('/api/ridersignup', {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        // FIX: Send 'form' directly, not nested inside another object
        body: JSON.stringify(form) 
      });

      const data = await response.json();

      if (response.status === 201 || data.success) {
        alert("Registration Successful!");
        router.push('/riderlogin');
      } else {
        alert(data.msg || "Signup Failed");
        console.error("Signup Failed:", data.error);
      }

    } catch (error) {
      console.error("Network Error:", error);
      alert("Something went wrong");
    }
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-white to-orange-400 flex justify-center items-center p-6">
      <div className="w-full max-w-6xl bg-white rounded-2xl shadow-xl grid grid-cols-1 md:grid-cols-2 overflow-hidden">

        {/* LEFT SIDE IMAGE UI */}
        <div className="bg-gradient-to-b from-white to-orange-400 p-10 flex flex-col justify-center">
          {/* Ensure you have this image in your public folder */}
          <img
            src="/rider-illustration.png" 
            alt="Rider Illustration"
            className="w-80 mx-auto mb-6 object-contain"
          />

          <h1 className="text-4xl font-bold text-black leading-tight text-center">
            Earn upto ₹50,000 with<br /> 
            <span className="text-green-800">Fast Delivery. Join Now!</span>
          </h1>

          <p className="mt-4 text-black text-center font-medium">
            Joining bonus ₹4000 | Upto ₹10 lacs insurance | Weekly payout
          </p>
        </div>

        {/* RIGHT SIDE FORM */}
        <div className="p-10 flex flex-col justify-center overflow-y-auto max-h-screen">
            <div className="flex gap-5 items-center mb-6">
              <h2 className="text-3xl font-bold text-gray-900">
                Become a Partner
              </h2>
              <button 
                onClick={()=>{router.replace('/riderlogin')}} 
                className="bg-yellow-200 text-sm font-bold text-gray-900 px-4 py-2 rounded-xl hover:bg-yellow-300 transition"
              >
                Login Instead
              </button>
            </div>

          {/* FORM INPUTS */}
          <div className="grid grid-cols-2 gap-4">

            <input
              type="text"
              name="name"
              placeholder="Full Name*"
              value={form.name}
              onChange={handleChange}
              className="border p-3 rounded-lg w-full text-black"
            />

            <input
              type="number"
              name="phone"
              placeholder="Phone*"
              value={form.phone}
              onChange={handleChange}
              className="border p-3 rounded-lg w-full text-black"
            />

            <input
              type="email"
              name="email"
              placeholder="Email*"
              value={form.email}
              onChange={handleChange}
              className="border p-3 rounded-lg w-full col-span-2 text-black"
            />

            <input
              type="password"
              name="password"
              placeholder="Password*"
              value={form.password}
              onChange={handleChange}
              className="border p-3 rounded-lg w-full col-span-2 text-black"
            />

            {/* CITY */}
            <select
              name="city"
              value={form.city}
              onChange={handleChange}
              className="border p-3 rounded-lg w-full col-span-2 text-black"
            >
              <option value="">Select City*</option>
              <option value="Durgapur">Durgapur</option>
              <option value="Kolkata">Kolkata</option>
              <option value="Delhi">Delhi</option>
              <option value="Mumbai">Mumbai</option>
            </select>

            {/* DOCUMENTS */}
            <input
              type="text"
              name="aadhar"
              placeholder="Aadhar Number*"
              value={form.aadhar}
              onChange={handleChange}
              className="border p-3 rounded-lg w-full col-span-2 text-black"
            />

            <input
              type="text"
              name="drivingLicense"
              placeholder="Driving License Number*"
              value={form.drivingLicense}
              onChange={handleChange}
              className="border p-3 rounded-lg w-full col-span-2 text-black"
            />

            <input
              type="text"
              name="bikeRC"
              placeholder="Bike RC Number*"
              value={form.bikeRC}
              onChange={handleChange}
              className="border p-3 rounded-lg w-full col-span-2 text-black"
            />

            {/* PHOTO URL */}
            <input
              type="text"
              name="photo"
              placeholder="Photo URL (optional)"
              value={form.photo}
              onChange={handleChange}
              className="border p-3 rounded-lg w-full col-span-2 text-black"
            />

          </div>

          <button onClick={handleSubmit} className="mt-6 bg-black text-white w-full p-3 text-lg font-bold rounded-lg hover:opacity-80 transition">
            Join to Earn
          </button>
        </div>
      </div>
    </div>
  );
}