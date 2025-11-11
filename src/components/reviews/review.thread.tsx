"use client";

import { Avatar, Card, Space, Tag, Typography } from "antd";
import { MessageOutlined } from "@ant-design/icons";

const { Text } = Typography;

interface ReviewThreadProps {
    review: any; // bạn có thể đổi thành interface cụ thể nếu muốn
}

export default function ReviewThread({ review }: ReviewThreadProps) {
    const replies = review.replies?.filter((r: any) => !r.isDeleted) || [];

    return (
        <Card
            size="small"
            style={{
                borderRadius: 10,
                background: "#fafafa",
                marginBottom: 16,
            }}
        >
            {/* 🔹 Review chính */}
            <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                <Avatar
                    size={48}
                    src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/public/images/users/${review.user.avatar}`}
                />
                <div style={{ flex: 1 }}>
                    <Space>
                        <Text strong>{review.user.name}</Text>
                        <Tag
                            color={
                                review.rating >= 4
                                    ? "green"
                                    : review.rating >= 3
                                        ? "gold"
                                        : "red"
                            }
                        >
                            {review.rating}★
                        </Tag>
                    </Space>

                    <div style={{ marginTop: 4, color: "#555" }}>{review.comment}</div>

                    {/* Ảnh review nếu có */}
                    {review.images?.length > 0 && (
                        <Space wrap style={{ marginTop: 8 }}>
                            {review.images.map((img: string) => (
                                <img
                                    key={img}
                                    src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/public/images/reviews/${img}`}
                                    alt="review"
                                    style={{
                                        width: 70,
                                        height: 70,
                                        objectFit: "cover",
                                        borderRadius: 6,
                                    }}
                                />
                            ))}
                        </Space>
                    )}
                </div>
            </div>

            {/* 🔹 Các phản hồi */}
            {replies.length > 0 && (
                <div style={{ marginTop: 12, marginLeft: 60 }}>
                    {replies.map((rep: any) => (
                        <div
                            key={rep._id}
                            style={{
                                display: "flex",
                                alignItems: "flex-start",
                                gap: 12,
                                marginBottom: 10,
                            }}
                        >
                            <Avatar
                                size={40}
                                src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/public/images/users/${rep.user.avatar}`}
                            />
                            <div
                                style={{
                                    flex: 1,
                                    background: "#fff",
                                    borderRadius: 10,
                                    padding: "6px 10px",
                                    boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                                }}
                            >
                                <Space size="small">
                                    <Text strong style={{ fontSize: 13 }}>
                                        {rep.user.name}
                                    </Text>
                                    <Tag
                                        color={rep.user.role === "seller" ? "blue" : "green"}
                                        style={{ fontSize: 11 }}
                                    >
                                        {rep.user.role === "seller" ? "Người bán" : "Khách hàng"}
                                    </Tag>
                                </Space>
                                <div style={{ marginTop: 4, color: "#555", fontSize: 13 }}>
                                    {rep.comment}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {replies.length === 0 && (
                <div
                    style={{
                        marginLeft: 60,
                        marginTop: 10,
                        color: "#999",
                        fontSize: 13,
                        display: "flex",
                        alignItems: "center",
                        gap: 4,
                    }}
                >
                    <MessageOutlined /> Chưa có phản hồi nào.
                </div>
            )}
        </Card>
    );
}
