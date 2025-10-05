import { sendRequest } from "@/utils/api";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/auth";
import AuthLayoutUI from "@/components/auth/layout";

const AuthLayout = async ({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) => {
    const session = await getServerSession(authOptions);
    return (
        <AuthLayoutUI>
            {children}
        </AuthLayoutUI>
    )
}
export default AuthLayout;