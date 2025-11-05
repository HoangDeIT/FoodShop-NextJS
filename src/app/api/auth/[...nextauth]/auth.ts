import dayjs from "dayjs";
import { AuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github"
import GOOGLE_FONT_PROVIDER from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials";
import { sendRequest } from "@/utils/api";
import { JWT } from "next-auth/jwt";
// async function refreshAccessToken() {
//     try {
//         const res = await sendRequest<IBackendRes<JWT>>({
//             url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/refresh`,
//             method: "POST",
//         })
//         if (res.error) {
//             return {
//                 ...res.data,
//                 error: "RefreshAccessTokenError", // This is used in the front-end, and if present, we can force a re-login, or similar
//             }
//         }

//         return {
//             ...token,
//             access_token: res.data?.access_token ?? "",
//             refresh_token: res.data?.refresh_token ?? "",
//             access_expire: dayjs(new Date()).add(
//                 +(process.env.TOKEN_EXPIRE_NUMBER as string), (process.env.TOKEN_EXPIRE_UNIT as any)
//             ).unix(),
//             error: ""
//         }
//     } catch (error) {
//         console.log(error)

//         return {
//             ...token,
//             error: "RefreshAccessTokenError",
//         }
//     }
// }
export const authOptions: AuthOptions = {
    // Configure one or more authentication providers
    secret: process.env.NEXTAUTH_SECRET,
    // Configure one or more authentication providers
    providers: [
        GithubProvider({
            clientId: process.env.GITHUB_ID!,
            clientSecret: process.env.GITHUB_SECRET!,
            authorization: {
                params: {
                    prompt: "select_account",
                },
            },
        }),
        GOOGLE_FONT_PROVIDER({
            clientId: process.env.GOOGLE_ID!,
            clientSecret: process.env.GOOGLE_SECRET!,
            authorization: {
                params: {
                    prompt: "select_account",
                },
            },
        }),
        // ...add more providers here
        CredentialsProvider({
            // The name to display on the sign in form (e.g. "Sign in with...")
            name: "Credentials",
            // `credentials` is used to generate a form on the sign in page.
            // You can specify which fields should be submitted, by adding keys to the `credentials` object.
            // e.g. domain, username, password, 2FA token, etc.
            // You can pass any HTML attribute to the <input> tag through the object.
            credentials: {
                username: { label: "Username", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials, req) {
                console.log({
                    username: credentials?.username,
                    password: credentials?.password
                })
                // Add logic here to look up the user from the credentials supplied
                const res = await sendRequest<IBackendRes<JWT>>({
                    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/login`,
                    method: "POST",
                    body: {
                        username: credentials?.username,
                        password: credentials?.password
                    }
                })

                if (res) {
                    // Any object returned will be saved in `user` property of the JWT
                    return res.data as any;
                } else {
                    // If you return null then an error will be displayed advising the user to check their details.
                    //@ts-ignore
                    throw new Error(res?.message as string)

                    // You can also Reject this callback with an Error thus the user will be sent to the error page with the error message as a query parameter
                }
            }
        })
    ],
    callbacks: {
        async session({ session, token, user }) {


            if (token) {
                session.access_token = token.access_token,
                    session.email = token.email!,
                    session.name = token.name!,
                    session.role = token.role,
                    session._id = token._id
                // session.access_expire = token.access_expire;
            }
            return session

        },
        async jwt({ token, user, account, profile, trigger, session }) {
            console.log("3")

            if (trigger === "signIn" && account?.provider !== 'credentials') {

                const res = await sendRequest<IBackendRes<JWT>>({
                    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/social-network`,
                    method: "POST",
                    body: {
                        type: account?.provider.toLocaleUpperCase(),
                        email: user.email,
                        image: user.image,
                        name: user.name
                    }
                });
                if (res.data) {
                    token.access_token = res.data.access_token,
                        token._id = res.data._id
                    token.email = res.data.email,
                        token.name = res.data.name,
                        token.role = res.data.role
                    // token.access_expire = dayjs(new Date()).add(
                    //     +(process.env.TOKEN_EXPIRE_NUMBER as string), (process.env.TOKEN_EXPIRE_UNIT as any)
                    // ).unix();
                }
            }
            if (trigger === "signIn" && account?.provider === 'credentials') {

                //@ts-ignore
                token = user;
                //@ts-ignore
                // token.access_expire = dayjs(new Date()).add(
                //     +(process.env.TOKEN_EXPIRE_NUMBER as string), (process.env.TOKEN_EXPIRE_UNIT as any)
                // ).unix();
            }
            // const isTimeAfter = dayjs(dayjs(new Date())).isAfter(dayjs.unix((token?.access_expire as number ?? 0)));
            // if (isTimeAfter) {
            //     return refreshAccessToken()
            // }
            return token;
        },
        async redirect({ url, baseUrl }) {
            return `${baseUrl}/redirect`
        },
        async signIn({ user, account, profile, email, credentials }) {

            const isAllowedToSignIn = true
            if (isAllowedToSignIn) {
                return true
            } else {
                // Return false to display a default error message
                return false
                // Or you can return a URL to redirect to:
                // return '/unauthorized'
            }
        }
        // async signIn({ user, account, profile, email, credentials }) {
        //     // if (account?.provider !== 'credentials') {
        //     //     const res = await sendRequest<IBackendRes<JWT>>({
        //     //         url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/social-network`,
        //     //         method: "POST",
        //     //         body: {
        //     //             type: account?.provider.toLocaleUpperCase(),
        //     //             email: user.email,
        //     //             image: user.image,
        //     //             name: user.name
        //     //         }
        //     //     });
        //     //     if (res.data?.role === "ADMIN") {
        //     //         return "/admin"
        //     //     } else {
        //     //         return "/"
        //     //     }
        //     // }
        //     console.log(user)
        //     console.log(account)
        //     console.log(profile)
        //     console.log(email)
        //     console.log(credentials)
        //     //@ts-ignore
        //     if (user.user.role === "ADMIN") {
        //         console.log("dsadasasd");
        //         return "/admin"

        //         //@ts-ignore
        //     } else if (user.user.role === "USER") {
        //         return "/"
        //     }
        //     else {
        //         // Return false to display a default error message
        //         return false
        //         // Or you can return a URL to redirect to:
        //         // return '/unauthorized'
        //     }
        // }
    },
    pages: {
        signIn: '/login',
    }
}
