import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import User from "@/models/User"; // Make sure this path is correct!
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

// Helper to connect to DB
const connectDB = async () => {
  if (mongoose.connections[0].readyState) return;
  try {
    await mongoose.connect(process.env.MONGODB_URI);
  } catch (error) {
    console.error("Error connecting to database:", error);
  }
};

const handler = NextAuth({
  // 1. Configure Providers
  providers: [
    // --- Google Provider (Login Only Strategy) ---
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),

    // --- Credentials Provider (Email/Password) ---
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        await connectDB();

        // A. Find User
        const user = await User.findOne({ email: credentials.email });
        if (!user) {
          throw new Error("No user found with this email");
        }

        // B. Check Password
        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) {
          throw new Error("Incorrect Password");
        }

        // C. Return User (Success)
        return { id: user._id.toString(), email: user.email, name: user.name };
      },
    }),
  ],

  // 2. Configure Logic (Callbacks)
  callbacks: {
    // --- SIGN IN CHECK (The "Gatekeeper") ---
    async signIn({ user, account }) {
      // Logic: If user tries to login with Google, check if they exist in DB first.
      if (account.provider === "google") {
        try {
          await connectDB();
          const existingUser = await User.findOne({ email: user.email });

          if (!existingUser) {
            // BLOCK LOGIN: User doesn't exist in DB. 
            // Redirect to Register page with error message.
            return "/register?error=Please create an account manually first to provide required details."; 
          }
          
          return true; // ALLOW LOGIN: User exists.
        } catch (error) {
          console.log("Error checking user:", error);
          return false;
        }
      }
      return true; // Allow Credentials login to pass
    },

    // --- JWT CREATION ---
    async jwt({ token, user }) {
      // If user just logged in, add their ID to the token
      if (user) {
        token.id = user.id;
      }
      return token;
    },

    // --- SESSION CREATION (What the Frontend sees) ---
    async session({ session, token }) {
      if (session.user) {
        await connectDB();
        // Fetch fresh data from DB to ensure roles (isSeller) are up to date
        const dbUser = await User.findOne({ email: session.user.email });
        
        if (dbUser) {
          session.user.id = dbUser._id.toString();
          session.user.isSeller = dbUser.isSeller || false;
          // You can add phone/address here if you need it in the Navbar
        }
      }
      return session;
    },
  },

  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login", // Redirects here if auth fails
  },
});

export { handler as GET, handler as POST };