"use client";

import {
    Button,
    Form,
    Input,
    InputNumber,
    Modal,
    Upload,
    Select,
    Space,
    Divider,
    Checkbox,
} from "antd";
import { UploadOutlined, CloseCircleFilled, PlusOutlined, MinusCircleOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import useApp from "antd/es/app/useApp";
import { uploadFile, createProduct, getSellerCategories } from "@/utils/actions/sellers/action.products";
import { getCategoriesAll } from "@/utils/actions/admin/action.categories";
const ModalCreateProduct = ({
    isModalOpen,
    setIsModalOpen,
    getData,
}: {
    isModalOpen: boolean;
    setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    getData: () => Promise<void>;
}) => {
    const [form] = Form.useForm<ICreateProduct>();
    const [imageUrl, setImageUrl] = useState<string>("");
    const [file, setFile] = useState<File | null>(null);
    const [categories, setCategories] = useState<ICategoryR[]>([]);
    const { message } = useApp();

    // 🔹 Lấy danh sách category seller có
    const fetchCategories = async () => {
        const res = await getCategoriesAll();
        if (res?.data) setCategories(res.data);
    };

    useEffect(() => {
        if (isModalOpen) fetchCategories();
    }, [isModalOpen]);

    const getBase64 = (file: File, callback: (url: string) => void) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => callback(reader.result as string);
    };

    const beforeUpload = (file: File) => {
        if (!file.type.startsWith("image/")) {
            message.error("Chỉ được upload file ảnh!");
            return Upload.LIST_IGNORE;
        }
        getBase64(file, (url) => setImageUrl(url));
        setFile(file);
        return false;
    };

    const handleOk = async () => {
        const values = await form.validateFields();

        let image = "";
        if (file) {
            const res = await uploadFile(file, "products");
            if (res?.data?.fileName) image = res.data.fileName;
        }

        const payload = { ...values, image };
        const res = await createProduct(payload);
        if (!res.error) {
            message.success("Thêm sản phẩm thành công!");
            form.resetFields();
            setFile(null);
            setImageUrl("");
            setIsModalOpen(false);
            await getData();
        } else {
            message.error(res.error ?? "Thêm thất bại!");
        }
    };

    const handleClose = () => {
        form.resetFields();
        setFile(null);
        setImageUrl("");
        setIsModalOpen(false);
    };

    return (
        <Modal
            title="Add Product"
            open={isModalOpen}
            onOk={handleOk}
            onCancel={handleClose}
            width={700}
        >
            <Form form={form} layout="vertical">
                <Form.Item
                    name="name"
                    label="Product Name"
                    rules={[{ required: true, message: "Tên sản phẩm bắt buộc!" }]}
                >
                    <Input placeholder="Nhập tên sản phẩm" />
                </Form.Item>

                <Form.Item name="description" label="Description">
                    <Input.TextArea rows={3} placeholder="Mô tả sản phẩm" />
                </Form.Item>

                <Form.Item
                    name="basePrice"
                    label="Base Price (₫)"
                    rules={[{ required: true, message: "Giá cơ bản bắt buộc!" }]}
                >
                    <InputNumber min={0} style={{ width: "100%" }} />
                </Form.Item>

                <Form.Item
                    name="category"
                    label="Category"
                    rules={[{ required: true, message: "Vui lòng chọn danh mục!" }]}
                >
                    <Select
                        placeholder="Chọn danh mục"
                        options={categories.map((c) => ({
                            label: c.name,
                            value: c._id,
                        }))}
                    />
                </Form.Item>

                {/* Sizes */}
                <Divider>Sizes</Divider>
                <Form.List name="sizes">
                    {(fields, { add, remove }) => (
                        <>
                            {fields.map(({ key, name, ...rest }) => (
                                <Space
                                    key={key}
                                    align="baseline"
                                    style={{
                                        display: "flex",
                                        flexWrap: "wrap",
                                        marginBottom: 8, // ✅ tạo khoảng cách
                                    }}
                                >
                                    <Form.Item
                                        {...rest}
                                        name={[name, "name"]}
                                        rules={[{ required: true, message: "Nhập tên size" }]}
                                    >
                                        <Input placeholder="Tên size" style={{ width: 160 }} />
                                    </Form.Item>
                                    <Form.Item
                                        {...rest}
                                        name={[name, "price"]}
                                        rules={[{ required: true, message: "Nhập giá" }]}
                                    >
                                        <InputNumber placeholder="Giá thêm" style={{ width: 120 }} />
                                    </Form.Item>
                                    <Form.Item
                                        {...rest}
                                        name={[name, "isDefault"]}
                                        valuePropName="checked"
                                    >
                                        <Checkbox>Default</Checkbox>
                                    </Form.Item>

                                    <MinusCircleOutlined
                                        onClick={() => remove(name)}
                                        style={{ color: "red" }}
                                    />
                                </Space>
                            ))}
                            <Form.Item>
                                <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                                    Add Size
                                </Button>
                            </Form.Item>
                        </>
                    )}
                </Form.List>

                {/* Toppings */}
                <Divider>Toppings</Divider>
                <Form.List name="toppings">
                    {(fields, { add, remove }) => (
                        <>
                            {fields.map(({ key, name, ...rest }) => (
                                <Space
                                    key={key}
                                    align="baseline"
                                    style={{
                                        display: "flex",
                                        flexWrap: "wrap",
                                        marginBottom: 8,
                                    }}
                                >
                                    <Form.Item
                                        {...rest}
                                        name={[name, "name"]}
                                        rules={[{ required: true, message: "Nhập tên topping" }]}
                                    >
                                        <Input placeholder="Tên topping" style={{ width: 200 }} />
                                    </Form.Item>
                                    <Form.Item
                                        {...rest}
                                        name={[name, "price"]}
                                        rules={[{ required: true, message: "Nhập giá topping" }]}
                                    >
                                        <InputNumber placeholder="Giá thêm" style={{ width: 120 }} />
                                    </Form.Item>
                                    <MinusCircleOutlined
                                        onClick={() => remove(name)}
                                        style={{ color: "red" }}
                                    />
                                </Space>

                            ))}
                            <Form.Item>
                                <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                                    Add Topping
                                </Button>
                            </Form.Item>
                        </>
                    )}
                </Form.List>

                {/* Upload ảnh */}
                <Divider>Image</Divider>
                <Form.Item label="Product Image">
                    {!imageUrl && (
                        <Upload
                            beforeUpload={beforeUpload}
                            showUploadList={false}
                            accept="image/*"
                        >
                            <Button icon={<UploadOutlined />}>Upload Image</Button>
                        </Upload>
                    )}

                    {imageUrl && (
                        <div
                            style={{
                                position: "relative",
                                display: "inline-block",
                                marginTop: 12,
                            }}
                        >
                            <img
                                src={imageUrl}
                                alt="preview"
                                style={{ width: 120, height: 120, borderRadius: 8 }}
                            />
                            <CloseCircleFilled
                                onClick={() => {
                                    setImageUrl("");
                                    setFile(null);
                                }}
                                style={{
                                    position: "absolute",
                                    top: -8,
                                    right: -8,
                                    fontSize: 20,
                                    color: "#f5222d",
                                    cursor: "pointer",
                                    background: "#fff",
                                    borderRadius: "50%",
                                }}
                            />
                        </div>
                    )}
                </Form.Item>

            </Form>
        </Modal>
    );
};

export default ModalCreateProduct;
