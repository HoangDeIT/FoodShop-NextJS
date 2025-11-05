"use client";
import { useEffect, useRef } from "react";
import dayjs from "dayjs";
import { IMessagePayload } from "@/hooks/useChatSocket";
import { IMessage } from "@/utils/actions/chat/chat.action";

const getSenderId = (item: IMessage | IMessagePayload): string => {
    if (typeof item.senderId === "string") return item.senderId;
    if (typeof item.senderId === "object" && "_id" in item.senderId)
        return item.senderId._id;
    return "";
};

export default function ChatMessages({
    messages,
    myId,
    lastReadUserId,
    conversation,
}: {
    messages: IMessagePayload[];
    myId: string;
    lastReadUserId?: string | null;
    conversation?: any;
}) {
    const bottomRef = useRef<HTMLDivElement>(null);
    useEffect(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), [messages]);

    const lastMyMsgIndex = [...messages].reverse().findIndex(
        (m) => getSenderId(m) === myId
    );
    const lastMyMsg = lastMyMsgIndex >= 0 ? messages[messages.length - 1 - lastMyMsgIndex] : null;

    return (
        <div
            style={{
                flex: 1,
                overflowY: "auto",
                padding: 16,
                display: "flex",
                flexDirection: "column",
                gap: 8,
                background: "#fafafa",
            }}
        >
            {messages.map((msg, i) => {
                const isMe = getSenderId(msg) === myId;
                const isLastMyMsg = msg === lastMyMsg;
                return (
                    <div
                        key={i}
                        style={{
                            alignSelf: isMe ? "flex-end" : "flex-start",
                            background: isMe ? "#1677ff" : "#e4e6eb",
                            color: isMe ? "#fff" : "#000",
                            padding: "8px 12px",
                            borderRadius: 16,
                            maxWidth: "70%",
                            position: "relative",
                        }}
                    >
                        {msg.type === "image" ? (
                            <img
                                src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/public/images/chat/${msg.data}`}
                                alt="Ảnh"
                                style={{
                                    maxWidth: "100%",
                                    borderRadius: 12,
                                    display: "block",
                                }}
                            />
                        ) : (
                            <span>{msg.data}</span>
                        )}
                        <div style={{ fontSize: 10, color: "#ddd", marginTop: 2 }}>
                            {dayjs(msg.createdAt).format("HH:mm")}
                        </div>
                        {isMe && isLastMyMsg && lastReadUserId && (
                            <div style={{ fontSize: 11, color: "#52c41a", marginTop: 2 }}>
                                Đã xem ✅
                            </div>
                        )}
                    </div>
                );
            })}
            <div ref={bottomRef}></div>
        </div>
    );
}
