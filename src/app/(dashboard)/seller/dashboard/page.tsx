"use client";

import { Card, Row, Col, Statistic } from "antd";
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

const revenueData = [
    { day: "1", revenue: 200 },
    { day: "2", revenue: 450 },
    { day: "3", revenue: 300 },
    { day: "4", revenue: 600 },
    { day: "5", revenue: 800 },
    { day: "6", revenue: 500 },
    { day: "7", revenue: 950 },
];

const ordersData = [
    { day: "1", orders: 12 },
    { day: "2", orders: 18 },
    { day: "3", orders: 22 },
    { day: "4", orders: 15 },
    { day: "5", orders: 30 },
    { day: "6", orders: 26 },
    { day: "7", orders: 40 },
];

export default function Dashboard() {
    return (
        <div className="p-4">
            {/* ====== THỐNG KÊ TỔNG ====== */}
            <Row gutter={[16, 16]}>
                <Col xs={24} sm={12} md={8} lg={8}>
                    <Card>
                        <Statistic
                            title="Tổng sản phẩm"
                            value={240}
                            prefix={<AppstoreOutlined />}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={8} lg={8}>
                    <Card>
                        <Statistic
                            title="Đơn hàng đã duyệt"
                            value={128}
                            prefix={<CheckCircleOutlined />}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={8} lg={8}>
                    <Card>
                        <Statistic
                            title="Doanh thu tháng này"
                            value={12500000}
                            prefix={<DollarOutlined />}
                            precision={0}
                            suffix="₫"
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={8} lg={8}>
                    <Card>
                        <Statistic
                            title="Đơn hàng chưa duyệt"
                            value={15}
                            prefix={<ClockCircleOutlined />}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={8} lg={8}>
                    <Card>
                        <Statistic
                            title="Rating trung bình"
                            value={4.6}
                            prefix={<StarFilled style={{ color: "#fadb14" }} />}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={8} lg={8}>
                    <Card>
                        <Statistic
                            title="Số yêu thích"
                            value={1120}
                            prefix={<HeartFilled style={{ color: "hotpink" }} />}
                        />
                    </Card>
                </Col>
            </Row>

            {/* ====== BIỂU ĐỒ ====== */}
            <Row gutter={[16, 16]} className="mt-4">
                <Col xs={24} lg={12}>
                    <Card title="Biểu đồ doanh thu (7 ngày)">
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={revenueData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="day" />
                                <YAxis />
                                <Tooltip />
                                <Line type="monotone" dataKey="revenue" stroke="#1890ff" strokeWidth={2} />
                            </LineChart>
                        </ResponsiveContainer>
                    </Card>
                </Col>

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
