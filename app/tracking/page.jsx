'use client';

import React, { useEffect, useState, Suspense, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import io from 'socket.io-client';
import dynamic from 'next/dynamic';

// Dynamic import for Leaflet Map
const TrackingMap = dynamic(() => import('@/components/trackingmap'), { 
  ssr: false,
  loading: () => <div className="h-full w-full bg-gray-100 animate-pulse flex items-center justify-center">Loading Map...</div>
});

const TrackingContent = () => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const orderId = searchParams.get('orderId');

    // States
    const [status, setStatus] = useState('searching'); // 'searching', 'found', 'failed'
    const [rider, setRider] = useState(null);
    const [statusMessage, setStatusMessage] = useState("Connecting to network...");
    const [riderLocation, setRiderLocation] = useState(null);

    const socketRef = useRef(null);

    useEffect(() => {
        if (!orderId) return;

        // ---------------------------------------------------------
        // 1. FIX: Connect to the EXACT same URL as Rider Dashboard
        // ---------------------------------------------------------
        socketRef.current = io(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000", {
            path: "/socket.io", // Crucial: Matches server.js config
        });

        socketRef.current.on('connect', () => {
            console.log("✅ Customer Connected:", socketRef.current.id);
            // Only trigger search once connected
            triggerSearch();
        });

        // ---------------------------------------------------------
        // 2. LISTENERS
        // ---------------------------------------------------------
        
        // SUCCESS: Rider Accepted the Order
        socketRef.current.on('rider-found', (data) => {
            console.log("🎉 Rider Assigned:", data);
            setRider({ member: data.riderId });
            setStatus('found');
        });

        // LIVE UPDATE: Rider GPS Movement
        socketRef.current.on('update-rider-location', (coords) => {
            console.log("📍 Rider moved:", coords);
            setRiderLocation(coords); 
        });

        // FAILURE: Server couldn't find anyone after 15s
        socketRef.current.on('order-status', (data) => {
            console.log("⚠️ Order Status:", data);
            if (data.status === 'No Riders Available') {
                setStatus('failed');
                setStatusMessage("No riders found nearby.");
            }
        });

        // Cleanup
        return () => {
            if (socketRef.current) socketRef.current.disconnect();
        };
    }, [orderId]);

    const triggerSearch = () => {
        if (!navigator.geolocation) return alert("Geolocation required");

        setStatus('searching');
        setStatusMessage("Broadcasting request to nearby riders...");

        navigator.geolocation.getCurrentPosition((position) => {
            const { latitude, longitude } = position.coords;
            console.log({latitude,longitude})
            // Set initial map location to user so it's not blank
            if (!riderLocation) setRiderLocation({ latitude, longitude }); 
            
            // Emit Search Event
            if(socketRef.current) {
                console.log("📡 Emitting find-nearest-rider for Order:", orderId);
                socketRef.current.emit('find-nearest-rider', {
                    userLat: latitude,
                    userLong: longitude,
                    orderId: orderId
                });
            }
        }, (err) => {
            console.error(err);
            setStatusMessage("Error getting GPS location. Please allow access.");
        });
    };

    return (
        <div className="flex flex-col h-screen bg-gray-50 relative">
             {/* Navbar */}
             <div className="absolute top-0 left-0 right-0 bg-white/90 backdrop-blur-md z-[1000] p-4 shadow-sm flex justify-between items-center px-6 md:px-16">
                <h1 className="font-bold text-xl text-gray-800">Tracking #{orderId ? orderId.slice(-6) : '...'}</h1>
                <button onClick={() => router.push('/')} className="text-orange-600 font-bold">Home</button>
            </div>

            {/* Map Area */}
            <div className="flex-grow relative w-full h-full">
                
                {/* 1. SEARCHING STATE */}
                {status === 'searching' && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 z-[900] backdrop-blur-sm">
                        <div className="h-24 w-24 rounded-full border-4 border-orange-500 border-t-transparent animate-spin flex items-center justify-center">
                            <span className="text-2xl">📡</span>
                        </div>
                        <h2 className="mt-8 text-xl font-bold text-gray-800 animate-pulse">Finding nearby drivers...</h2>
                        <p className="text-gray-500 mt-2">{statusMessage}</p>
                        <p className="text-xs text-gray-400 mt-4 max-w-xs text-center">
                            (Make sure a Rider is "Online" in a different tab and clicks "Accept")
                        </p>
                    </div>
                )}

                {/* 2. FAILED STATE */}
                {status === 'failed' && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-white z-[900]">
                        <div className="text-6xl mb-4">😢</div>
                        <h2 className="text-2xl font-bold text-gray-800">No Riders Found</h2>
                        <p className="text-gray-500 mt-2 mb-6">All our partners are currently busy.</p>
                        
                        <div className="flex gap-4">
                            <button 
                                onClick={() => router.push('/')}
                                className="px-6 py-3 bg-gray-200 text-gray-800 font-bold rounded-xl"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={triggerSearch}
                                className="px-6 py-3 bg-black text-white font-bold rounded-xl shadow-lg hover:bg-gray-800"
                            >
                                Retry Search
                            </button>
                        </div>
                    </div>
                )}

                {/* 3. FOUND STATE */}
                {status === 'found' && (
                    <>
                        {/* Only show map if we have location data */}
                        {riderLocation ? (
                             <TrackingMap location={riderLocation} />
                        ) : (
                             <div className="w-full h-full bg-gray-200 flex items-center justify-center">Loading Map...</div>
                        )}
                        
                        <div className="absolute bottom-6 left-6 right-6 md:left-auto md:right-10 md:w-96 bg-white p-5 rounded-xl shadow-2xl z-[1000] animate-slide-up border-l-4 border-green-500">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-800">Rider Found!</h3>
                                    <p className="text-gray-600">Your delivery partner is on the way.</p>
                                </div>
                                <div className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-bold">
                                    LIVE
                                </div>
                            </div>
                            
                            <div className="mt-4 pt-4 border-t border-gray-100 flex items-center gap-4">
                                <div className="h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                                    🛵
                                </div>
                                <div>
                                    <p className="font-bold text-sm">Rider ID: {rider?.member?.slice(-4) || "..."}</p>
                                    <p className="text-xs text-gray-500">FastDelivery Partner</p>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default function TrackingPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <TrackingContent />
        </Suspense>
    );
}