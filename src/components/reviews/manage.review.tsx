"use client";

import React, { useEffect, useState } from "react";
import { Card, Select, Pagination, Space, Button, Typography, Spin } from "antd";
import ReviewCard from "./review.card";
import { ReloadOutlined } from "@ant-design/icons";
import { getSellerReviewsGrouped } from "@/utils/actions/sellers/action.review";

const { Title } = Typography;

export default function ManageReviewsGroupedClient({ initialGroups, initialMeta }: any) {
    const [groups, setGroups] = useState(initialGroups);
    const [meta, setMeta] = useState(initialMeta);
    const [status, setStatus] = useState<"all" | "replied" | "unreplied">("all");
    const [loading, setLoading] = useState(false);
    const [current, setCurrent] = useState(1);
    const pageSize = 5;

    const loadData = async () => {
        setLoading(true);
        const res = await getSellerReviewsGrouped(current, pageSize, status);
        if (res?.data) {
            setGroups(res.data.result);
            setMeta(res.data.meta);
        }
        setLoading(false);
    };

    useEffect(() => {
        // chỉ fetch lại khi người dùng đổi filter hoặc trang
        if (current !== 1 || status !== "all") loadData();
    }, [status, current]);

    return (
        <Card
            title="Quản lý đánh giá sản phẩm 💬"
            extra={
                <Button icon={<ReloadOutlined />} onClick={loadData}>
                    Làm mới
                </Button>
            }
            style={{ borderRadius: 16 }}
        >
            <Space direction="vertical" style={{ width: "100%" }} size="large">
                <Space wrap>
                    <Select
                        value={status}
                        style={{ width: 250 }}
                        onChange={(v) => {
                            setStatus(v);
                            setCurrent(1);
                        }}
                        options={[
                            { label: "Tất cả đánh giá", value: "all" },
                            { label: "Chưa phản hồi", value: "unreplied" },
                            { label: "Đã phản hồi", value: "replied" },
                        ]}
                    />
                </Space>

                {loading ? (
                    <Spin tip="Đang tải dữ liệu..." />
                ) : groups.length === 0 ? (
                    <p style={{ color: "#888" }}>Không có đánh giá nào.</p>
                ) : (
                    groups.map((group: any) => (
                        <ReviewCard key={group._id} group={group} refresh={loadData} />
                    ))
                )}

                {meta && meta.pages > 1 && (
                    <Pagination
                        total={meta.total}
                        current={meta.current}
                        pageSize={meta.pageSize}
                        onChange={(page) => setCurrent(page)}
                        showSizeChanger={false}
                        style={{ textAlign: "center", marginTop: 20 }}
                    />
                )}
            </Space>
        </Card>
    );
}
