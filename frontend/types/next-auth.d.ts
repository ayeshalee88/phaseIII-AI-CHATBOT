import { DefaultSession } from "next-auth";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    accessToken?: string;
    user: {
      /** The user's postal address. */
      id: string;
      /** The user's email address. */
      email: string;
      /** The user's name. */
      name: string;
    } & DefaultSession["user"];
  }

  /** Returned by the `jwt` callback and used in the `session` callback */
  interface JWT {
    /** OpenID Connect ID Token */
    idToken?: string;
    accessToken?: string;
    refreshToken?: string;
    accessTokenExpires?: number;
  }
}