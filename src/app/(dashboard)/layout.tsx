import { sendRequest } from "@/utils/api";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/auth";
import DashboardLayoutUI from "@/components/layout";
const DashboardLayout = async ({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) => {
    const session = await getServerSession(authOptions);
    return (
        <>
            <DashboardLayoutUI>
                {children}
            </DashboardLayoutUI>
        </>
    )
}
export default DashboardLayout;