'use client'
import { Session } from "next-auth";
import { SessionProvider, SessionProviderProps } from "next-auth/react";

export default function NextAuthWarper({ children, session }: { children: React.ReactNode, session: Session | null }) {
    return (
        <SessionProvider session={session}>
            {children}
        </SessionProvider>
    );
}
