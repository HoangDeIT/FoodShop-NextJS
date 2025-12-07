"use client";

import { Card, Row, Col, Statistic, Spin, Alert } from "antd";
import {
    AppstoreOutlined,
    CheckCircleOutlined,
    ClockCircleOutlined,
    DollarOutlined,
    StarFilled,
    HeartFilled,
} from "@ant-design/icons";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    BarChart,
    Bar,
    ResponsiveContainer,
} from "recharts";


export default function SellerDashboardClient({ data }: { data: ISellerDashboard | null }) {
    if (!data)
        return (
            <div className="p-4">
                <Alert message="Không thể tải dữ liệu dashboard seller" type="error" showIcon />
            </div>
        );

    const {
        totalProducts,
        totalApprovedOrders,
        totalPendingOrders,
        revenueThisMonth,
        avgRating,
        favorites,
        revenueData,
        ordersData,
    } = data;

    return (
        <div className="p-4">
            {/* ====== THỐNG KÊ TỔNG ====== */}
            <Row gutter={[16, 16]}>
                <Col xs={24} sm={12} md={8} lg={8}>
                    <Card>
                        <Statistic
                            title="Tổng sản phẩm"
                            value={totalProducts}
                            prefix={<AppstoreOutlined />}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={8} lg={8}>
                    <Card>
                        <Statistic
                            title="Đơn hàng đã duyệt"
                            value={totalApprovedOrders}
                            prefix={<CheckCircleOutlined />}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={8} lg={8}>
                    <Card>
                        <Statistic
                            title="Doanh thu tháng này"
                            value={revenueThisMonth}
                            prefix={<DollarOutlined />}
                            suffix="₫"
                            formatter={(val) => Number(val).toLocaleString("vi-VN")}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={8} lg={8}>
                    <Card>
                        <Statistic
                            title="Đơn hàng chưa duyệt"
                            value={totalPendingOrders}
                            prefix={<ClockCircleOutlined />}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={8} lg={8}>
                    <Card>
                        <Statistic
                            title="Rating trung bình"
                            value={avgRating}
                            prefix={<StarFilled style={{ color: "#fadb14" }} />}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={8} lg={8}>
                    <Card>
                        <Statistic
                            title="Số yêu thích"
                            value={favorites}
                            prefix={<HeartFilled style={{ color: "hotpink" }} />}
                        />
                    </Card>
                </Col>
            </Row>

            {/* ====== BIỂU ĐỒ ====== */}
            <Row gutter={[16, 16]} className="mt-4">
                {/* Biểu đồ doanh thu */}
                <Col xs={24} lg={12}>
                    <Card title="Biểu đồ doanh thu (7 ngày)">
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={revenueData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="day" />
                                <YAxis />
                                <Tooltip
                                    formatter={(value: number) => `${value.toLocaleString("vi-VN")} ₫`}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="revenue"
                                    stroke="#1890ff"
                                    strokeWidth={2}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </Card>
                </Col>

                {/* Biểu đồ đơn hàng */}
                <Col xs={24} lg={12}>
                    <Card title="Số đơn hàng (7 ngày)">
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={ordersData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="day" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="orders" fill="#52c41a" />
                            </BarChart>
                        </ResponsiveContainer>
                    </Card>
                </Col>
            </Row>
        </div>
    );
}
