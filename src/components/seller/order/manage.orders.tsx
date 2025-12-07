"use client";

import React, { useEffect, useState } from "react";
import {
    Card,
    Table,
    Space,
    Input,
    Button,
    Tag,
    Popconfirm,
    Select,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import MapModal from "@/components/seller/order/map.orders";
import { EnvironmentOutlined } from "@ant-design/icons";
// ⚠️ Giả API (bạn thay bằng API thật sau)
import { getOrdersBySeller, updateOrderStatus } from "@/utils/actions/sellers/action.orders";
import useApp from "antd/es/app/useApp";
import { getSession, useSession } from "next-auth/react";
import OrderItemsModal from "./order.item.modal";

interface IMeta {
    current: number;
    pageSize: number;
    pages: number;
    total: number;
}

interface IOrderItem {
    productName: string;
    quantity: number;
    totalPrice: number;
}


// 🔹 Các trạng thái hợp lệ
const ORDER_STATUSES = [
    "pending",
    "confirmed",
    "preparing",
    "delivering",
    "completed",
    "cancelled",
] as const;

// 🔹 Quy tắc chuyển trạng thái
const NEXT_STATUS: Record<IOrder["orderStatus"], IOrder["orderStatus"][]> = {
    pending: ["confirmed", "cancelled"],
    confirmed: ["preparing", "cancelled"],
    preparing: ["delivering", "cancelled"],
    delivering: ["completed", "cancelled"],
    completed: [],
    cancelled: [],
};

export default function ManageOrders() {
    const [orders, setOrders] = useState<IOrder[]>([]);
    const [meta, setMeta] = useState<IMeta>();
    const [current, setCurrent] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(10);
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [searchName, setSearchName] = useState<string>("");
    const [mapVisible, setMapVisible] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<IOrder | null>(null);
    const [itemsModalVisible, setItemsModalVisible] = useState(false);

    const [selectedLocation, setSelectedLocation] = useState({
        lat: 0,
        lng: 0,
        address: "",
    });

    const { message } = useApp();
    const { data } = useSession();
    // 🔹 Lấy dữ liệu đơn hàng
    const getData = async () => {
        const query: any = { current, pageSize };
        if (statusFilter !== "all") query.status = statusFilter;
        if (searchName) query.receiverName = `/${searchName}/i`;

        const res = await getOrdersBySeller(query);
        if (res?.data) {
            setOrders(res.data.result ?? []);
            setMeta(res.data.meta);
        }
    };
    useEffect(() => {
        console.log('data', data)
        if (!data?.access_token && !data) return;
        const es = new EventSource(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/notifications/seller/stream?token=${data?.access_token}`
        );

        // Khi server gửi event
        es.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                console.log("📩 SSE event:", data);
                console.log('data.type', data.data)
                console.log(data.data.type === "NEW_ORDER")
                if (data.data.type === "NEW_ORDER") {
                    message.info("🧾 Bạn có đơn hàng mới!");

                    // Tuỳ chọn: tự refresh bảng đơn hàng
                    getData();
                }
            } catch (err) {
                console.error("❌ Lỗi khi parse SSE:", err);
            }
        };

        es.onerror = (err) => {
            console.error("❌ SSE error:", err);
            es.close();
        };

        return () => es.close();
    }, [data]);
    useEffect(() => {
        getData();
    }, [current, pageSize]);

    useEffect(() => {
        if (current === 1) getData();
        else setCurrent(1);
    }, [statusFilter, searchName]);

    // 🔹 Xử lý cập nhật trạng thái
    const handleChangeStatus = async (id: string, newStatus: IOrder["orderStatus"]) => {
        try {
            const res = await updateOrderStatus(id, newStatus);
            if (!res.error) {
                message.success(`Đơn hàng đã chuyển sang trạng thái "${newStatus}"`);
                setOrders((prev) =>
                    prev.map((o) => (o._id === id ? { ...o, orderStatus: newStatus } : o))
                );
            } else {
                message.error(res.error ?? "Cập nhật trạng thái thất bại!");
            }
        } catch {
            message.error("Lỗi kết nối server!");
        }
    };
    const handleOpenMap = (order: IOrder) => {
        if (!order.deliveryAddress) return;

        setSelectedLocation({
            lat: order.deliveryAddress.latitude,
            lng: order.deliveryAddress.longitude,
            address: order.deliveryAddress.address ?? "Không có địa chỉ",
        });

        setMapVisible(true);
    };

    // 🔹 Gắn màu trạng thái
    const statusColor = (status: string) => {
        switch (status) {
            case "pending":
                return "default";
            case "confirmed":
                return "blue";
            case "preparing":
                return "orange";
            case "delivering":
                return "purple";
            case "completed":
                return "green";
            case "cancelled":
                return "red";
            default:
                return "default";
        }
    };

    // 🔹 Cột bảng
    const columns: ColumnsType<IOrder> = [
        {
            title: "Customer",
            dataIndex: ["customer", "name"],
            key: "customer",
            render: (_, record) => record.customer?.name ?? "Guest",
        },
        {
            title: "Receiver",
            dataIndex: "receiverName",
            key: "receiverName",
            render: (name, record) => (
                <div>
                    <div>{name}</div>
                    <div style={{ fontSize: 12, color: "#888" }}>{record.receiverPhone}</div>
                </div>
            ),
        },
        {
            title: "Total",
            dataIndex: "totalPrice",
            key: "totalPrice",
            render: (v) => v.toLocaleString("vi-VN") + "đ",
        },
        {
            title: "Status",
            dataIndex: "orderStatus",
            key: "orderStatus",
            render: (status) => <Tag color={statusColor(status)}>{status}</Tag>,
        },
        {
            title: "Note",
            dataIndex: "note",
            key: "note",
            render: (n) => (n ? n : <i>Không có ghi chú</i>),
        },
        {
            title: "Order Date",
            dataIndex: "orderDate",
            key: "orderDate",
            render: (d) => new Date(d).toLocaleString("vi-VN"),
        },
        {
            title: "Location",
            key: "location",
            render: (_, order) =>
                order.deliveryAddress ? (
                    <Button
                        type="link"
                        onClick={() => handleOpenMap(order)}
                        icon={<EnvironmentOutlined />}
                    >
                        Xem địa điểm
                    </Button>
                ) : (
                    <i>Không có</i>
                ),
        },
        {
            title: "Details",
            key: "details",
            render: (_, record) => (
                <Button type="link" onClick={() => {
                    setSelectedOrder(record);
                    setItemsModalVisible(true);
                }}>
                    Xem món ăn
                </Button>
            ),
        },

        {
            title: "Action",
            key: "action",
            render: (_, record) => {
                const nextStatuses = NEXT_STATUS[record.orderStatus];
                return (
                    <Space>
                        {nextStatuses.map((s) => (
                            <Popconfirm
                                key={s}
                                title={`Chuyển sang "${s}"?`}
                                okText="Yes"
                                cancelText="No"
                                onConfirm={() => handleChangeStatus(record._id, s)}
                            >
                                <Button size="small">{s}</Button>
                            </Popconfirm>
                        ))}
                        {nextStatuses.length === 0 && (
                            <Tag color="default">Không thể thay đổi</Tag>
                        )}
                    </Space>
                );
            },
        },
    ];

    return (
        <Card
            title="Order Management"
            style={{ borderRadius: 16 }}
        >
            <Space direction="vertical" style={{ width: "100%" }} size="large">
                {/* 🔍 Bộ lọc */}
                <Space wrap>
                    <Input.Search
                        placeholder="Tìm theo tên người nhận"
                        allowClear
                        onSearch={(val) => setSearchName(val)}
                        style={{ width: 250 }}
                    />
                    <Select
                        placeholder="Lọc theo trạng thái"
                        value={statusFilter}
                        style={{ width: 220 }}
                        onChange={(v) => setStatusFilter(v)}
                        options={[
                            { label: "Tất cả", value: "all" },
                            ...ORDER_STATUSES.map((s) => ({
                                label: s,
                                value: s,
                            })),
                        ]}
                    />
                </Space>

                {/* 🧾 Bảng đơn hàng */}
                <Table<IOrder>
                    columns={columns}
                    dataSource={orders}
                    pagination={{
                        pageSize,
                        current,
                        total: meta?.total,
                        onChange: (page, size) => {
                            setCurrent(page);
                            setPageSize(size);
                        },
                    }}
                    rowKey="_id"
                    bordered
                />
            </Space>
            <MapModal
                open={mapVisible}
                location={selectedLocation}
                onClose={() => setMapVisible(false)}
            />
            <OrderItemsModal
                open={itemsModalVisible}
                order={selectedOrder}
                onClose={() => setItemsModalVisible(false)}
            />

        </Card>

    );
}
