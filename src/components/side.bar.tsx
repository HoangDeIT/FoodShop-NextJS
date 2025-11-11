"use client";
import React from "react";
import { Badge, Layout, Menu, Typography, theme } from "antd";
import {
    DashboardOutlined,
    AppstoreOutlined,
    ShoppingCartOutlined,
    TeamOutlined,
    SettingOutlined,
    BarChartOutlined,
    ProductOutlined,
    MessageOutlined,
    WechatOutlined,
    WechatWorkOutlined,
} from "@ant-design/icons";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const { Sider } = Layout;
const { Title, Text } = Typography;

export default function Sidebar({ collapsed, setCollapsed }: { collapsed: boolean, setCollapsed: (collapsed: boolean) => void }) {
    const { token } = theme.useToken();
    const { data } = useSession();
    const router = useRouter();
    const handleMenuClick = ({ key }: { key: string }) => {
        if (data?.role == 'admin') {
            router.push(`/admin/${key}`);
        } else {

            router.push(`/seller/${key}`);
        }
        // chuyển hướng đến trang tương ứng

    };
    return (
        <Sider
            collapsible
            collapsed={collapsed}
            onCollapse={setCollapsed}
            width={250}
            style={{
                background: token.colorBgContainer,
                borderRight: `1px solid ${token.colorBorderSecondary}`,
                overflow: "auto",
                height: "100vh",
                position: "sticky",
                top: 0,
            }}
        >
            {/* Logo */}
            <div
                style={{
                    height: 64,
                    paddingInline: 16,
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    borderBottom: `1px solid ${token.colorBorderSecondary}`,
                }}
            >
                <div
                    style={{
                        width: 36,
                        height: 36,
                        borderRadius: 12,
                        background: "linear-gradient(135deg,#1677ff,#69c0ff)",
                        display: "grid",
                        placeItems: "center",
                        color: "#fff",
                        fontWeight: 800,
                    }}
                >
                    A
                </div>
                {!collapsed && <Title level={5} style={{ margin: 0 }}>Admin</Title>}
            </div>

            {/* Menu */}
            <Menu
                mode="inline"
                defaultSelectedKeys={["dashboard"]}
                style={{ borderInline: "none" }}
                onClick={handleMenuClick}
                items={
                    data?.role === "admin" ? [
                        { key: "dashboard", icon: <BarChartOutlined />, label: "Dashboard" },
                        { key: "users", icon: <TeamOutlined />, label: "Users" },
                        { key: "categories", icon: <AppstoreOutlined />, label: "Categories" },
                    ] :
                        [
                            { key: "section-overview", type: "group", label: "Overview" },
                            { key: "dashboard", icon: <BarChartOutlined />, label: "Dashboard" },
                            { key: "products", icon: <ProductOutlined />, label: "Products" },
                            { key: "reviews", icon: <ShoppingCartOutlined />, label: "Reviews" },
                            { key: "orders", icon: <WechatWorkOutlined />, label: "Orders", extra: <Badge count={8} /> },
                            { key: "chat", icon: <WechatOutlined />, label: "Customers" },


                        ]}
            />

            {/* Help box */}
            <div style={{ marginTop: "auto", padding: 16 }}>
                <div
                    style={{
                        padding: 12,
                        borderRadius: 16,
                        border: `1px dashed ${token.colorBorderSecondary}`,
                    }}
                >
                    {!collapsed && (
                        <>
                            <Title level={5} style={{ marginBottom: 4 }}>Need Help?</Title>
                            <Text type="secondary">Docs • Shortcuts • Contact</Text>
                        </>
                    )}
                </div>
            </div>
        </Sider>
    );
}
