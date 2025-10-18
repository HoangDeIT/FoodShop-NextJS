"use server";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth";
import { sendRequest } from "@/utils/api";
import { getServerSession } from "next-auth";

// 🟢 Lấy danh sách categories mà seller hiện có sản phẩm
export const getSellerCategories = async () => {
    const session = await getServerSession(authOptions);
    const res = await sendRequest<IBackendRes<ICategoryR[]>>({
        method: "GET",
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/products/categories`,
        headers: { Authorization: `Bearer ${session?.access_token}` },
    });
    return res;
};
// 🟢 Lấy danh sách sản phẩm (có phân trang, filter)
export const getProductsBySeller = async (query: any) => {
    const session = await getServerSession(authOptions);
    const res = await sendRequest<IBackendRes<IModelPaginate<IProductR>>>({
        method: "GET",
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/products/mine`,
        headers: { Authorization: `Bearer ${session?.access_token}` },
        queryParams: {
            ...query,
            population: "categories", // ✅ thêm dòng này
        },

    });
    return res;
};

// 🟢 Lấy chi tiết 1 sản phẩm theo ID
export const getProductById = async (_id: string) => {
    const session = await getServerSession(authOptions);
    const res = await sendRequest<IBackendRes<IProductR>>({
        method: "GET",
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/products/${_id}`,
        headers: { Authorization: `Bearer ${session?.access_token}` },
    });
    return res;
};

// 🟢 Xóa sản phẩm
export const deleteProduct = async (_id: string) => {
    const session = await getServerSession(authOptions);
    const res = await sendRequest<IBackendRes<IProductR>>({
        method: "DELETE",
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/products/${_id}`,
        headers: { Authorization: `Bearer ${session?.access_token}` },
    });
    return res;
};
export const createProduct = async (data: ICreateProduct) => {
    const session = await getServerSession(authOptions);

    const res = await sendRequest<IBackendRes<IProductR>>({
        method: "POST",
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/products`,
        headers: {
            Authorization: `Bearer ${session?.access_token}`,
        },
        body: data,
    });

    return res;
};
export const updateProduct = async (_id: string, data: ICreateProduct) => {
    const session = await getServerSession(authOptions);

    const res = await sendRequest<IBackendRes<IProductR>>({
        method: "PATCH",
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/products/${_id}`,
        headers: {
            Authorization: `Bearer ${session?.access_token}`,
        },
        body: data,
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
export const toggleActiveProduct = async (_id: string, inStock: boolean) => {
    const session = await getServerSession(authOptions);
    const res = await sendRequest<IBackendRes<IProductR>>({
        method: "PATCH",
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/products/${_id}/active`,
        headers: { Authorization: `Bearer ${session?.access_token}` },
        body: { inStock },
    });
    return res;
};