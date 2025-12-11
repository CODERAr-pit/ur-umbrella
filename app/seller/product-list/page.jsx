'use client'
import React, { useEffect, useState } from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";
import Footer from "@/components/seller/Footer";
import Loading from "@/components/Loading";

const ProductList = () => {

  const { router } = useAppContext();
  const [msg, setMsg] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true); // Start loading as true

  const fetchSellerProduct = async () => {
    try {
      const response = await fetch('/api/seller/product'); 
      const data = await response.json();

      if (response.ok) {
        setProducts(data.data);
      } else {
        setMsg(data.msg || "Unable to load products");
      }
    } catch (error) {
      console.error(error);
      setMsg("Error loading data");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchSellerProduct();
  }, []);

  return (
    <div className="flex-1 min-h-screen flex flex-col justify-between">
      {loading ? <Loading /> : (
        <div className="w-full md:p-10 p-4">
          <h2 className="pb-4 text-lg font-medium">All Products</h2>
          <div className="flex flex-col items-center max-w-4xl w-full overflow-hidden rounded-md bg-white border border-gray-500/20">
            <table className="table-fixed w-full overflow-hidden">
              <thead className="text-gray-900 text-sm text-left bg-gray-100">
                <tr>
                  <th className="w-2/3 md:w-2/5 px-4 py-3 font-medium truncate">Product</th>
                  <th className="px-4 py-3 font-medium truncate max-sm:hidden">Category</th>
                  <th className="px-4 py-3 font-medium truncate">Price</th>
                  <th className="px-4 py-3 font-medium truncate max-sm:hidden">Action</th>
                </tr>
              </thead>
              <tbody className="text-sm text-gray-500">
                {products.length > 0 ? products.map((product) => (
                  <tr key={product._id} className="border-t border-gray-500/20">
                    <td className="md:px-4 pl-2 md:pl-4 py-3 flex items-center space-x-3 truncate">
                      <div className="bg-gray-500/10 rounded p-2 min-w-16">
                
                        <Image
                          src={product.images && product.images[0] ? product.images[0] : assets.box_icon}
                          alt="product"
                          className="w-16 h-16 object-cover"
                          width={64}
                          height={64}
                        />
                      </div>
                      <span className="truncate w-full font-medium text-gray-800">
                        {product.name}
                      </span>
                    </td>
                    <td className="px-4 py-3 max-sm:hidden">{product.category}</td>
        
                    <td className="px-4 py-3">${product.price}</td>
                    <td className="px-4 py-3 max-sm:hidden">
                      <button 
                        onClick={() => router.push(`/product/${product._id}`)} 
                        className="flex items-center gap-1 px-3 py-1.5 bg-orange-600 hover:bg-orange-700 text-white rounded text-xs"
                      >
                        <span className="hidden md:block">Visit</span>
                        <Image
                          className="h-3 w-3 invert"
                          src={assets.redirect_icon}
                          alt="redirect"
                        />
                      </button>
                    </td>
                  </tr>
                )) : (
                   <tr>
                     <td colSpan="4" className="text-center py-10">No Products Found</td>
                   </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
      
      {msg && <p className="text-center text-red-500 mt-4">{msg}</p>}
      
      <Footer />
    </div>
  );
};

export default ProductList;