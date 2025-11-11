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
    toggleActiveProduct,
} from "@/utils/actions/sellers/action.products";
import useApp from "antd/es/app/useApp";
import ModalCreateProduct from "./modal.create.products";
import ModalUpdateProduct from "./modal.update.products";

export default function ManageProductsClient({
    initialProducts,
    initialMeta,
    initialCategories,
}: {
    initialProducts: IProductR[];
    initialMeta: IMeta;
    initialCategories: ICategoryR[];
}) {
    const [products, setProducts] = useState(initialProducts);
    const [meta, setMeta] = useState(initialMeta);
    const [categories, setCategories] = useState(initialCategories);
    const [current, setCurrent] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(10);
    const [searchName, setSearchName] = useState<string>("");
    const [categoryId, setCategoryId] = useState<string>("all");

    const [isModalOpenCreate, setIsModalOpenCreate] = useState(false);
    const [isModalOpenUpdate, setIsModalOpenUpdate] = useState(false);
    const [idUpdate, setIdUpdate] = useState<string>("");

    const { message } = useApp();

    // ✅ Fetch động khi người dùng tương tác
    const getData = async () => {
        const query: any = { current, pageSize };
        if (searchName) query.name = `/${searchName}/i`;
        if (categoryId !== "all") query.category = categoryId;

        const res = await getProductsBySeller(query);
        if (res?.data) {
            setProducts(res.data.result ?? []);
            setMeta(res.data.meta);
        }
    };

    useEffect(() => {
        getData();
    }, [current, pageSize]);

    useEffect(() => {
        if (current === 1) getData();
        setCurrent(1);
    }, [searchName, categoryId]);

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

    const handleUpdate = (id: string) => {
        setIdUpdate(id);
        setIsModalOpenUpdate(true);
    };

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
                                record.inStock = checked;
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
