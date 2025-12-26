
import React from "react";
import HeaderSlider from "@/components/HeaderSlider";
import HomeProducts from "@/components/HomeProducts";
import Banner from "@/components/Banner";
import NewsLetter from "@/components/NewsLetter";
import FeaturedProduct from "@/components/FeaturedProduct";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TrackingMap from "@/components/trackingmap";
import { Suspense } from "react";
import Loading from "@/components/Loading";
import SearchBar from "@/components/SearchBar";
// REMOVED: Map import and dynamic loading

const Home = ({ searchParams }) => {
  return (
    <>
      <Navbar/>
      <div className="px-6 md:px-16 lg:px-32">
        <div className="flex w-full justify-center items-center py-2">
          <SearchBar />
        </div>
        
        <HeaderSlider />
        <Suspense fallback={<Loading />}>
        <HomeProducts searchParams={ searchParams }/>
      </Suspense>
        <FeaturedProduct />
        <Banner />
        <TrackingMap />
        <NewsLetter />
      </div>
      <Footer />
    </>
  );
};

export default Home;