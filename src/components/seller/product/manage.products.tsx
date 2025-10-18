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
    Switch,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import {
    getProductsBySeller,
    deleteProduct,
    getSellerCategories,
    toggleActiveProduct,
} from "@/utils/actions/sellers/action.products";
import useApp from "antd/es/app/useApp";
import ModalCreateProduct from "./modal.create.products";
import ModalUpdateProduct from "./modal.update.products";

export default function ManageProducts() {
    const [products, setProducts] = useState<IProductR[]>([]);
    const [meta, setMeta] = useState<IMeta>();
    const [current, setCurrent] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(10);
    const [searchName, setSearchName] = useState<string>("");

    // 🆕 danh sách category để filter
    const [categories, setCategories] = useState<ICategoryR[]>([]);
    const [categoryId, setCategoryId] = useState<string>("all");

    const [isModalOpenCreate, setIsModalOpenCreate] = useState(false);
    const [isModalOpenUpdate, setIsModalOpenUpdate] = useState(false);
    const [idUpdate, setIdUpdate] = useState<string>("");

    const { message } = useApp();

    // 🔹 Lấy dữ liệu sản phẩm
    const getData = async () => {
        const query: any = { current, pageSize };
        if (searchName) query.name = `/${searchName}/i`;
        if (categoryId !== "all") query.category = categoryId;

        const res = await getProductsBySeller(query);
        console.log("check res: ", res);
        if (res?.data) {
            setProducts(res.data.result ?? []);
            setMeta(res.data.meta);
        }
    };

    // 🆕 Lấy danh sách categories cho seller
    const getCategoryList = async () => {
        const res = await getSellerCategories();
        if (res?.data) setCategories(res.data);
    };

    useEffect(() => {
        getData();
    }, [current, pageSize]);

    useEffect(() => {
        if (current === 1) getData();
        setCurrent(1);
    }, [searchName, categoryId]);

    // 🆕 load category list 1 lần khi mount
    useEffect(() => {
        getCategoryList();
    }, []);

    // 🔹 Xử lý xóa
    const handleDelete = async (id: string) => {
        try {
            const res = await deleteProduct(id);
            if (!res.error) {
                message.success("Xoá sản phẩm thành công!");
                await getData();
            } else message.error(res.error ?? "Xoá sản phẩm thất bại!");
        } catch {
            message.error("Có lỗi xảy ra khi xoá sản phẩm!");
        }
    };

    // 🔹 Xử lý update
    const handleUpdate = (id: string) => {
        setIdUpdate(id);
        setIsModalOpenUpdate(true);
    };

    // 🔹 Cột bảng
    const columns: ColumnsType<IProductR> = [
        {
            title: "Image",
            dataIndex: "image",
            key: "image",
            render: (url) =>
                url ? (
                    <img
                        src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/public/images/products/${url}`}
                        alt="product"
                        style={{ width: 60, height: 60, borderRadius: 8, objectFit: "cover" }}
                    />
                ) : (
                    <Tag color="default">No Image</Tag>
                ),
        },
        { title: "Name", dataIndex: "name", key: "name" },
        {
            title: "Category",
            dataIndex: ["category", "name"],
            key: "category",
            render: (_, record) =>
                typeof record.category === "object"
                    ? record.category.name
                    : record.category,
        },
        { title: "Base Price", dataIndex: "basePrice", key: "basePrice" },
        {
            title: "In Stock",
            dataIndex: "inStock",
            key: "inStock",
            render: (v, record) => (
                <Switch
                    checked={v}
                    checkedChildren="Active"
                    unCheckedChildren="Hidden"
                    onChange={async (checked) => {
                        try {
                            const res = await toggleActiveProduct(record._id, checked);
                            if (!res.error) {
                                message.success(`Sản phẩm đã được ${checked ? "kích hoạt" : "ẩn"}`);
                                record.inStock = checked; // cập nhật nhanh UI
                                setProducts([...products]);
                            } else {
                                message.error(res.error ?? "Cập nhật thất bại!");
                            }
                        } catch {
                            message.error("Lỗi kết nối server!");
                        }
                    }}
                />
            ),
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
                        title="Xoá sản phẩm?"
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
            title="Product Management"
            style={{ borderRadius: 16 }}
            extra={
                <Button type="primary" onClick={() => setIsModalOpenCreate(true)}>
                    Add Product
                </Button>
            }
        >
            <Space direction="vertical" style={{ width: "100%" }} size="large">
                {/* 🔍 Bộ lọc */}
                <Space wrap>
                    <Input.Search
                        placeholder="Search by product name"
                        allowClear
                        onSearch={(val) => setSearchName(val)}
                        style={{ width: 250 }}
                    />
                    <Select
                        placeholder="Filter by category"
                        value={categoryId}
                        style={{ width: 250 }}
                        onChange={(v) => setCategoryId(v)}
                        options={[
                            { label: "All categories", value: "all" },
                            ...categories.map((c) => ({
                                label: c.name,
                                value: c._id,
                            })),
                        ]}
                    />
                </Space>

                {/* 🧾 Table */}
                <Table<IProductR>
                    columns={columns}
                    dataSource={products}
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

            {/* Modal thêm / cập nhật */}
            <ModalCreateProduct
                isModalOpen={isModalOpenCreate}
                setIsModalOpen={setIsModalOpenCreate}
                getData={getData}
            />
            <ModalUpdateProduct
                isModalOpen={isModalOpenUpdate}
                setIsModalOpen={setIsModalOpenUpdate}
                productId={idUpdate}
                getData={getData}
            />
        </Card>
    );
}
