"use client";
import { Layout, FloatButton, Button, Dropdown, Space, Avatar } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { useState } from "react";
import Sidebar from "./side.bar";
import { signOut } from "next-auth/react";
import useApp from "antd/es/app/useApp";


const { Header, Content } = Layout;

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const [collapsed, setCollapsed] = useState(false);
    const { message } = useApp();
    const handleMenuClick = ({ key }: { key: string }) => {
        switch (key) {
            case "profile":
                message.info("Đi tới trang hồ sơ...");
                // router.push("/profile"); nếu dùng Next.js
                break;
            case "password":
                message.info("Đi tới đổi mật khẩu...");
                // router.push("/auth/change-password");
                break;
            case "logout":
                message.success("Đăng xuất thành công");
                signOut(); // với NextAuth
                break;
            default:
                break;
        }
    };
    const menuItems = [
        { key: "profile", label: "Profile" },
        { key: "password", label: "Đổi mật khẩu" },
        { type: "divider" },
        { key: "logout", label: "Đăng xuất" },
    ];
    return (
        <Layout style={{ minHeight: "100vh" }}>
            {/* Sidebar */}
            <Sidebar setCollapsed={setCollapsed} collapsed={collapsed} />

            {/* Main */}
            <Layout>
                <Header style={{ background: "#fff", padding: 0, textAlign: "center" }}>
                    <Dropdown
                        //@ts-ignore
                        menu={{ items: menuItems, onClick: handleMenuClick }}
                        placement="bottomRight"
                        arrow
                    >
                        <Space style={{ cursor: "pointer" }}>
                            <Avatar size="large" icon={<UserOutlined />} />
                        </Space>
                    </Dropdown>
                </Header>

                <Content
                    style={{
                        margin: 24,
                        background: "#fff",
                        borderRadius: 12,
                        padding: 24,
                        minHeight: "80vh",
                        position: "relative",
                    }}
                >
                    {children}


                </Content>
            </Layout>
        </Layout>
    );
}
