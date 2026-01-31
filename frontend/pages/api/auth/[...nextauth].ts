import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: NextAuthOptions = {
  providers: [
    // Google OAuth Provider
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    // Email/Password Provider (existing)
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          console.log("❌ Missing credentials");
          return null;
        }

        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";
        const loginUrl = `${apiUrl}/auth/login`;
        
        console.log("🔐 Attempting login to:", loginUrl);
        console.log("📧 Email:", credentials.email);

        try {
          const res = await fetch(loginUrl, {
            method: "POST",
            headers: { 
              "Content-Type": "application/json",
              "Accept": "application/json",
            },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          });

          console.log("📡 Response status:", res.status);

          if (!res.ok) {
            const errorData = await res.json().catch(() => ({ detail: "Unknown error" }));
            console.log("❌ Login failed:", errorData);
            return null;
          }

          const data = await res.json();
          console.log("✅ Login success! User ID:", data.user_id);

          if (data.access_token && data.user_id) {
            return {
              id: data.user_id,
              email: data.email,
              accessToken: data.access_token,
              name: data.email,
            };
          }

          console.log("❌ Missing access_token or user_id in response");
          return null;
        } catch (error) {
          console.error("❌ Network error during login:", error);
          return null;
        }
      },
    }),
  ],

  callbacks: {
    async signIn({ user, account, profile }) {
      // Handle Google sign-in
      if (account?.provider === "google") {
        try {
          const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";
          
          // Check if user exists or create new user
          const res = await fetch(`${apiUrl}/auth/google-signin`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: user.email,
              name: user.name,
              google_id: account.providerAccountId,
            }),
          });

          if (!res.ok) {
            console.error("Google sign-in failed");
            return false;
          }

          const data = await res.json();
          
          // Store the access token and user_id
          user.accessToken = data.access_token;
          user.id = data.user_id;

          return true;
        } catch (error) {
          console.error("Error during Google sign-in:", error);
          return false;
        }
      }

      return true;
    },

    async jwt({ token, user, account }) {
      if (user) {
        token.accessToken = user.accessToken;
        token.id = user.id;
      }
      return token;
    },

    async session({ session, token }) {
      if (token) {
        session.accessToken = token.accessToken as string;
        session.user.id = token.id as string;
      }
      return session;
    },
  },

  session: { 
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  
  pages: { 
    signIn: "/login",
    error: "/login",
  },
  
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
};

export default NextAuth(authOptions);