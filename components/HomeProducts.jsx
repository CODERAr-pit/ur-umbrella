import React from "react";
import ProductCard from "./ProductCard";
import { dbConnect } from "@/lib/DbConnect";
import product from "@/models/product";
import Seemore from "./Seemore";

// In Server Components, props is the first argument
const HomeProducts = async (props) => {
  const searchParams = await props.searchParams;
  
  // 2. Handle Pagination logic
  const pageNumber = searchParams?.page || 1;
  const page = parseInt(pageNumber);
  let skip = (page - 1) * 10;

  // 3. Handle Search logic (looking for 'q')
  const searchQuery = searchParams?.q || "";
  console.log("SEARCH QUERY RECEIVED:", searchQuery);
// Create a dynamic filter
  let filter = {};
  if (searchQuery) {
    filter = {
      $or: [
        { name: { $regex: searchQuery, $options: "i" } },        // Search in name
        { description: { $regex: searchQuery, $options: "i" } } // Search in description
      ]
    };
  }

  await dbConnect();

  // 4. Fetch filtered and paginated products
  const productsRaw = await product.find(filter)
    .sort({ createdAt: -1 }) 
    .skip(skip)
    .limit(10)
    .lean();

  const dbProducts = JSON.parse(JSON.stringify(productsRaw));

  return (
    <div className="flex flex-col items-center pt-14">
      <p className="text-2xl font-medium text-left w-full">New Listed Products</p>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mt-6 pb-14 w-full">
        {dbProducts.length > 0 ? (
          dbProducts.map((p) => (
            <ProductCard key={p._id} product={p} />
          ))
        ) : (
          <p className="col-span-full text-center py-10 text-gray-400">No more products found.</p>
        )}
      </div>

      {dbProducts.length === 10 && <Seemore page={page + 1} />}
    </div>
  );
};

export default HomeProducts;