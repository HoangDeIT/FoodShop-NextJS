"use client";
import { Layout, Typography } from "antd";
import { useEffect, useState, useCallback } from "react";
import { useChatSocket, IMessagePayload } from "@/hooks/useChatSocket";
import ChatHeader from "@/components/chat/chat.header";
import ChatSidebar from "@/components/chat/chat.sidebar";
import ChatInput from "@/components/chat/chat.input";
import ChatMessages from "@/components/chat/chat.messages";
import { getAllChat, getAllMessage, IConversation, IMessage } from "@/utils/actions/chat/chat.action";
import { useSession } from "next-auth/react";
import { getSocket } from "@/utils/socket";

const { Sider, Content } = Layout;
const { Text } = Typography;

export default function ChatPage() {
    const [chats, setChats] = useState<IConversation[]>([]);
    const [selected, setSelected] = useState<IConversation | null>(null);
    const [messages, setMessages] = useState<(IMessage | IMessagePayload)[]>([]);
    const [message, setMessage] = useState("");
    const [typingUser, setTypingUser] = useState<string | null>(null);
    const [lastRead, setLastRead] = useState<string | null>(null);
    const { data } = useSession();
    // 🧾 Load danh sách hội thoại
    useEffect(() => {
        (async () => {
            const res = await getAllChat();
            setChats(res.data || []);
        })();
    }, []);
    useEffect(() => {
        const socket = getSocket();
        if (!socket || !data?._id) return;

        const interval = setInterval(() => {
            socket.emit("heartbeat", { userId: data._id });
        }, 10000); // ⏱ Mỗi 10 giây ping 1 lần

        return () => clearInterval(interval);
    }, [data?._id]);
    // 🧾 Load tin nhắn khi chọn hội thoại
    useEffect(() => {
        if (!selected) return;
        (async () => {
            const res = await getAllMessage(selected._id);
            setMessages(res.data || []);

            // ✅ Mark as read ngay khi mở hội thoại
            const socket = getSocket();
            socket?.emit("mark_as_read", {
                conversationId: selected._id,
                userId: data?._id,
            });
        })();
    }, [selected]);

    // 🧠 Lắng nghe tin nhắn mới
    const handleReceive = useCallback(
        (msg: IMessagePayload) => {
            if (msg.conversationId === selected?._id) {
                setMessages((prev) => [...prev, msg]);
            }
        },
        [selected]
    );

    // 🔥 Online + Typing handler
    const handleUserOnline = (payload: any) => {
        setChats((prev) =>
            prev.map((c) =>
                c.participants.some((p) => p._id === payload.userId)
                    ? {
                        ...c,
                        participants: c.participants.map((p) =>
                            p._id === payload.userId
                                ? { ...p, isOnline: payload.isOnline }
                                : p
                        ),
                    }
                    : c
            )
        );
        if (selected) {
            const updatedPartner = selected.participants.map((p) =>
                p._id === payload.userId ? { ...p, isOnline: payload.isOnline } : p
            );
            setSelected({ ...selected, participants: updatedPartner });
        }
    };

    const handleTyping = (payload: any) => {
        if (payload.conversationId === selected?._id) setTypingUser(payload.userName);
    };
    const handleStopTyping = (payload: any) => {
        if (payload.conversationId === selected?._id) setTypingUser(null);
    };

    // ✅ Khi đối phương đọc tin nhắn
    const handleRead = (payload: { conversationId: string; userId: string }) => {
        if (payload.conversationId === selected?._id) {
            setLastRead(payload.userId);
        }
    };

    // ⚡ Socket setup
    useChatSocket(
        data?._id || "",
        selected?._id || "",
        handleReceive,
        handleUserOnline,
        handleTyping,
        handleStopTyping,
        handleRead
    );

    // ✉️ Gửi tin nhắn
    const handleSend = async () => {
        if (!message.trim() || !selected) return;
        const socket = getSocket();
        if (!socket) return;

        const msg: IMessagePayload = {
            conversationId: selected._id,
            senderId: data?._id!,
            type: "text",
            data: message,
            createdAt: new Date().toISOString(),
        };

        setMessages((prev) => [...prev, msg]);
        socket.emit("send_message", msg);
        setMessage("");
    };

    const handleTypingInput = (value: string) => {
        setMessage(value);
        const socket = getSocket();
        if (!socket || !selected) return;
        socket.emit("user_typing", {
            conversationId: selected._id,
            userId: data?._id!,
            userName: data?.user?.name,
        });
        setTimeout(() => {
            socket.emit("user_stopped_typing", {
                conversationId: selected._id,
                userId: data?._id!,
            });
        }, 2000);
    };

    return (
        <Layout style={{ height: "90vh", border: "1px solid #eee" }}>
            <Sider width={300}>
                <ChatSidebar chats={chats} selectedId={selected?._id} onSelect={setSelected} />
            </Sider>

            <Layout>
                {/* 🧭 Header có avatar + online chấm xanh */}
                <ChatHeader user={selected} />

                <Content
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        background: "#fafafa",
                    }}
                >
                    <ChatMessages
                        messages={messages as IMessagePayload[]}
                        myId={data?._id!}
                        lastReadUserId={lastRead}
                        conversation={selected}
                    />

                    {/* 💬 Hiển thị "đang nhập..." ngay trên ô nhập */}
                    {typingUser && (
                        <Text style={{ color: "#999", textAlign: "center", marginBottom: 4 }}>
                            💬 {typingUser} đang nhập...
                        </Text>
                    )}

                    <ChatInput message={message} onChange={handleTypingInput} onSend={handleSend}
                        conversationId={selected?._id}
                    />
                </Content>
            </Layout>
        </Layout>
    );
}
