require('dotenv').config(); 

const express = require('express');
const http = require('http');
const next = require('next');
const socketIo = require('socket.io');
const redis = require('./lib/redis'); // Imports cleanly now

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
    const server = express();
    const httpServer = http.createServer(server);
    const io = socketIo(httpServer);

    io.on('connection', (socket) => {-
        console.log('Socket connected:', socket.id);

        // ===========================================
        // 1. RIDER SETUP
        // ===========================================
        socket.on('rider-login', (riderId) => {
            socket.join(`rider_${riderId}`);
            console.log(`Rider ${riderId} logged in.`);
        });

        // ===========================================
        // 2. RIDER LOCATION UPDATES
        // ===========================================
        // ===========================================
        // 2. RIDER LOCATION UPDATES
        // ===========================================
    socket.on("rider-location-update", async (data) => {
    const { riderId, latitude, longitude, status } = data;

    console.log("📍 Location Update Rx:", { riderId, lat: latitude, lng: longitude });

    // Safety check
    if (!riderId || latitude == null || longitude == null) {
        console.error("❌ Missing Data! Skipping Redis update.");
        return; 
    }

    try {
        // ✅ CORRECT: Use the object-based API for @upstash/redis
        await redis.geoadd("active_riders", {
            longitude: parseFloat(longitude),
            latitude: parseFloat(latitude),
            member: String(riderId)
        });

        await redis.set(`rider_status:${riderId}`, status || 'idle', { ex: 30 });

        if (status === 'busy' && data.activeOrderId) {
            io.to(`order_${data.activeOrderId}`).emit("update-rider-location", { 
                latitude, 
                longitude 
            });
        }
        
        console.log("✅ Redis location updated successfully");
        
    } catch (err) {
        console.error("🔥 Redis Update Error:", err);
    }
});

        // ===========================================
        // 3. CUSTOMER: FIND RIDERS (BROADCAST)
        // ===========================================
        // ===========================================

       // ===========================================
        // 3. CUSTOMER: FIND RIDERS (WITH 15s RETRY LOOP)
        // ===========================================
        
        // Helper to pause execution (Sleep)
        const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

        socket.on("find-nearest-rider", async (data) => {
            console.log("--- FIND RIDER REQUEST RECEIVED ---");
            const { userLat, userLong, orderId } = data;

            if (!orderId || orderId === 'undefined') return;

            console.log(`🔍 Order ${orderId}: Starting 15s Search...`);
            socket.join(`order_${orderId}`);

            let riderFound = false;
            const maxAttempts = 5; // 5 tries
            const interval = 3000; // 3 seconds wait between tries

            for (let attempt = 1; attempt <= maxAttempts; attempt++) {
                try {
                    console.log(`⏳ Attempt ${attempt}/${maxAttempts} to find rider...`);

                    // 1. CALL UPSTASH REST API
                    const upstashUrl = process.env.UPSTASH_REDIS_REST_URL;
                    const upstashToken = process.env.UPSTASH_REDIS_REST_TOKEN;

                    const response = await fetch(`${upstashUrl}/geosearch/active_riders/FROMLONLAT/${userLong}/${userLat}/BYRADIUS/50/km/WITHDIST`, {
                        headers: { Authorization: `Bearer ${upstashToken}` }
                    });

                    const json = await response.json();
                    const rawResults = json.result; 

                    // 2. CHECK RESULTS
                    if (rawResults && rawResults.length > 0) {
                        
                        let validRiderFoundInBatch = false;

                        for (const item of rawResults) {
                            const riderId = item[0]; 
                            
                            // Check if rider is actually FREE (idle)
                            const status = await redis.get(`rider_status:${riderId}`);
                            
                            if (status === 'idle' || !status) {
                                console.log(`✅ FOUND RIDER: ${riderId}`);
                                
                                io.to(`rider_${riderId}`).emit("new-order-request", { 
                                    orderId: orderId, 
                                    pickupLocation: { lat: userLat, lng: userLong }
                                });
                                
                                validRiderFoundInBatch = true;
                            }
                        }

                        // If we successfully pinged at least one rider, stop the loop
                        if (validRiderFoundInBatch) {
                            riderFound = true;
                            break; // 🛑 EXIT LOOP
                        }
                    }

                    // If no rider found this time, wait before next try
                    if (attempt < maxAttempts) {
                        await sleep(interval); 
                    }

                } catch (err) {
                    console.error("🔥 SEARCH ERROR:", err);
                    await sleep(interval); // Wait even on error
                }
            }

            // 3. FINAL FAILURE MESSAGE (Only sent after all attempts fail)
            if (!riderFound) {
                console.log("❌ Timeout: No riders found after 15s.");
                socket.emit("order-status", { status: "No Riders Available" });
            }
        });
        // ===========================================
        // 4. RIDER ACCEPTS JOB
        // ===========================================
        socket.on("rider-accept-order", async (data) => {
            const { riderId, orderId } = data;

            const isTaken = await redis.get(`order_lock:${orderId}`);
            if (isTaken) {
                socket.emit("order-missed", "Too late! Another rider took it.");
                return;
            }

            console.log(`✅ Match: Rider ${riderId} -> Order ${orderId}`);

            await redis.set(`order_lock:${orderId}`, riderId);
            await redis.set(`rider_status:${riderId}`, 'busy');

            socket.join(`order_${orderId}`);
            io.to(`order_${orderId}`).emit("rider-found", { riderId });
            socket.emit("order-confirmed", { orderId });
        });

    }); 

    server.use((req, res) => handle(req, res));

    const PORT = process.env.PORT || 3000;
    httpServer.listen(PORT, (err) => {
        if (err) throw err;
        console.log(`> Ready on http://localhost:${PORT}`);
    });
});