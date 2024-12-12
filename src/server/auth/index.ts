import NextAuth from "next-auth";
//import { unstable_cache } from "next/cache";

import { authConfig } from "./config";

/*const { auth: uncachedAuth, handlers, signIn, signOut } = NextAuth(authConfig);

const auth = unstable_cache(uncachedAuth);

export { auth, handlers, signIn, signOut };*/

export const {
    auth,
    handlers,
    signIn,
    signOut
} = NextAuth(authConfig);
