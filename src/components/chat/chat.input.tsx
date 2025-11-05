"use client";
import { Input, Upload } from "antd";
import { SendOutlined, PictureOutlined } from "@ant-design/icons";
import { RcFile } from "antd/es/upload";
import { getSocket } from "@/utils/socket";
import { useSession } from "next-auth/react";
import { uploadFile } from "@/utils/actions/sellers/action.products";
import useApp from "antd/es/app/useApp";

export default function ChatInput({
    message,
    onChange,
    onSend,
    conversationId,
}: {
    message: string;
    onChange: (v: string) => void;
    onSend: () => void;
    conversationId?: string;
}) {
    const { data } = useSession();
    const { message: antdMsg } = useApp();
    // 🖼️ Xử lý upload ảnh
    const handleUpload = async (file: RcFile) => {
        try {
            const res = await uploadFile(file, "chat");
            const fileName = res?.data?.fileName;
            if (!fileName) return;

            const socket = getSocket();
            if (!socket) return;

            const imgMsg = {
                conversationId,
                senderId: data?._id!,
                type: "image",
                data: `${fileName}`,
                createdAt: new Date().toISOString(),
            };

            socket.emit("send_message", imgMsg);
            antdMsg.success("📸 Đã gửi ảnh");
        } catch (err) {
            antdMsg.error("Không thể gửi ảnh");
            console.error("❌ Upload error:", err);
        }
        return false; // ❗ ngăn antd upload mặc định
    };

    return (
        <div
            style={{
                display: "flex",
                gap: 8,
                alignItems: "center",
                background: "#fff",
                borderRadius: 8,
                padding: 8,
                border: "1px solid #f0f0f0",
            }}
        >
            {/* 🖼 Nút upload ảnh */}
            <Upload beforeUpload={handleUpload} showUploadList={false} accept="image/*">
                <PictureOutlined
                    style={{ fontSize: 20, color: "#52c41a", cursor: "pointer" }}
                />
            </Upload>

            {/* 💬 Nhập tin nhắn */}
            <Input
                placeholder="Nhập tin nhắn..."
                value={message}
                onChange={(e) => onChange(e.target.value)}
                onPressEnter={onSend}
            />

            {/* ✉️ Nút gửi */}
            <SendOutlined
                onClick={onSend}
                style={{ fontSize: 20, color: "#1677ff", cursor: "pointer" }}
            />
        </div>
    );
}
