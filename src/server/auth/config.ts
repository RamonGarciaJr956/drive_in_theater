import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { type DefaultSession, type NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import * as bcrypt from "bcrypt";
import { randomUUID } from 'crypto';
import { encode as defaultEncode } from "next-auth/jwt";

import { db } from "~/server/db";
import {
  accounts,
  sessions,
  users,
  verificationTokens,
} from "~/server/db/schema";
import { eq } from "drizzle-orm";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      // ...other properties
      // role: UserRole;
    } & DefaultSession["user"];
  }

  // interface User {
  //   // ...other properties
  //   // role: UserRole;
  // }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authConfig = {
  providers: [
    /**
     * ...add more providers here.
     *
     * Most other providers require a bit more work than the Discord provider. For example, the
     * GitHub provider requires you to add the `refresh_token_expires_in` field to the Account
     * model. Refer to the NextAuth.js docs for the provider you want to use. Example:
     *
     * @see https://next-auth.js.org/providers/github
     */
    GoogleProvider({
      clientId: process.env.AUTH_GOOGLE_CLIENT_ID!,
      clientSecret: process.env.AUTH_GOOGLE_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true
    }),
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const user = await db.select().from(users).where(eq(users.email, credentials.email as string)).limit(1);

          if (!user || user.length === 0) {
            throw new Error('UserNotFound');
          }

          const foundUser = user[0];

          if (!foundUser?.password) {
            throw new Error('PasswordNotSet');
          }

          const storedHash = foundUser.password;

          const validPassword = await bcrypt.compare(credentials.password as string, storedHash);

          if (!validPassword) {
            throw new Error('InvalidCredentials');
          }

          const { ...userWithoutPassword } = foundUser;

          return userWithoutPassword;
        } catch (error) {
          console.error('Authorization error:', error);
          return null;
        }
      },
    })
  ],
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens,
  }),
  callbacks: {
    async jwt({ token, account }) {
      if (account?.provider === "credentials") {
        token.credentials = true;
      }
      return token;
    },
    session: ({ session, user }) => ({
      ...session,
      user: {
        ...session.user,
        id: user.id,
      },
    }),
  },
  jwt: {
    encode: async function (params) {
      if (params.token?.credentials) {
        const sessionToken: string = randomUUID();
        //expires in 1 day
        const expiresAt = new Date(Date.now() + 1 * 24 * 60 * 60 * 1000);

        await db.insert(sessions).values({
          sessionToken: sessionToken,
          userId: params.token.sub!,
          expires: expiresAt
        });

        return sessionToken;
      }

      return defaultEncode(params);
    },
  },
  session: {
    maxAge: 1 * 24 * 60 * 60,
  },
  secret: process.env.AUTH_SECRET!,
} satisfies NextAuthConfig;
