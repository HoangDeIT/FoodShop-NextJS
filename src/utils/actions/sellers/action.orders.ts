"use server";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth";
import { sendRequest } from "@/utils/api";
import { getServerSession } from "next-auth";
export const getOrdersBySeller = async (query: any) => {
    const session = await getServerSession(authOptions);
    const res = await sendRequest<IBackendRes<IModelPaginate<IOrder>>>({
        method: "GET",
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/orders/seller`,
        headers: { Authorization: `Bearer ${session?.access_token}` },
        queryParams: query,
    });
    return res;
};
export const updateOrderStatus = async (id: string, newStatus: string) => {
    const session = await getServerSession(authOptions);
    const res = await sendRequest<IBackendRes<IOrder>>({
        method: "PATCH",
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/orders/${id}/status`,
        headers: { Authorization: `Bearer ${session?.access_token}` },
        body: { status: newStatus },
    });
    return res;
};