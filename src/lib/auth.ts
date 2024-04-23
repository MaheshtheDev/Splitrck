import NextAuth, { NextAuthConfig } from "next-auth";
import authOptions from "./auth.config";

export const { auth, handlers, signIn, signOut } = NextAuth(authOptions);
