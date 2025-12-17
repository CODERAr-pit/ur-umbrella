"use client"
import React, { useEffect, useState } from "react";
import { assets } from "@/assets/assets";
import ProductCard from "@/components/ProductCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Image from "next/image";
import { useParams } from "next/navigation";
import Loading from "@/components/Loading";
import { useAppContext } from "@/context/AppContext";

const Product = () => {
    const { id } = useParams();
    const { products, router, addToCart } = useAppContext();

    const [mainImage, setMainImage] = useState(null);
    const [productData, setProductData] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchProductData = async () => {
        setLoading(true);
        console.log("🔍 URL ID:", id);

        // 1. First, try to find it in the Context (Fastest)
        let product = products.find(item => item._id == id);

        // 2. If NOT found in Context, fetch from API (Fallback)
        if (!product) {
            console.log("⚠️ Not in Context. Fetching from API...");
            try {
                const res = await fetch('/api/product');
                const data = await res.json();
                
                // Handle different API response structures
                const allProducts = data.products || data; 
                
                product = allProducts.find(item => item._id == id);
            } catch (error) {
                console.error("API Fetch Error:", error);
            }
        }

        // 3. Set the data if we found it (either from Context OR API)
        if (product) {
            console.log("✅ Match Found:", product.name);
            setProductData(product);
            if (product.image && product.image.length > 0) {
                setMainImage(product.image[0]);
            }
        } else {
            console.error("❌ Still No Product Found.");
        }
        setLoading(false);
    }

    useEffect(() => {
        // Only fetch if we have an ID
        if (id) {
            fetchProductData();
        }
    }, [id, products]); // Re-run if ID changes or Context updates

    // --- LOADING STATE ---
    if (loading) {
        return <Loading />;
    }

    // --- NOT FOUND STATE ---
    if (!productData) {
        return (
            <div className="min-h-screen flex flex-col">
                <Navbar />
                <div className="flex-grow flex flex-col items-center justify-center space-y-4">
                    <div className="text-6xl">🔍</div>
                    <h2 className="text-2xl font-bold text-gray-700">Product Not Found</h2>
                    <p className="text-gray-500">
                        We couldn't find a product with ID: <br />
                        <span className="font-mono bg-gray-100 px-2 py-1 rounded text-sm">{id}</span>
                    </p>
                    <button 
                        onClick={() => router.push('/')}
                        className="mt-4 px-6 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 transition"
                    >
                        Go Back Home
                    </button>
                </div>
                <Footer />
            </div>
        );
    }

    // --- SUCCESS STATE (MAIN UI) ---
    return (
        <>
            <Navbar />
            <div className="px-6 md:px-16 lg:px-32 pt-14 space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                    {/* Left Side: Images */}
                    <div className="px-5 lg:px-16 xl:px-20">
                        <div className="rounded-lg overflow-hidden bg-gray-500/10 mb-4 h-96 w-full flex items-center justify-center relative">
                            <Image
                                src={mainImage || productData.image?.[0] || assets.box_icon}
                                alt={productData.name}
                                className="w-full h-full object-contain mix-blend-multiply"
                                width={1280}
                                height={720}
                                priority
                            />
                        </div>

                        <div className="grid grid-cols-4 gap-4">
                            {productData.image?.map((image, index) => (
                                <div
                                    key={index}
                                    onClick={() => setMainImage(image)}
                                    className={`cursor-pointer rounded-lg overflow-hidden bg-gray-500/10 border-2 h-20 w-full relative ${mainImage === image ? 'border-orange-500' : 'border-transparent'}`}
                                >
                                    <Image
                                        src={image}
                                        alt={`sub-img-${index}`}
                                        className="object-contain mix-blend-multiply"
                                        fill
                                        sizes="(max-width: 768px) 25vw, 10vw"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Side: Details */}
                    <div className="flex flex-col">
                        <h1 className="text-3xl font-medium text-gray-800/90 mb-4">
                            {productData.name}
                        </h1>
                        <div className="flex items-center gap-2">
                            <div className="flex items-center gap-0.5">
                                {[...Array(4)].map((_, i) => (
                                    <Image key={i} className="h-4 w-4" src={assets.star_icon} alt="star" />
                                ))}
                                <Image className="h-4 w-4" src={assets.star_dull_icon} alt="star_dull" />
                            </div>
                            <p>(4.5)</p>
                        </div>
                        <p className="text-gray-600 mt-3">
                            {productData.description}
                        </p>
                        <p className="text-3xl font-medium mt-6">
                            ${productData.offerPrice || productData.price}
                            <span className="text-base font-normal text-gray-800/60 line-through ml-2">
                                ${productData.price}
                            </span>
                        </p>
                        <hr className="bg-gray-600 my-6" />
                        
                        <div className="flex items-center mt-10 gap-4">
                            <button onClick={() => addToCart(productData._id)} className="w-full py-3.5 bg-gray-100 text-gray-800/80 hover:bg-gray-200 transition">
                                Add to Cart
                            </button>
                            <button onClick={() => { addToCart(productData._id); router.push('/cart') }} className="w-full py-3.5 bg-orange-500 text-white hover:bg-orange-600 transition">
                                Buy now
                            </button>
                        </div>
                    </div>
                </div>

                {/* Featured Products */}
                <div className="flex flex-col items-center">
                    <div className="flex flex-col items-center mb-4 mt-16">
                        <p className="text-3xl font-medium">Featured <span className="font-medium text-orange-600">Products</span></p>
                        <div className="w-28 h-0.5 bg-orange-600 mt-2"></div>
                    </div>
                    {/* Only show featured if products exist */}
                    {products.length > 0 && (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mt-6 pb-14 w-full">
                            {products.slice(0, 5).map((product, index) => <ProductCard key={index} product={product} />)}
                        </div>
                    )}
                    <button onClick={() => router.push('/all-products')} className="px-8 py-2 mb-16 border rounded text-gray-500/70 hover:bg-slate-50/90 transition">
                        See more
                    </button>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default Product;