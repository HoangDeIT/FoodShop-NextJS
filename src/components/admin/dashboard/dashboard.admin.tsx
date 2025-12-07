"use client";

import {
    LineChart, Line, XAxis, YAxis, Tooltip,
    CartesianGrid, BarChart, Bar, Legend, ResponsiveContainer
} from "recharts";
import { Card, Row, Col, Statistic } from "antd";
import {
    ShopOutlined,
    UserOutlined,
    ShoppingCartOutlined,
    DollarOutlined,
} from "@ant-design/icons";

export default function DashboardClient({ data }: { data: IAdminDashboard }) {
    const {
        totalSellers,
        totalCustomers,
        totalSuccessOrders,
        revenueMonth,
        revenueByMonth,
        userRegisterByMonth,
    } = data;

    return (
        <div className="p-4">
            {/* ====== THỐNG KÊ TỔNG ====== */}
            <Row gutter={[16, 16]}>
                <Col xs={24} sm={12} md={6}>
                    <Card>
                        <Statistic
                            title="Tổng số Seller"
                            value={totalSellers}
                            prefix={<ShopOutlined />}
                        />
                    </Card>
                </Col>

                <Col xs={24} sm={12} md={6}>
                    <Card>
                        <Statistic
                            title="Tổng số Customer"
                            value={totalCustomers}
                            prefix={<UserOutlined />}
                        />
                    </Card>
                </Col>

                <Col xs={24} sm={12} md={6}>
                    <Card>
                        <Statistic
                            title="Đơn hàng thành công"
                            value={totalSuccessOrders}
                            prefix={<ShoppingCartOutlined />}
                        />
                    </Card>
                </Col>

                <Col xs={24} sm={12} md={6}>
                    <Card>
                        <Statistic
                            title="Doanh thu tháng này"
                            value={revenueMonth}
                            prefix={<DollarOutlined />}
                            suffix="₫"
                            formatter={(val) =>
                                Number(val).toLocaleString("vi-VN")
                            }
                        />
                    </Card>
                </Col>
            </Row>

            {/* ====== BIỂU ĐỒ ====== */}
            <Row gutter={[16, 16]} className="mt-4">
                {/* Biểu đồ doanh thu 1 năm */}
                <Col xs={24} lg={12}>
                    <Card title="Biểu đồ doanh thu (12 tháng)">
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={revenueByMonth}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Tooltip
                                    formatter={(value: number) =>
                                        `${value.toLocaleString("vi-VN")} ₫`
                                    }
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

                {/* Biểu đồ user đăng ký */}
                <Col xs={24} lg={12}>
                    <Card title="Số lượng người dùng đăng ký (12 tháng)">
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={userRegisterByMonth}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar
                                    dataKey="customers"
                                    name="Customer"
                                    fill="#52c41a"
                                />
                                <Bar
                                    dataKey="sellers"
                                    name="Seller"
                                    fill="#faad14"
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </Card>
                </Col>
            </Row>
        </div>
    );
}
