"use client";
import { Avatar, Typography } from "antd";
const { Text } = Typography;

export default function ChatHeader({ user }: { user: any }) {
    if (!user) return null;

    // 🔍 Lấy người đang chat (đối phương)
    const partner = user.participants?.[0] || user;
    const isOnline = partner?.isOnline ?? false;

    // 🖼️ Ảnh đại diện fallback an toàn
    const avatarUrl =
        partner?.avatar?.trim()
            ? partner.avatar
            : `https://ui-avatars.com/api/?name=${encodeURIComponent(
                partner?.name || "User"
            )}&background=random`;

    return (
        <div
            style={{
                background: "#fff",
                borderBottom: "1px solid #f0f0f0",
                padding: "8px 16px",
                display: "flex",
                alignItems: "center",
                gap: 10,
                position: "relative",
            }}
        >
            {/* 🟢 Avatar có chấm trạng thái */}
            <div style={{ position: "relative" }}>
                <Avatar size={42} src={avatarUrl} />
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

            {/* 👤 Tên và trạng thái */}
            <div style={{ lineHeight: 1.2 }}>
                <Text strong style={{ display: "block", fontSize: 16 }}>
                    {partner?.name || "Người dùng"}
                </Text>
                <Text
                    style={{
                        color: isOnline ? "#4caf50" : "#999",
                        fontSize: 12,
                        fontWeight: 400,
                    }}
                >
                    {isOnline ? "🟢 Đang hoạt động" : "⚫ Ngoại tuyến"}
                </Text>
            </div>
        </div>
    );
}
