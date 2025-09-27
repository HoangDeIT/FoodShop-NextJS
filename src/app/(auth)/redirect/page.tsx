import { authOptions } from "@/app/api/auth/[...nextauth]/auth";
import { getServerSession } from "next-auth";
import { signOut } from "next-auth/react";
import { redirect } from "next/navigation";


const RedirectPage = async () => {
    const session = await getServerSession(authOptions);
    if (session?.access_token) {
        console.log(session)
        if (session.role === "admin") {
            redirect("/admin");
        } else if (session.role === "seller") {
            redirect("/seller");
        } else {
            signOut({ callbackUrl: "/login" });
            redirect("/login")
        }
    }
}
export default RedirectPage