"use server"

import { authOptions } from "@/app/api/auth/[...nextauth]/auth";
import { getServerSession } from "next-auth";
import { sendRequest } from "../../api";

export const getUsers = async (query: any) => {
    const session = await getServerSession(authOptions);
    const res = await sendRequest<IBackendRes<IModelPaginate<IUserR>>>({
        method: "GET",
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/users`,
        headers: { Authorization: `Bearer ${session?.access_token}`, },
        queryParams: query
    })
    return res;
}
export const createUser = async (data: ICreateUser) => {
    const session = await getServerSession(authOptions);
    const res = await sendRequest<IBackendRes<IUserR>>({
        method: "POST",
        headers: { Authorization: `Bearer ${session?.access_token}`, },
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/users`,
        body: data
    })
    return res;
}
export const updateUser = async (_id: string, data: IUpdateUser) => {
    const session = await getServerSession(authOptions);
    const res = await sendRequest<IBackendRes<IUserR>>({
        method: "PATCH",
        headers: { Authorization: `Bearer ${session?.access_token}`, },
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/users/${_id}`,
        body: data
    })
    return res
}
export const deleteUser = async (_id: string) => {
    const session = await getServerSession(authOptions);
    const res = await sendRequest<IBackendRes<IUserR>>({
        method: "DELETE",
        headers: { Authorization: `Bearer ${session?.access_token}`, },
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/users/${_id}`,
    })
    return res
}
export const getUserById = async (_id: string) => {
    const session = await getServerSession(authOptions);
    const res = await sendRequest<IBackendRes<IUserR>>({
        method: "GET",
        headers: { Authorization: `Bearer ${session?.access_token}`, },
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/users/${_id}`,
    })
    return res
}
export const uploadFile = async (file: File, folder: string) => {
    const formData = new FormData();
    formData.append("fileUpload", file);
    const res = await sendRequest<IBackendRes<{ fileName: string }>>({
        method: "POST",
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/files/upload`,
        headers: { folder_type: folder },
        body: formData
    })
    return res;
}