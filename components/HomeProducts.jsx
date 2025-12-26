import React from "react";
import ProductCard from "./ProductCard";
import { dbConnect } from "@/lib/DbConnect";
import product from "@/models/product";
import Seemore from "./Seemore";

// In Server Components, props is the first argument
const HomeProducts = async (props) => {
  // Check if page comes from a direct prop OR from searchParams (URL)
  const pageNumber = props.page || (await props.searchParams)?.page || 1;
  const page = parseInt(pageNumber);
  
  let skip = (page - 1) * 10;
  
  await dbConnect();
  const productsRaw = await product.find({})
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