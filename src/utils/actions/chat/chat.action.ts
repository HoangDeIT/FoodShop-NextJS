"use server";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth";
import { sendRequest } from "@/utils/api";
import { getServerSession } from "next-auth";
export interface IUserMini {
    _id: string;
    name: string;
    avatar?: string;
    isOnline: boolean;
}

export interface ILastMessage {
    type: "text" | "image";
    data: string; // nội dung hoặc URL ảnh
    senderId: string;
    createdAt: string;
}
export interface IMessage {
    _id: string;
    conversationId: string;
    senderId: IUserMini; // đã populate name + avatar
    type: "text" | "image";
    data: string;
    isRead: boolean;
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string;
    deletedAt?: string;
}
export interface IConversation {
    _id: string;
    participants: IUserMini[];
    lastMessage?: ILastMessage;
    createdAt: string;
    updatedAt: string;

}
export const getAllChat = async () => {
    const session = await getServerSession(authOptions);
    const res = await sendRequest<IBackendRes<IConversation[]>>({
        method: "GET",
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/chats/conversations`,
        headers: {
            Authorization: `Bearer ${session?.access_token}`,
        },
    });
    return res;
};

// 💬 Lấy danh sách tin nhắn theo conversation
export const getAllMessage = async (conversationId: string) => {
    const session = await getServerSession(authOptions);
    const res = await sendRequest<IBackendRes<IMessage[]>>({
        method: "GET",
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/chats/messages/${conversationId}`,
        headers: {
            Authorization: `Bearer ${session?.access_token}`,
        },
    });
    return res;
};