"use client";

import React, { useState } from "react";
import { Card, Table, Tabs, Space, Select, Input, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";

interface User {
    key: string;
    name: string;
    email: string;
    role: "admin" | "seller" | "customer";
    loginType: "system" | "google" | "github";
    status: "active" | "inactive";
}

const data: User[] = [
    {
        key: "1",
        name: "Nguyen Van A",
        email: "a@example.com",
        role: "admin",
        loginType: "system",
        status: "active",
    },
    {
        key: "2",
        name: "Tran Van B",
        email: "b@example.com",
        role: "seller",
        loginType: "google",
        status: "inactive",
    },
    {
        key: "3",
        name: "Le Thi C",
        email: "c@example.com",
        role: "customer",
        loginType: "github",
        status: "active",
    },
];

export default function ManageUsers() {
    const [role, setRole] = useState<string>("all");
    const [loginType, setLoginType] = useState<string>("all");
    const [searchEmail, setSearchEmail] = useState<string>("");

    const columns: ColumnsType<User> = [
        { title: "Name", dataIndex: "name", key: "name" },
        { title: "Email", dataIndex: "email", key: "email" },
        {
            title: "Role",
            dataIndex: "role",
            key: "role",
            render: (role) => {
                const colors: any = {
                    admin: "red",
                    seller: "blue",
                    customer: "green",
                };
                return <Tag color={colors[role]}>{role.toUpperCase()}</Tag>;
            },
        },
        {
            title: "Login Type",
            dataIndex: "loginType",
            key: "loginType",
            render: (t) => (
                <Tag color={t === "system" ? "purple" : t === "google" ? "volcano" : "geekblue"}>
                    {t.toUpperCase()}
                </Tag>
            ),
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            render: (s) => (
                <Tag color={s === "active" ? "success" : "default"}>
                    {s.toUpperCase()}
                </Tag>
            ),
        },
    ];

    // lọc dữ liệu demo
    const filteredData = data.filter((u) => {
        const roleOk = role === "all" || u.role === role;
        const typeOk = loginType === "all" || u.loginType === loginType;
        const emailOk = u.email.toLowerCase().includes(searchEmail.toLowerCase());
        return roleOk && typeOk && emailOk;
    });

    return (
        <Card title="User Management" style={{ borderRadius: 16 }}>
            <Space direction="vertical" style={{ width: "100%" }} size="large">
                {/* Tabs filter theo role */}
                <Tabs
                    defaultActiveKey="all"
                    onChange={(key) => setRole(key)}
                    items={[
                        { key: "all", label: "All" },
                        { key: "admin", label: "Admin" },
                        { key: "seller", label: "Seller" },
                        { key: "customer", label: "Customer" },
                    ]}
                />

                {/* Filter: login type + search */}
                <Space wrap>
                    <Select
                        defaultValue="all"
                        style={{ width: 200 }}
                        onChange={(val) => setLoginType(val)}
                        options={[
                            { value: "all", label: "All Login Types" },
                            { value: "system", label: "System" },
                            { value: "google", label: "Google" },
                            { value: "github", label: "GitHub" },
                        ]}
                    />
                    <Input.Search
                        placeholder="Search by email"
                        allowClear
                        onSearch={(val) => setSearchEmail(val)}
                        style={{ width: 250 }}
                    />
                </Space>

                {/* Table */}
                <Table<User>
                    columns={columns}
                    dataSource={filteredData}
                    pagination={{ pageSize: 5 }}
                    rowKey="key"
                    bordered
                />
            </Space>
        </Card>
    );
}
