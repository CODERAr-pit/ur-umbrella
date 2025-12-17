"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { io } from "socket.io-client";

export default function RiderDashboard() {
  const router = useRouter();
  
  // State
  const [rider, setRider] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(false);
  const [status, setStatus] = useState("offline");
  const [location, setLocation] = useState(null);
  const [incomingOrder, setIncomingOrder] = useState(null);
  const [activeOrder, setActiveOrder] = useState(null);

  const socketRef = useRef(null);
  const watchIdRef = useRef(null);

  // ---------------------------------------------------------
  // EFFECT 1: CHECK AUTHENTICATION (The "Me" Endpoint)
  // ---------------------------------------------------------
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/rider/me");
        const data = await res.json();

        if (res.ok && data.success) {
          console.log("✅ Rider Logged In:", data.user.name);
          setRider(data.user);
        } else {
          console.warn("❌ No Valid Session, Redirecting...");
          router.push("/riderlogin");
        }
      } catch (err) {
        console.error("Auth Check Failed:", err);
        router.push("/riderlogin");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  // ---------------------------------------------------------
  // EFFECT 2: INITIALIZE SOCKET (Runs after rider is loaded)
  // ---------------------------------------------------------
  useEffect(() => {
    if (!rider) return; 

    // Connect to your server (Explicit URL prevents connection errors)
    socketRef.current = io(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000", {
        path: "/socket.io", // Ensure this matches your server.js config
    });

    socketRef.current.on("connect", () => {
      console.log("✅ Socket Connected");
      socketRef.current.emit("rider-login", rider._id);
    });

    socketRef.current.on("new-order-request", (data) => {
      console.log("🔔 Incoming Order:", data);
      setIncomingOrder(data); 
    });

    socketRef.current.on("order-confirmed", (data) => {
      alert("Order Accepted! Go to pickup.");
      setActiveOrder(data.orderId);
      setIncomingOrder(null);
      setStatus("busy"); 
    });

    socketRef.current.on("order-missed", (msg) => {
      alert(msg);
      setIncomingOrder(null);
    });

    return () => {
      if (socketRef.current) socketRef.current.disconnect();
    };
  }, [rider]);

  // ---------------------------------------------------------
  // EFFECT 3: LOCATION TRACKING LOGIC
  // ---------------------------------------------------------
  useEffect(() => {
    if (isOnline && rider) {
      console.log("🛰️ Starting GPS Tracking...");
      
      if (status === 'offline') setStatus('idle');

      watchIdRef.current = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          console.log({lat:latitude,long: longitude});
          setLocation({ latitude, longitude });

          // EMIT TO SERVER
          if (socketRef.current) {
            socketRef.current.emit("rider-location-update", {
              riderId: rider._id,
              latitude: latitude,   
              longitude: longitude, 
              status: activeOrder ? 'busy' : 'idle', 
              activeOrderId: activeOrder
            });
          }
        },
        (err) => {
        console.error("GPS Error Code:", err.code);
        console.error("GPS Error Message:", err.message);
        alert(`GPS Failed: ${err.message}`); // Pop up alert so you see it on screen
},
        { enableHighAccuracy: true, maximumAge: 10000, timeout: 5000 }
      );

    } else {
      // STOP TRACKING
      if (watchIdRef.current) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
    }
    
    // Cleanup on unmount
    return () => {
      if (watchIdRef.current) {
         navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, [isOnline, rider, activeOrder, status]);


  // Handlers
  const handleAcceptOrder = () => {
    if (!socketRef.current || !incomingOrder) return;
    socketRef.current.emit("rider-accept-order", {
      riderId: rider._id,
      orderId: incomingOrder.orderId
    });
  };

  const handleRejectOrder = () => setIncomingOrder(null);


  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="h-12 w-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-500 font-medium">Verifying Rider Profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
       {/* HEADER */}
       <div className="bg-white p-4 shadow-md flex justify-between items-center sticky top-0 z-10">
        <div>
          <h1 className="text-xl font-extrabold text-gray-800">FastDelivery Partner</h1>
          <p className="text-xs text-gray-500">
            {rider ? `ID: ${rider._id.slice(-4)}` : "Loading..."}
          </p>
          <div className="flex items-center gap-2 mt-1">
            <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-red-500'}`}></span>
            <p className="text-xs text-gray-500">{isOnline ? "Online & Tracking" : "Offline"}</p>
          </div>
        </div>
        
        <button
          onClick={() => setIsOnline(!isOnline)}
          className={`px-6 py-2 rounded-full font-bold shadow-lg transition-all ${
            isOnline 
            ? "bg-red-100 text-red-600 border border-red-200" 
            : "bg-green-500 text-white hover:bg-green-600"
          }`}
        >
          {isOnline ? "Go Offline" : "GO ONLINE"}
        </button>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 p-6 flex flex-col items-center justify-center">
        
        {/* MAP / STATUS VISUALIZATION */}
        {!isOnline ? (
           <div className="text-center opacity-60">
             <div className="text-6xl mb-4">😴</div>
             <h2 className="text-2xl font-bold text-gray-400">You are currently offline</h2>
             <p className="text-gray-400">Go online to receive orders near you.</p>
           </div>
        ) : (
          <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6 text-center animate-fade-in-up">
            
            {activeOrder ? (
              // ACTIVE ORDER VIEW
              <div className="bg-green-50 p-6 rounded-xl border border-green-200">
                 <div className="text-5xl mb-2">📦</div>
                 <h2 className="text-2xl font-bold text-green-800">On Delivery</h2>
                 <p className="text-green-600">Order ID: #{activeOrder}</p>
                 <p className="text-sm text-gray-500 mt-2">Navigation started...</p>
                 <button 
                   className="mt-4 bg-green-600 text-white w-full py-3 rounded-lg font-bold shadow-md"
                   onClick={() => { setActiveOrder(null); setStatus('idle'); }}
                 >
                   Mark Delivered
                 </button>
              </div>
            ) : (
              // SEARCHING VIEW
              <div>
                <div className="relative w-32 h-32 mx-auto mb-6">
                  <div className="absolute inset-0 bg-blue-100 rounded-full animate-ping opacity-75"></div>
                  <div className="relative bg-white w-32 h-32 rounded-full flex items-center justify-center border-4 border-blue-500 z-10">
                     <span className="text-4xl">🛵</span>
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Finding Orders...</h2>
                <p className="text-gray-500 mt-2">
                  Sending location to server...<br/>
                  <span className="text-xs font-mono bg-gray-100 px-2 py-1 rounded mt-1 inline-block">
                    {location ? `${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}` : "Getting GPS..."}
                  </span>
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* INCOMING ORDER MODAL */}
      {incomingOrder && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl p-6 animate-slide-up">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900">New Order Request!</h3>
                <p className="text-gray-500 text-sm">Earnings: ₹145.00</p>
              </div>
              <div className="bg-orange-100 text-orange-800 text-xs font-bold px-2 py-1 rounded">
                2.4 km
              </div>
            </div>

            <div className="mb-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <p className="text-sm text-gray-700">Pickup: {incomingOrder.pickupLocation?.lat || "Restaurant"}</p>
              </div>
              <div className="h-4 border-l border-gray-300 ml-1"></div>
              <div className="flex items-center gap-3 mt-1">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <p className="text-sm text-gray-700">Drop: Customer Location</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={handleRejectOrder}
                className="bg-gray-200 text-gray-800 font-bold py-3 rounded-xl hover:bg-gray-300"
              >
                Reject
              </button>
              <button 
                onClick={handleAcceptOrder}
                className="bg-black text-white font-bold py-3 rounded-xl hover:bg-gray-800 shadow-lg"
              >
                Accept Order
              </button>
            </div>
            
            <div className="w-full bg-gray-200 h-1 mt-4 rounded-full overflow-hidden">
               <div className="bg-orange-500 h-full w-full animate-[width_10s_linear_reverse]"></div>
            </div>
            <p className="text-center text-xs text-gray-400 mt-1">Auto-reject in 10s</p>
          </div>
        </div>
      )}
    </div>
  );
}