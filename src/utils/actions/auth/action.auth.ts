"use server"

import { authOptions } from "@/app/api/auth/[...nextauth]/auth";
import { getServerSession } from "next-auth";
import { sendRequest } from "../../api";

export const register = async (data: any) => {
    const res = await sendRequest<IBackendRes<IUserR>>({
        method: "POST",
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/register`,
        body: data
    })
    return res;
}
export const forgotPassword = async (email: string) => {
    const res = await sendRequest<IBackendRes<IUserR>>({
        method: "POST",
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/forget-password`,
        body: { email }
    })
    return res;
}
export const resetPassword = async (data: { newPassword: string; otp: string; email: string }) => {
    const res = await sendRequest<IBackendRes<IUserR>>({
        method: "POST",
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/reset-password`,
        body: data
    })
    return res;
}
export const verifyOTP = async (data: { email: string; otp: string }) => {
    const res = await sendRequest<IBackendRes<IUserR>>({
        method: "POST",
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/verify-otp`,
        body: data
    })
    return res;
}
export const checkUser = async (data: { email: string; password: string }) => {
    const res = await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/valid-user`,
        method: "POST",
        body: {
            email: data.email,
            password: data.password
        }
    })
    return res;
}

