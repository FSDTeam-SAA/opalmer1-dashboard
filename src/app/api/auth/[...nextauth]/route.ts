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
        challenge: { label: "Challenge", type: "text" },
        otp: { label: "Verification code", type: "text" },
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      async authorize(credentials): Promise<any> {
        if (
          !credentials?.challenge &&
          (!credentials?.Id || !credentials?.password)
        ) {
          throw new Error("Id and password are required");
        }

        try {
          const verifying = Boolean(credentials?.challenge);
          const res = await fetch(
            `${baseUrl}/users/${verifying ? "verify-otp" : "login"}`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                ...(verifying
                  ? { Authorization: `Bearer ${credentials?.challenge}` }
                  : {}),
              },
              body: JSON.stringify(
                verifying
                  ? { otp: credentials?.otp }
                  : { Id: credentials?.Id, password: credentials?.password },
              ),
            },
          );

          const data = await res.json();

          if (!res.ok || !data.success) {
            throw new Error(data.message || "Login failed");
          }

          if (data.data?.is2FA && data.data?.challengeToken)
            throw new Error(`2FA_REQUIRED:${data.data.challengeToken}`);
          const user = data.data?.user;
          const token = data.data?.token;

          if (!user || !token) {
            throw new Error("Invalid response from server");
          }

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
    async jwt({ token, user }) {
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
