import SplitwiseProvider from "@/lib/SplitwiseProvider";
import { NextAuthConfig } from "next-auth";
import { Session } from "next-auth";

type User = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  registration_status: string;
  notifications_read: string;
  notifications_count: number;
  default_currency: string;
  locale: string;
  picture: { medium: string };
};

export interface CustomSession extends Session {
  accessToken?: string;
}

const authOptions: NextAuthConfig = {
  providers: [SplitwiseProvider({
    clientId: process.env.SPLITWISE_CLIENT_ID,
    clientSecret: process.env.SPLITWISE_CLIENT_SECRET,
  })],
  callbacks: {
    async jwt({ token, account }) {
      // Persist the OAuth access_token to the token right after signin
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    async session({ session, token, user }) {
      // Send properties to the client, like an access_token from a provider.
      (session as CustomSession).accessToken = token.accessToken as string;
      return session;
    },
  },
  trustHost: true,
};

export default authOptions satisfies NextAuthConfig;
