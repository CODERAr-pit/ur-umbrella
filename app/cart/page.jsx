'use client'
import React from "react";
import { assets } from "@/assets/assets";
import OrderSummary from "@/components/OrderSummary";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import { useAppContext } from "@/context/AppContext";

const Cart = () => {

  const { products, router, cartItems, addToCart, updateCartQuantity, getCartCount } = useAppContext();

  // Calculate if cart is actually empty (checking quantities)
  const isCartEmpty = getCartCount() === 0;

  return (
    <>
      <Navbar />
      <div className="flex flex-col md:flex-row gap-10 px-6 md:px-16 lg:px-32 pt-14 mb-20 min-h-[50vh]">
        
        {/* LEFT SIDE: CART ITEMS */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-8 border-b border-gray-500/30 pb-6">
            <p className="text-2xl md:text-3xl text-gray-500">
              Your <span className="font-medium text-orange-600">Cart</span>
            </p>
            <p className="text-lg md:text-xl text-gray-500/80">{getCartCount()} Items</p>
          </div>

          {/* EMPTY CART MESSAGE */}
          {isCartEmpty ? (
             <div className="flex flex-col items-center justify-center py-10 text-center">
                <p className="text-gray-500 text-lg mb-4">Your cart is currently empty.</p>
                <button 
                  onClick={()=> router.push('/all-products')} 
                  className="px-6 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 transition"
                >
                  Shop Now
                </button>
             </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto">
                <thead className="text-left">
                  <tr>
                    <th className="text-nowrap pb-6 md:px-4 px-1 text-gray-600 font-medium">Product Details</th>
                    <th className="pb-6 md:px-4 px-1 text-gray-600 font-medium">Price</th>
                    <th className="pb-6 md:px-4 px-1 text-gray-600 font-medium">Quantity</th>
                    <th className="pb-6 md:px-4 px-1 text-gray-600 font-medium">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.keys(cartItems).map((itemId) => {
                    // FIX 1: Use loose equality (==) to match String IDs vs Number IDs
                    const product = products.find(p => p._id == itemId);

                    // Safety Check: If product not found in DB or quantity is 0, skip it
                    if (!product || cartItems[itemId] <= 0) return null;

                    return (
                      <tr key={itemId}>
                        <td className="flex items-center gap-4 py-4 md:px-4 px-1">
                          <div>
                            <div className="rounded-lg overflow-hidden bg-gray-500/10 p-2">
                              <Image
                                // FIX 2: Safety check for image array
                                src={product.image?.[0] || assets.box_icon}
                                alt={product.name}
                                className="w-16 h-auto object-cover mix-blend-multiply"
                                width={1280}
                                height={720}
                              />
                            </div>
                            <button
                              className="md:hidden text-xs text-orange-600 mt-1"
                              onClick={() => updateCartQuantity(product._id, 0)}
                            >
                              Remove
                            </button>
                          </div>
                          <div className="text-sm hidden md:block">
                            <p className="text-gray-800 font-medium">{product.name}</p>
                            <button
                              className="text-xs text-orange-600 mt-1 hover:text-orange-800"
                              onClick={() => updateCartQuantity(product._id, 0)}
                            >
                              Remove
                            </button>
                          </div>
                        </td>
                        <td className="py-4 md:px-4 px-1 text-gray-600">
                           ${product.offerPrice || product.price}
                        </td>
                        <td className="py-4 md:px-4 px-1">
                          <div className="flex items-center md:gap-2 gap-1 border rounded-md px-2 py-1 w-fit">
                            <button onClick={() => updateCartQuantity(product._id, cartItems[itemId] - 1)}>
                              <Image
                                src={assets.decrease_arrow}
                                alt="decrease"
                                className="w-3 h-3"
                              />
                            </button>
                            <input 
                              onChange={(e) => updateCartQuantity(product._id, Number(e.target.value))} 
                              type="number" 
                              value={cartItems[itemId]} 
                              className="w-8 border-none outline-none text-center appearance-none text-sm"
                            />
                            <button onClick={() => addToCart(product._id)}>
                              <Image
                                src={assets.increase_arrow}
                                alt="increase"
                                className="w-3 h-3"
                              />
                            </button>
                          </div>
                        </td>
                        <td className="py-4 md:px-4 px-1 text-gray-600 font-medium">
                          ${((product.offerPrice || product.price) * cartItems[itemId]).toFixed(2)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {!isCartEmpty && (
            <button onClick={()=> router.push('/all-products')} className="group flex items-center mt-6 gap-2 text-orange-600 hover:text-orange-700 transition">
              <Image
                className="group-hover:-translate-x-1 transition"
                src={assets.arrow_right_icon_colored}
                alt="arrow_right"
              />
              Continue Shopping
            </button>
          )}
        </div>

        {/* RIGHT SIDE: ORDER SUMMARY */}
        {/* Only show summary if cart is not empty */}
        {!isCartEmpty && <OrderSummary />}
        
      </div>
    </>
  );
};

export default Cart;