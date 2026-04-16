// src/app/api/auth/[...nextauth]/route.ts

import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
const baseUrl = process.env.NEXT_PUBLIC_API_URL;

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      userId: string;
      image: string;
      role: string;
      state: string;
    };
    accessToken: string;
  }

  interface User {
    id: string;
    name: string;
    userId: string;
    image: string;
    role: string;
    state: string;
    token: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    name: string;
    userId: string;
    image: string;
    role: string;
    state: string;
    accessToken: string;
  }
}

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        Id: { label: "Admin Id", type: "text" },
        password: { label: "Password", type: "password" },
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      async authorize(credentials): Promise<any> {
        if (!credentials?.Id || !credentials?.password) {
          throw new Error("Id and password are required");
        }

        try {
          const res = await fetch(`${baseUrl}/users/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              Id: credentials.Id,
              password: credentials.password,
            }),
          });

          console.log("Login response status:", res.status);

          const data = await res.json();

          if (!res.ok || !data.success) {
            throw new Error(data.message || "Login failed");
          }

          const user = data.data?.user;
          const token = data.data?.token;

          if (!user || !token) {
            throw new Error("Invalid response from server");
          }
          console.log(user);

          return {
            id: user.id,
            name: user.username,
            userId: user.Id,
            image: user.avatar?.url || "",
            role: user.role,
            state: user.state,
            token: token,
          };
        } catch (error) {
          console.error("Authorize error:", error);
          if (error instanceof Error) {
            throw new Error(error.message);
          }
          throw new Error("Invalid credentials");
        }
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        return {
          ...token,
          id: user.id,
          name: user.name,
          userId: user.userId,
          image: user.image,
          role: user.role,
          state: user.state,
          accessToken: user.token,
        };
      }

      if (trigger === "update" && session) {
        return { ...token, ...session.user };
      }

      return token;
    },

    async session({ session, token }) {
      if (token) {
        session.user = {
          ...session.user,
          id: token.id,
          name: token.name,
          userId: token.userId,
          image: token.image,
          role: token.role,
          state: token.state,
        };
        session.accessToken = token.accessToken;
      }
      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
