import NextAuth from "next-auth"

import { JWT } from "next-auth/jwt"

interface IUSer {
    _id: string,
    userName: string,
    email: string,
    address: string,
    isVerify: boolean,
    type: string,
    name: string,
    role: string,
    gender: string,
    age: number
}
type IProfile = {
    name: string;
    email: string;
    role: "admin" | "seller" | "customer";
};

interface IUserLogin extends IProfile {
    access_token: string;
}
declare module "next-auth/jwt" {
    /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
    interface JWT extends IUserLogin {
        // /** OpenID ID Token */
        // user: IUSer,
        // // refresh_token: string,
        // access_token: string,
        // // access_expire: number;
        // error: string,
        // role: string

    }
}
declare module "next-auth" {
    /**
     * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
     */

    interface Session extends IUserLogin {

        /** The user's postal address. */

    }
}