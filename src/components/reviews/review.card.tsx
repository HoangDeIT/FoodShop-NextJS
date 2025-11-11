"use client";

import { Card, List, Avatar, Tag, Space, Button } from "antd";
import { StarFilled, MessageOutlined } from "@ant-design/icons";
import ModalReply from "./modal.reply";
import { useState } from "react";
import ReviewThread from "./review.thread";

export default function ReviewCard({ group, refresh }: any) {
    const [open, setOpen] = useState(false);
    const [selectedReview, setSelectedReview] = useState<any>(null);

    const { product, reviews, avgRating, totalReviews } = group;

    return (
        <Card
            style={{ borderRadius: 12 }}
            title={
                <Space>
                    <Avatar src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/public/images/products/${product.image}`} shape="square" size={60} />
                    <div>
                        <div style={{ fontWeight: 600 }}>{product.name}</div>
                        <small style={{ color: "#888" }}>
                            {totalReviews} đánh giá • Trung bình {avgRating?.toFixed(1)}★
                        </small>
                    </div>
                </Space>
            }
        ><List
                itemLayout="horizontal"
                dataSource={reviews}
                renderItem={(item: any) => (
                    <List.Item
                        actions={[
                            <Button
                                type="link"
                                key="reply"
                                onClick={() => {
                                    setSelectedReview(item);
                                    setOpen(true);
                                }}
                            >
                                {item.replies?.some(
                                    (r: any) => !r.isDeleted && r.user.role === "seller"
                                )
                                    ? "Xem phản hồi"
                                    : "Phản hồi"}
                            </Button>,
                        ]}
                    >
                        <ReviewThread review={item} />
                    </List.Item>
                )}
            />
            {open && (
                <ModalReply
                    open={open}
                    setOpen={setOpen}
                    review={selectedReview}
                    refresh={refresh}
                />
            )}
        </Card>
    );
}
