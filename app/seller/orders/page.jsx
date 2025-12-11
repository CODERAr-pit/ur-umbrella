'use client';
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext"; // Don't forget this import
import Footer from "@/components/seller/Footer";
import Loading from "@/components/Loading";
import { useSession } from "next-auth/react";
import { assets } from "@/assets/assets";

const Orders = () => {

    const { currency } = useAppContext();

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const { data: session, status } = useSession();

    useEffect(() => {
        if (status === "authenticated") {
            fetchSellerOrders();
        } else if (status === "unauthenticated") {
            setLoading(false);
        }
    }, [status]);

    const fetchSellerOrders = async () => {
        try {
            const response = await fetch('/api/seller/orders'); // Fixed URL (usually plural 'orders')
            const data = await response.json();
            
            if (response.ok) {
                // The API returns { msg: "...", data: [...] }
                setOrders(data.data); 
            } else {
                console.error("Failed:", data.msg);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="flex-1 h-screen overflow-scroll flex flex-col justify-between text-sm">
            {loading ? <Loading /> : <div className="md:p-10 p-4 space-y-5">
                <h2 className="text-lg font-medium">Orders</h2>
                <div className="max-w-4xl rounded-md">
                    {orders.map((order) => (
                        <div key={order._id} className="flex flex-col md:flex-row gap-5 justify-between p-5 border-t border-gray-300">
                            <div className="flex-1 flex gap-5 max-w-80">
                                <Image
                                    className="max-w-16 max-h-16 object-cover"
                                    src={assets.box_icon}
                                    alt="box_icon"
                                />
                                <p className="flex flex-col gap-3">
                                    <span className="font-medium">
                                        {/* FIX 1: Access 'productId', not 'product' */}
                                        {order.items.map((item) => 
                                            (item.productId?.name || "Unknown Product") + ` x ${item.quantity}`
                                        ).join(", ")}
                                    </span>
                                    <span>Items : {order.items.length}</span>
                                </p>
                            </div>
                            <div>
                                <p>
                                    <span className="font-medium">{order.address?.street}</span>
                                    <br />
                                    <span>{order.address?.city}</span>
                                    <br />
                                    <span>{`${order.address?.state}, ${order.address?.pincode}`}</span>
                                    <br />
                                    {/* FIX 2: Schema uses 'phone', not 'phoneNumber' */}
                                    <span>{order.address?.phone}</span>
                                </p>
                            </div>
                            <p className="font-medium my-auto">{currency}{order.amount}</p>
                            <div>
                                <p className="flex flex-col">
                                    <span>Method : COD</span>
                                    {/* FIX 3: Schema uses 'purchaseDate' */}
                                    <span>Date : {new Date(order.purchaseDate).toLocaleDateString()}</span>
                                    <span>Status : {order.status}</span>
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>}
            <Footer />
        </div>
    );
};

export default Orders;