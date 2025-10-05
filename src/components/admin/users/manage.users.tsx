"use client";

import React, { useEffect, useState } from "react";
import {
    Card,
    Table,
    Tabs,
    Space,
    Input,
    Tag,
    Button,
    Modal,
    Form,
    Select,
    Upload,
    Popconfirm,
} from "antd";
import type { ColumnsType } from "antd/es/table";

import qs from "qs";
import { deleteUser, getUsers } from "@/utils/actions/admin/action.users";
import ModalCreateUser from "./modal.create.user";
import { get } from "http";
import ModalUpdateUser from "./modal.update.user";
import useApp from "antd/es/app/useApp";


export default function ManageUsers() {
    const [users, setUsers] = useState<IUserR[]>();
    const { message } = useApp();

    // Modal state
    const [isModalOpenCreate, setIsModalOpenCreate] = useState(false);
    const [isModalOpenUpdate, setIsModalOpenUpdate] = useState(false);
    const [idUpdate, setIdUpdate] = useState<string>("");
    //logic get data
    const [current, setCurrent] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(10);
    const [role, setRole] = useState<string>("all");
    const [searchEmail, setSearchEmail] = useState<string>("");
    const [query, setQuery] = useState<string>("");
    const [meta, setMeta] = useState<IMeta>();
    const getData = async () => {
        // tạo object query
        const query: any = {
            current,
            pageSize,
        };

        if (role && role !== "all") {
            query.role = role; // role=admin
        }

        if (searchEmail) {
            // email=/keyword/i để aqp hiểu regex
            query.email = `/${searchEmail}/i`;
        }
        setQuery(query);
        const res = await getUsers(query);
        setUsers(res.data!.result ?? []);
        setMeta(res.data!.meta);
    };
    useEffect(() => {
        getData();
    }, [current, pageSize]);
    useEffect(() => {
        console.log("role", role);
        if (current === 1) getData();
        setCurrent(1);
    }, [role, searchEmail])

    // xoá user
    const handleUpdate = (_id: string) => {
        setIdUpdate(_id);
        setIsModalOpenUpdate(true);
    };

    const handleDelete = async (_id: string) => {
        try {
            //   setLoading(true); // nếu bạn có state loading
            const res = await deleteUser(_id);
            console.log("check res delete:", res)
            if (!res.error) {
                message.success("Xoá user thành công!");
                await getData(); // load lại list sau khi xoá
            } else {
                message.error(res.error ?? "Xoá user thất bại!");
            }
        } catch (err) {
            //  console.error("Delete user error:", err);
            message.error("Có lỗi xảy ra khi xoá user!");
        } finally {
            //  setLoading(false); // luôn tắt loading dù thành công hay lỗi
        }
    };


    const columns: ColumnsType<IUserR> = [
        {
            title: "Avatar",
            dataIndex: "avatar",
            key: "avatar",
            render: (url) =>
                url ? (
                    <img src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/public/images/users/${url}`} alt="avatar" style={{ width: 40, height: 40, borderRadius: "50%" }} />
                ) : (
                    <Tag color="default">No Avatar</Tag>
                ),
        },
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
            title: "Status",
            dataIndex: "status",
            key: "status",
            render: (s) => {
                const value = s ?? "active"; // mặc định là "active" nếu undefined
                return (
                    <Tag color={value === "active" ? "success" : "default"}>
                        {value.toUpperCase()}
                    </Tag>
                );
            },

        },
        {
            title: "Action",
            key: "action",
            render: (_, record) => (
                <Space>
                    <Button type="link" onClick={() => handleUpdate(record._id)}>
                        Update
                    </Button>
                    <Popconfirm
                        title={<div>Bạn có chắc muốn xóa user này ?</div>}
                        description="Hành động này không thể hoàn tác."
                        okText="Yes"
                        cancelText="No"
                        okButtonProps={{ danger: true }}
                        onConfirm={() => handleDelete(record._id)} // hàm xoá thật sự
                    >
                        <Button type="link" danger>
                            Delete
                        </Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    // // lọc dữ liệu
    // const filteredData = users.filter((u) => {
    //     const roleOk = role === "all" || u.role === role;
    //     const emailOk = u.email.toLowerCase().includes(searchEmail.toLowerCase());
    //     return roleOk && emailOk;
    // });

    return (
        <Card
            title="User Management"
            style={{ borderRadius: 16 }}
            extra={
                <Button type="primary" onClick={() => setIsModalOpenCreate(true)}>
                    Add User
                </Button>
            }
        >
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

                {/* Filter: search */}
                <Space wrap>
                    <Input.Search
                        placeholder="Search by email"
                        allowClear
                        onSearch={(val) => setSearchEmail(val)}
                        style={{ width: 250 }}
                    />
                </Space>

                {/* Table */}
                <Table<IUserR>
                    columns={columns}
                    dataSource={users ?? []}
                    pagination={{
                        pageSize: pageSize,//test
                        current: current,//test
                        total: meta?.total,//test
                        onChange: (page, pageSize) => {
                            setCurrent(page);
                            setPageSize(pageSize);
                        },
                    }}
                    rowKey="_id"
                    bordered
                />
            </Space>

            {/* Modal thêm user */}
            <ModalCreateUser
                isModalOpen={isModalOpenCreate}
                setIsModalOpen={setIsModalOpenCreate}
                getData={getData}
            />
            <ModalUpdateUser
                isModalOpen={isModalOpenUpdate}
                setIsModalOpen={setIsModalOpenUpdate}
                userId={idUpdate}
                getData={getData}
            />
        </Card>
    );
}
