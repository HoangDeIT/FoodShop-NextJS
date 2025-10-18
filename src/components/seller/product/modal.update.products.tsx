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
import { uploadFile, updateProduct, getProductById, getSellerCategories } from "@/utils/actions/sellers/action.products";
import { getCategoriesAll } from "@/utils/actions/admin/action.categories";

interface ModalUpdateProductProps {
    isModalOpen: boolean;
    setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    productId: string;
    getData: () => Promise<void>;
}

const ModalUpdateProduct = ({
    isModalOpen,
    setIsModalOpen,
    productId,
    getData,
}: ModalUpdateProductProps) => {
    const [form] = Form.useForm<ICreateProduct>();
    const [imageUrl, setImageUrl] = useState<string>("");
    const [file, setFile] = useState<File | null>(null);
    const [categories, setCategories] = useState<ICategoryR[]>([]);
    const [loading, setLoading] = useState(false);
    const { message } = useApp();

    const fetchCategories = async () => {
        const res = await getCategoriesAll();
        if (res?.data) setCategories(res.data);
    };


    const fetchProduct = async () => {
        if (!productId) return;
        setLoading(true);
        const res = await getProductById(productId);
        if (res?.data) {
            const p = res.data;
            form.setFieldsValue({
                name: p.name,
                description: p.description,
                basePrice: p.basePrice,
                category: typeof p.category === "string" ? p.category : p.category?._id,
                sizes: p.sizes ?? [],
                toppings: p.toppings ?? [],
            });
            if (p.image)
                setImageUrl(
                    p.image.startsWith("http")
                        ? p.image
                        : `${process.env.NEXT_PUBLIC_BACKEND_URL}/public/images/products/${p.image}`
                );
        }
        setLoading(false);
    };

    useEffect(() => {
        if (isModalOpen) {
            fetchProduct();
            fetchCategories();
        }
    }, [isModalOpen, productId]);

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
        setLoading(true);
        const values = await form.validateFields();
        let image = imageUrl;

        if (file) {
            const res = await uploadFile(file, "products");
            if (res?.data?.fileName) image = res.data.fileName;
        } else if (imageUrl && imageUrl.startsWith("http")) {
            // 🧩 Nếu là URL đầy đủ (ảnh cũ) → chỉ lấy tên file
            const parts = imageUrl.split("/");
            image = parts[parts.length - 1]; // Lấy "abc.jpg"
        }

        const payload = { ...values, image };
        const res = await updateProduct(productId, payload);

        if (!res.error) {
            message.success("Cập nhật sản phẩm thành công!");
            form.resetFields();
            setImageUrl("");
            setFile(null);
            setIsModalOpen(false);
            await getData();
        } else {
            message.error(res.error ?? "Cập nhật thất bại!");
        }
        setLoading(false);
    };

    const handleClose = () => {
        form.resetFields();
        setImageUrl("");
        setFile(null);
        setIsModalOpen(false);
    };

    return (
        <Modal
            title="Update Product"
            open={isModalOpen}
            onOk={handleOk}
            onCancel={handleClose}
            confirmLoading={loading}
            width={700}
        >
            <Form form={form} layout="vertical">
                <Form.Item
                    name="name"
                    label="Product Name"
                    rules={[{ required: true, message: "Tên sản phẩm bắt buộc!" }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item name="description" label="Description">
                    <Input.TextArea rows={3} />
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
                                <Button
                                    type="dashed"
                                    onClick={() => add()}
                                    block
                                    icon={<PlusOutlined />}
                                >
                                    Add Size
                                </Button>
                            </Form.Item>
                        </>
                    )}
                </Form.List>

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
                                src={
                                    imageUrl.startsWith("data:")
                                        ? imageUrl
                                        : imageUrl.startsWith("http")
                                            ? imageUrl
                                            : `${process.env.NEXT_PUBLIC_BACKEND_URL}/public/images/products/${imageUrl}`
                                }
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

export default ModalUpdateProduct;
