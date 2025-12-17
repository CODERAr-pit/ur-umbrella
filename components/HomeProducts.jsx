import React, { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import { useAppContext } from "@/context/AppContext";

const HomeProducts = () => {
  const { router } = useAppContext();
  
  // 1. Create local state to store Database Products
  const [dbProducts, setDbProducts] = useState([]);

  // 2. Function to fetch data from your API
  const fetchProducts = async () => {
    try {
      // Assuming you have a GET route at /api/product
      const response = await fetch('/api/product/show'); 
      const data = await response.json();

      if (response.ok) {
        // If your API returns { products: [...] }, use data.products
        // If it returns an array directly, use data
        setDbProducts(data.products || data); 
      } else {
        console.error("Failed to fetch products");
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  // 3. Run the fetch when component loads
  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="flex flex-col items-center pt-14">
      <p className="text-2xl font-medium text-left w-full">Popular products</p>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 flex-col items-center gap-6 mt-6 pb-14 w-full">
        {/* 4. Map over 'dbProducts' instead of 'products' from context */}
        {dbProducts.length > 0 ? (
          dbProducts.slice(0, 10).map((product, index) => ( // optional: slice(0,10) to show only top 10
            <ProductCard key={index} product={product} />
          ))
        ) : (
          // Optional: Loading Skeleton or message
          <p className="col-span-full text-center text-gray-400">Loading products...</p>
        )}
      </div>

      <button 
        onClick={() => { router.push('/all-products') }} 
        className="px-12 py-2.5 border rounded text-gray-500/70 hover:bg-slate-50/90 transition"
      >
        See more
      </button>
    </div>
  );
};

export default HomeProducts;