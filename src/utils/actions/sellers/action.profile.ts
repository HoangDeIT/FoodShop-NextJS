"use server";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth";
import { sendRequest } from "@/utils/api";
import { getServerSession } from "next-auth";

export const getProfile = async () => {
    const session = await getServerSession(authOptions);
    const res = await sendRequest<IBackendRes<IUserR>>({
        method: "GET",
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/get-profile`,
        headers: { Authorization: `Bearer ${session?.access_token}` },
    });
    return res;
};
export const updateProfile = async (payload: any) => {
    const session = await getServerSession(authOptions);
    const res = await sendRequest<IBackendRes<IUpdateUser>>({
        method: "PATCH",
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/users/seller/update`,
        body: payload,
        headers: { Authorization: `Bearer ${session?.access_token}` },
    });
    return res;
}