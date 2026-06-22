import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import { supabase } from "./supabase"

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing credentials")
        }

        const { data: user, error } = await supabase
          .from("users")
          .select("*")
          .eq("email", credentials.email)
          .single()

        if (error || !user) {
          throw new Error("Invalid credentials")
        }

        // For demo purposes - in production, store hashed passwords
        // const isPasswordValid = await bcrypt.compare(credentials.password, user.password_hash)
        
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.avatar,
        }
      }
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        const { data: existingUser } = await supabase
          .from("users")
          .select("*")
          .eq("email", user.email!)
          .single()

        if (!existingUser) {
          await supabase.from("users").insert({
            id: user.id,
            email: user.email!,
            name: user.name,
            avatar: user.image,
          })

          // Create free subscription
          await supabase.from("subscriptions").insert({
            user_id: user.id,
            plan: "free",
            status: "active",
            start_date: new Date().toISOString(),
          })
        }
      }
      return true
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
      }
      return session
    }
  },
  pages: {
    signIn: "/login",
    signOut: "/",
    error: "/login",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
}
