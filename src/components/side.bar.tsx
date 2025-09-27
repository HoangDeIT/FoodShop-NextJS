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
} from "@ant-design/icons";

const { Sider } = Layout;
const { Title, Text } = Typography;

export default function Sidebar({ collapsed, setCollapsed }: { collapsed: boolean, setCollapsed: (collapsed: boolean) => void }) {
    const { token } = theme.useToken();

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
                {!collapsed && <Title level={5} style={{ margin: 0 }}>Aamir Admin</Title>}
            </div>

            {/* Menu */}
            <Menu
                mode="inline"
                defaultSelectedKeys={["dashboard"]}
                style={{ borderInline: "none" }}
                items={[
                    { key: "section-overview", type: "group", label: "Overview" },
                    { key: "dashboard", icon: <BarChartOutlined />, label: "Dashboard" },
                    { key: "inventory", icon: <AppstoreOutlined />, label: "Inventory" },
                    { key: "orders", icon: <ShoppingCartOutlined />, label: "Orders", extra: <Badge count={8} /> },
                    { key: "customers", icon: <TeamOutlined />, label: "Customers" },
                    { key: "divider-1", type: "divider" as any },
                    { key: "section-settings", type: "group", label: "Settings" },
                    { key: "settings", icon: <SettingOutlined />, label: "Preferences" },
                    // 👉 Thêm nhiều mục test scroll
                    ...Array.from({ length: 15 }, (_, i) => ({
                        key: `extra-${i}`,
                        icon: <AppstoreOutlined />,
                        label: `Extra ${i + 1}`,
                    })),
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
