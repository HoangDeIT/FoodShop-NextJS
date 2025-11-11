"use client";

import { replyToReview } from "@/utils/actions/sellers/action.review";
import { Modal, Input, Button, List, Avatar } from "antd";
import { useState } from "react";

export default function ModalReply({ open, setOpen, review, refresh }: any) {
    const [comment, setComment] = useState("");
    const [loading, setLoading] = useState(false);

    const handleReply = async () => {
        if (!comment.trim()) return;
        setLoading(true);
        const res = await replyToReview(review._id, { comment });
        console.log("check res: ", res);
        setLoading(false);
        setOpen(false);
        refresh();
    };

    return (
        <Modal
            open={open}
            onCancel={() => setOpen(false)}
            title={`Phản hồi khách hàng (${review.user.name})`}
            footer={null}
            width={600}
        >
            <List
                itemLayout="horizontal"
                dataSource={[review]}
                renderItem={(item) => (
                    <List.Item>
                        <List.Item.Meta
                            avatar={<Avatar src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/public/images/users/${item.user.avatar}`} />}
                            title={item.user.name}
                            description={item.comment}
                        />
                    </List.Item>
                )}
            />
            <Input.TextArea
                rows={3}
                placeholder="Nhập phản hồi..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                style={{ marginTop: 10 }}
            />
            <div style={{ marginTop: 15, textAlign: "right" }}>
                <Button type="primary" onClick={handleReply} loading={loading}>
                    Gửi phản hồi
                </Button>
            </div>
        </Modal>
    );
}
