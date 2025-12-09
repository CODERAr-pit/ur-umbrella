import { Outfit } from "next/font/google";
import "./globals.css";
import { AppContextProvider } from "@/context/AppContext";
import { Toaster } from "react-hot-toast";
import SessionWrapper from "./SessionWrapper"; // Import the wrapper

const outfit = Outfit({ subsets: ['latin'], weight: ["300", "400", "500"] })

export const metadata = {
  title: "QuickCart - GreatStack",
  description: "E-Commerce with Next.js ",
};

export default function RootLayout({ children }) {
  return (
      <html lang="en">
        <body className={`${outfit.className} antialiased text-gray-700`} >
          <Toaster />
          
          {/* 1. SessionWrapper goes OUTSIDE (First) */}
          <SessionWrapper>
          
             {/* 2. AppContext goes INSIDE (Second) */}
             <AppContextProvider>
                {/* Now AppContext can access Session if needed later */}
                {children} 
             </AppContextProvider>
             
          </SessionWrapper>

        </body>
      </html>
  );
}