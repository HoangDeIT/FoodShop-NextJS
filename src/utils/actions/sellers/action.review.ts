"use server";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth";
import { sendRequest } from "@/utils/api";
import { getServerSession } from "next-auth";

export const replyToReview = async (reviewId: string, data: { comment: string }) => {
    const session = await getServerSession(authOptions);
    const res = await sendRequest<IBackendRes<IUserR>>({
        method: "POST",
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/reviews/${reviewId}/reply`,
        headers: { Authorization: `Bearer ${session?.access_token}` },
        body: data
    });
    return res;
};
export const getSellerReviewsGrouped = async (current: number, pageSize: number, status: "replied" | "unreplied" | "all") => {
    const session = await getServerSession(authOptions);
    const res = await sendRequest<IBackendRes<IModelPaginate<ISellerReviewsGrouped>>>({
        method: "GET",
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/reviews/seller`,
        queryParams: {
            status,
            pageSize,
            current
        },
        headers: { Authorization: `Bearer ${session?.access_token}` },
    });
    return res;
}