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
  const router=useRouter();
  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-white to-orange-400 flex justify-center items-center p-6">
      {/* MAIN WRAPPER */}
      <div className="w-full max-w-6xl bg-white rounded-2xl shadow-xl grid grid-cols-1 md:grid-cols-2 overflow-hidden">

        {/* LEFT SIDE IMAGE UI */}
        <div className="bg-gradient-to-b from-white to-orange-400 p-10 flex flex-col justify-center">
          <img
            src="/rider-illustration.png" // put your illustration here
            alt="Rider Image"
            className="w-80 mx-auto mb-6"
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
        <div className="p-10 flex flex-col justify-center">
            <div className="flex gap-5">
          <h2 className="text-3xl font-bold mb-6 text-gray-900">
            Become a Delivery Partner |
          </h2>
            <button onClick={()=>{router.replace('/riderlogin')}} className="bg-yellow-200 text-xl font-bold mb-6 text-gray-900  size-18 p-1.5 rounded-xl">login</button>
          </div>{/* FORM */}
          <div className="grid grid-cols-2 gap-4">

            <input
              type="text"
              name="name"
              placeholder="Full Name*"
              value={form.name}
              onChange={handleChange}
              className="border p-3 rounded-lg w-full"
            />

            <input
              type="text"
              name="phone"
              maxLength="10"
              placeholder="Phone*"
              value={form.phone}
              onChange={handleChange}
              className="border p-3 rounded-lg w-full"
            />

            <input
              type="email"
              name="email"
              placeholder="Email*"
              value={form.email}
              onChange={handleChange}
              className="border p-3 rounded-lg w-full col-span-2"
            />

            <input
              type="password"
              name="password"
              placeholder="Password*"
              value={form.password}
              onChange={handleChange}
              className="border p-3 rounded-lg w-full col-span-2"
            />

            {/* CITY */}
            <select
              name="city"
              value={form.city}
              onChange={handleChange}
              className="border p-3 rounded-lg w-full col-span-2"
            >
              <option value="">Select City*</option>
              <option>Durgapur</option>
              <option>Kolkata</option>
              <option>Delhi</option>
              <option>Mumbai</option>
            </select>

            {/* DOCUMENTS */}
            <input
              type="text"
              name="aadhar"
              placeholder="Aadhar Number*"
              value={form.aadhar}
              onChange={handleChange}
              className="border p-3 rounded-lg w-full col-span-2"
            />

            <input
              type="text"
              name="drivingLicense"
              placeholder="Driving License Number*"
              value={form.drivingLicense}
              onChange={handleChange}
              className="border p-3 rounded-lg w-full col-span-2"
            />

            <input
              type="text"
              name="bikeRC"
              placeholder="Bike RC Number*"
              value={form.bikeRC}
              onChange={handleChange}
              className="border p-3 rounded-lg w-full col-span-2"
            />

            {/* PHOTO URL */}
            <input
              type="text"
              name="photo"
              placeholder="Photo URL (optional)"
              value={form.photo}
              onChange={handleChange}
              className="border p-3 rounded-lg w-full col-span-2"
            />

          </div>

          {/* SUBMIT BTN */}
          <button className="mt-6 bg-black text-white w-full p-3 text-lg font-bold rounded-lg hover:opacity-80 transition">
            Join to Earn
          </button>
        </div>
      </div>
    </div>
  );
}
