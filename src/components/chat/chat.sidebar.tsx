"use client";
import { useChatSocket, IMessagePayload } from "@/hooks/useChatSocket";
import { IConversation } from "@/utils/actions/chat/chat.action";
import { List, Avatar, Typography, Badge } from "antd";
import dayjs from "dayjs";
import { useSession } from "next-auth/react";
import { useState, useCallback } from "react";

const { Text } = Typography;

export default function ChatSidebar({
    chats,
    selectedId,
    onSelect,
}: {
    chats: IConversation[];
    selectedId?: string;
    onSelect: (chat: IConversation) => void;
}) {
    const { data } = useSession();
    const [onlineUsers, setOnlineUsers] = useState<{ [id: string]: boolean }>({});

    // 🧠 Dummy handlers để tránh undefined
    const handleReceive = useCallback((msg: IMessagePayload) => { }, []);
    const handleTyping = useCallback(() => { }, []);
    const handleStopTyping = useCallback(() => { }, []);

    // 🔌 Kết nối socket để cập nhật trạng thái online/offline realtime
    useChatSocket(
        data?._id || "",
        selectedId || "",
        handleReceive,
        (payload) => {
            setOnlineUsers((prev) => ({
                ...prev,
                [payload.userId]: payload.isOnline,
            }));
        },
        handleTyping,
        handleStopTyping
    );

    return (
        <div
            style={{
                height: "100%",
                width: 300,
                background: "#fff",
                borderRight: "1px solid #f0f0f0",
            }}
        >
            <div style={{ padding: 16, fontWeight: "bold", fontSize: 18 }}>Chats</div>
            <List
                itemLayout="horizontal"
                dataSource={chats}
                renderItem={(item) => {
                    const partner = item.participants.find((p) => p._id !== data?._id);
                    const isOnline =
                        onlineUsers[partner?._id || ""] ?? partner?.isOnline ?? false;

                    const avatarUrl =
                        partner?.avatar && partner.avatar.trim() !== ""
                            ? partner.avatar
                            : `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                partner?.name || "User"
                            )}&background=random`;

                    const lastMessage =
                        item.lastMessage?.type === "image"
                            ? "📷 Đã gửi một ảnh"
                            : item.lastMessage?.data || "Chưa có tin nhắn";

                    const time = item.updatedAt
                        ? dayjs(item.updatedAt).format("HH:mm")
                        : "";

                    return (
                        <List.Item
                            onClick={() => onSelect(item)}
                            style={{
                                cursor: "pointer",
                                background:
                                    selectedId === item._id ? "#f5f5f5" : "transparent",
                                paddingInline: 16,
                            }}
                        >
                            <List.Item.Meta
                                avatar={
                                    <div style={{ position: "relative" }}>
                                        <Avatar src={avatarUrl} />
                                        {/* 🔵 Chấm trạng thái online/offline */}
                                        <span
                                            style={{
                                                position: "absolute",
                                                bottom: 2,
                                                right: 2,
                                                width: 10,
                                                height: 10,
                                                borderRadius: "50%",
                                                backgroundColor: isOnline ? "#4caf50" : "#999",
                                                border: "2px solid white",
                                            }}
                                        />
                                    </div>
                                }
                                title={
                                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                                        <Text strong>{partner?.name}</Text>
                                        <Text type="secondary" style={{ fontSize: 12 }}>
                                            {time}
                                        </Text>
                                    </div>
                                }
                                description={lastMessage}
                            />
                        </List.Item>
                    );
                }}
            />
        </div>
    );
}
