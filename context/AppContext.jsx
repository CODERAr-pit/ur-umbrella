"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
    const router = useRouter();
    const currency = "$"; // Or "₹"
    
    // 1. Initialize products as an empty array (NOT dummy data)
    const [products, setProducts] = useState([]);
    const [cartItems, setCartItems] = useState({});

    // 2. Fetch Real Products from Database
    const fetchProducts = async () => {
        try {
            const res = await fetch('/api/product');
            const data = await res.json();
            if (res.ok) {
                // Handle both { products: [...] } and direct array [...] responses
                setProducts(data.products || data);
            } else {
                console.error("Failed to load products");
            }
        } catch (error) {
            console.error("API Error:", error);
        }
    };

    // 3. Load data when App starts
    useEffect(() => {
        fetchProducts();
    }, []);

    // --- CART LOGIC (Standard Implementation) ---
    const addToCart = (itemId) => {
        let cartData = structuredClone(cartItems);
        if (cartData[itemId]) {
            cartData[itemId] += 1;
        } else {
            cartData[itemId] = 1;
        }
        setCartItems(cartData);
    };

    const getCartCount = () => {
        let totalCount = 0;
        for (const item in cartItems) {
            if (cartItems[item] > 0) {
                totalCount += cartItems[item];
            }
        }
        return totalCount;
    };

    const getCartAmount = () => {
        let totalAmount = 0;
        for (const item in cartItems) {
            if (cartItems[item] > 0) {
                // Find product in the REAL products array
                let itemInfo = products.find((product) => product._id === item);
                if (itemInfo) {
                    totalAmount += (itemInfo.offerPrice || itemInfo.price) * cartItems[item];
                }
            }
        }
        return totalAmount;
    };

    const value = {
        products, 
        currency,
        router,
        cartItems,
        addToCart,
        getCartCount,
        getCartAmount,
        setCartItems
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => {
    return useContext(AppContext);
};