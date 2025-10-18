"use server";

import { authOptions } from "@/app/api/auth/[...nextauth]/auth";
import { getServerSession } from "next-auth";
import { sendRequest } from "../../api";

// 🟢 Lấy danh sách category (có phân trang, lọc, tìm kiếm)
export const getCategories = async (query: any) => {
    const session = await getServerSession(authOptions);
    const res = await sendRequest<IBackendRes<IModelPaginate<ICategoryR>>>({
        method: "GET",
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/categories`,
        headers: {
            Authorization: `Bearer ${session?.access_token}`,
        },
        queryParams: query,
    });
    return res;
};
export const getCategoriesAll = async () => {
    const session = await getServerSession(authOptions);
    const res = await sendRequest<IBackendRes<ICategoryR[]>>({
        method: "GET",
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/categories/all`,
        headers: {
            Authorization: `Bearer ${session?.access_token}`,
        },
    });
    return res;
};

// 🟢 Tạo mới category
export const createCategory = async (data: ICreateCategory) => {
    const session = await getServerSession(authOptions);
    const res = await sendRequest<IBackendRes<ICategoryR>>({
        method: "POST",
        headers: {
            Authorization: `Bearer ${session?.access_token}`,
        },
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/categories`,
        body: data,
    });
    return res;
};

// 🟢 Cập nhật category
export const updateCategory = async (_id: string, data: IUpdateCategory) => {
    const session = await getServerSession(authOptions);
    const res = await sendRequest<IBackendRes<ICategoryR>>({
        method: "PATCH",
        headers: {
            Authorization: `Bearer ${session?.access_token}`,
        },
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/categories/${_id}`,
        body: data,
    });
    return res;
};

// 🟢 Xóa category
export const deleteCategory = async (_id: string) => {
    const session = await getServerSession(authOptions);
    const res = await sendRequest<IBackendRes<ICategoryR>>({
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${session?.access_token}`,
        },
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/categories/${_id}`,
    });
    return res;
};

// 🟢 Lấy thông tin category theo ID
export const getCategoryById = async (_id: string) => {
    const session = await getServerSession(authOptions);
    const res = await sendRequest<IBackendRes<ICategoryR>>({
        method: "GET",
        headers: {
            Authorization: `Bearer ${session?.access_token}`,
        },
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/categories/${_id}`,
    });
    return res;
};

// 🟢 Upload file (image hoặc icon)
export const uploadFile = async (file: File, folder: string) => {
    const formData = new FormData();
    formData.append("fileUpload", file);
    const res = await sendRequest<IBackendRes<{ fileName: string }>>({
        method: "POST",
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/files/upload`,
        headers: { folder_type: folder },
        body: formData,
    });
    return res;
};
