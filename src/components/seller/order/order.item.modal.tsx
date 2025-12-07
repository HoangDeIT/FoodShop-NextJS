"use client";

import { Modal, List, Image, Tag } from "antd";
import React from "react";

interface Props {
    open: boolean;
    onClose: () => void;
    order: IOrder | null;
}

export default function OrderItemsModal({ open, onClose, order }: Props) {
    if (!order) return null;

    return (
        <Modal
            open={open}
            onCancel={onClose}
            title={`Chi tiết đơn hàng #${order._id.slice(-6)}`}
            footer={null}
            centered
        >
            <List
                itemLayout="horizontal"
                dataSource={order.items}
                renderItem={(item) => (
                    <List.Item>
                        <List.Item.Meta
                            avatar={
                                <Image
                                    width={60}
                                    src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/public/images/products/${item.image}`}
                                    style={{ borderRadius: 8 }}
                                />
                            }
                            title={
                                <b>
                                    {item.productName} × {item.quantity}
                                </b>
                            }
                            description={
                                <div>
                                    {

                                        item.sizeName && (
                                            <div>
                                                🎚 Size: <Tag color="blue">{


                                                    item.sizeName}</Tag>
                                            </div>
                                        )}

                                    {item.toppingNames?.length > 0 && (
                                        <div>
                                            🍢 Topping:{" "}
                                            {item.toppingNames.map((tp: string, i: number) => (
                                                <Tag key={i} color="purple">
                                                    {tp}
                                                </Tag>
                                            ))}
                                        </div>
                                    )}

                                    <div style={{ marginTop: 6, fontWeight: 600, color: "#d46b08" }}>
                                        💰 {item.totalPrice.toLocaleString("vi-VN")} đ
                                    </div>
                                </div>
                            }
                        />
                    </List.Item>
                )}
            />

            <div style={{ marginTop: 16, textAlign: "right", fontSize: 18 }}>
                <b>Tổng thanh toán: </b>
                <span style={{ color: "#52c41a", fontWeight: "bold" }}>
                    {order.totalPrice.toLocaleString("vi-VN")} đ
                </span>
            </div>
        </Modal>
    );
}
