"use server";

import { authOptions } from "@/app/api/auth/[...nextauth]/auth";
import { getServerSession } from "next-auth";
import { sendRequest } from "@/utils/api"
// 🟣 Lấy dữ liệu dashboard admin
export const getAdminDashboard = async () => {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.access_token) {
            throw new Error("Unauthorized: missing token");
        }

        const res = await sendRequest<IBackendRes<IAdminDashboard>>({
            method: "GET",
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/dashboard/admin`,
            headers: {
                Authorization: `Bearer ${session.access_token}`,
            },
        });

        return res;
    } catch (error) {
        console.error("❌ getAdminDashboard error:", error);
        return { statusCode: 500, message: "Lỗi khi lấy dữ liệu dashboard admin" };
    }
};
