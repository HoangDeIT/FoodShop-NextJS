"use client";

import React, { useEffect, useState } from "react";
import {
    Card,
    Table,
    Space,
    Input,
    Tag,
    Button,
    Modal,
    Popconfirm,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import { getCategories, deleteCategory } from "@/utils/actions/admin/action.categories";
import useApp from "antd/es/app/useApp";
import ModalCreateCategory from "./modal.create.categories";
import ModalUpdateCategory from "./modal.update.categories";

export default function ManageCategories() {
    const [categories, setCategories] = useState<ICategoryR[]>([]);
    const [meta, setMeta] = useState<IMeta>();
    const [current, setCurrent] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(10);
    const [searchName, setSearchName] = useState<string>("");

    const [isModalOpenCreate, setIsModalOpenCreate] = useState(false);
    const [isModalOpenUpdate, setIsModalOpenUpdate] = useState(false);
    const [idUpdate, setIdUpdate] = useState<string>("");

    const { message } = useApp();

    // 🔹 Lấy dữ liệu categories
    const getData = async () => {
        const query: any = {
            current,
            pageSize,
        };

        if (searchName) {
            query.name = `/${searchName}/i`; // regex search theo name
        }

        const res = await getCategories(query);
        if (res?.data) {
            setCategories(res.data.result ?? []);
            setMeta(res.data.meta);
        }
    };

    useEffect(() => {
        getData();
    }, [current, pageSize]);

    useEffect(() => {
        if (current === 1) getData();
        setCurrent(1);
    }, [searchName]);

    // 🔹 Xử lý xóa
    const handleDelete = async (id: string) => {
        try {
            const res = await deleteCategory(id);
            if (!res.error) {
                message.success("Xoá danh mục thành công!");
                await getData();
            } else {
                message.error(res.error ?? "Xoá danh mục thất bại!");
            }
        } catch (error) {
            message.error("Có lỗi xảy ra khi xoá danh mục!");
        }
    };

    // 🔹 Xử lý update
    const handleUpdate = (id: string) => {
        setIdUpdate(id);
        setIsModalOpenUpdate(true);
    };

    // 🔹 Cột bảng
    const columns: ColumnsType<ICategoryR> = [
        {
            title: "Image",
            dataIndex: "image",
            key: "image",
            render: (url) =>
                url ? (
                    <img
                        src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/public/images/categories/${url}`}
                        alt="category"
                        style={{ width: 50, height: 50, borderRadius: 8, objectFit: "cover" }}
                    />
                ) : (
                    <Tag color="default">No Image</Tag>
                ),
        },
        {
            title: "Icon",
            dataIndex: "icon",
            key: "icon",
            render: (url) =>
                url ? (
                    <img
                        src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/public/images/categories/${url}`}
                        alt="icon"
                        style={{ width: 30, height: 30, objectFit: "contain" }}
                    />
                ) : (
                    <Tag color="default">No Icon</Tag>
                ),
        },
        {
            title: "Name",
            dataIndex: "name",
            key: "name",
        },
        {
            title: "Description",
            dataIndex: "description",
            key: "description",
            render: (text) => text || <Tag color="default">No Description</Tag>,
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
                        title="Xác nhận xóa danh mục?"
                        description="Hành động này không thể hoàn tác."
                        okText="Yes"
                        cancelText="No"
                        okButtonProps={{ danger: true }}
                        onConfirm={() => handleDelete(record._id)}
                    >
                        <Button type="link" danger>
                            Delete
                        </Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <Card
            title="Category Management"
            style={{ borderRadius: 16 }}
            extra={
                <Button type="primary" onClick={() => setIsModalOpenCreate(true)}>
                    Add Category
                </Button>
            }
        >
            <Space direction="vertical" style={{ width: "100%" }} size="large">
                {/* Search theo name */}
                <Space wrap>
                    <Input.Search
                        placeholder="Search by category name"
                        allowClear
                        onSearch={(val) => setSearchName(val)}
                        style={{ width: 250 }}
                    />
                </Space>

                {/* Table */}
                <Table<ICategoryR>
                    columns={columns}
                    dataSource={categories}
                    pagination={{
                        pageSize: pageSize,
                        current: current,
                        total: meta?.total,
                        onChange: (page, pageSize) => {
                            setCurrent(page);
                            setPageSize(pageSize);
                        },
                    }}
                    rowKey="_id"
                    bordered
                />
            </Space>

            {/* Modal thêm & cập nhật (chưa code) */}
            <ModalCreateCategory
                isModalOpen={isModalOpenCreate}
                setIsModalOpen={setIsModalOpenCreate}
                getData={getData}
            />
            <ModalUpdateCategory
                isModalOpen={isModalOpenUpdate}
                setIsModalOpen={setIsModalOpenUpdate}
                categoryId={idUpdate}
                getData={getData}
            />
        </Card>
    );
}
