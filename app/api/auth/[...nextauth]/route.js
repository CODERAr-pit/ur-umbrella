import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import User from "@/models/User"; 
import Seller from "@/models/Seller"; 
import { dbConnect } from "@/lib/DbConnect"; 
import bcrypt from "bcryptjs";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),

    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        await dbConnect();

        const user = await User.findOne({ email: credentials.email });
        if (user && (await bcrypt.compare(credentials.password, user.password))) {
           return { id: user._id.toString(), name: user.user, email: user.email, role: "customer" };
        }
        
        const seller = await Seller.findOne({ email: credentials.email });
        if (seller && (await bcrypt.compare(credentials.password, seller.password))) {
           return { id: seller._id.toString(), name: seller.name, email: seller.email, role: "seller" };
        }

        return null; // Login failed
      },
    }),
  ],
  
  callbacks: {
    // ⚡ MAGIC HAPPENS HERE
    async jwt({ token, user, account }) {
      
      // Case A: Credentials Login (User object comes from authorize, has ID/Role already)
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }

      // Case B: Google Login (First time sign-in)
      // Google gives us the email, but NOT the MongoDB _id or Role. We must find it.
      if (account && account.provider === "google") {
        await dbConnect();
        
        // 1. Is this email a Customer?
        const dbUser = await User.findOne({ email: token.email });
        if (dbUser) {
          token.id = dbUser._id.toString();
          token.role = "customer";
        } 
        else {
          // 2. Is this email a Seller?
          const dbSeller = await Seller.findOne({ email: token.email });
          if (dbSeller) {
             token.id = dbSeller._id.toString();
             token.role = "seller";
          }
        }
      }

      return token;
    },

    // Pass the data from Token -> Client Session
    async session({ session, token }) {
      if (session.user) {
        session.user._id = token.id; // Correct MongoDB ID
        session.user.role = token.role; // "customer" or "seller"
      }
      return session;
    },

    // Optional: Block Google Login if email doesn't exist in DB at all
    async signIn({ account, profile }) {
      if (account.provider === "google") {
        await dbConnect();
        const userExists = await User.findOne({ email: profile.email });
        const sellerExists = await Seller.findOne({ email: profile.email });
        
        // Only allow login if they exist in one of your collections
        if (!userExists && !sellerExists) {
          return false; // Redirects to error page saying "Access Denied"
        }
      }
      return true;
    }
  },
  
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };