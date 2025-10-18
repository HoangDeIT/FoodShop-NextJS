"use client";

import { Button, Form, Input, Modal, Upload } from "antd";
import { UploadOutlined, CloseCircleFilled } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { getCategoryById, updateCategory, uploadFile } from "@/utils/actions/admin/action.categories";
import useApp from "antd/es/app/useApp";

interface ModalUpdateCategoryProps {
    isModalOpen: boolean;
    setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    categoryId: string;
    getData: () => Promise<void>;
}

const ModalUpdateCategory = ({
    isModalOpen,
    setIsModalOpen,
    categoryId,
    getData,
}: ModalUpdateCategoryProps) => {
    const [form] = Form.useForm<ICreateCategory>();
    const [imageUrl, setImageUrl] = useState<string>("");
    const [iconUrl, setIconUrl] = useState<string>("");
    const [fileImage, setFileImage] = useState<File | null>(null);
    const [fileIcon, setFileIcon] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const { message } = useApp();

    const fetchCategory = async () => {
        if (!categoryId) return;
        setLoading(true);
        try {
            const res = await getCategoryById(categoryId);
            if (res?.data) {
                form.setFieldsValue({
                    name: res.data.name,
                    description: res.data.description,
                });
                if (res.data.image) {
                    setImageUrl(`${process.env.NEXT_PUBLIC_BACKEND_URL}/public/images/categories/${res.data.image}`);
                }
                if (res.data.icon) {
                    setIconUrl(`${process.env.NEXT_PUBLIC_BACKEND_URL}/public/images/categories/${res.data.icon}`);
                }
            }
        } catch (error) {
            message.error("Không thể tải thông tin danh mục!");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategory();
    }, [categoryId, isModalOpen]);

    const getBase64 = (file: File, callback: (url: string) => void) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => callback(reader.result as string);
    };

    const beforeUploadImage = (file: File) => {
        if (!file.type.startsWith("image/")) {
            message.error("Chỉ được upload file ảnh!");
            return Upload.LIST_IGNORE;
        }
        getBase64(file, (url) => setImageUrl(url));
        setFileImage(file);
        return false;
    };

    const beforeUploadIcon = (file: File) => {
        if (!file.type.startsWith("image/")) {
            message.error("Chỉ được upload file ảnh!");
            return Upload.LIST_IGNORE;
        }
        getBase64(file, (url) => setIconUrl(url));
        setFileIcon(file);
        return false;
    };

    const handleOk = async () => {
        setLoading(true);
        try {
            const values = await form.validateFields();
            let image = imageUrl;
            let icon = iconUrl;

            // 🖼️ Upload ảnh chính nếu có file mới
            if (fileImage) {
                const res = await uploadFile(fileImage, "categories");
                if (res?.data?.fileName) image = res.data.fileName;
            } else if (imageUrl && imageUrl.startsWith("http")) {
                // Ảnh cũ từ backend → chỉ lấy tên file
                image = imageUrl.split("/").pop() || "";
            }

            // 🎨 Upload icon nếu có file mới
            if (fileIcon) {
                const res = await uploadFile(fileIcon, "categories");
                if (res?.data?.fileName) icon = res.data.fileName;
            } else if (iconUrl && iconUrl.startsWith("http")) {
                // Icon cũ từ backend → chỉ lấy tên file
                icon = iconUrl.split("/").pop() || "";
            }

            // ❌ Nếu xoá ảnh hoặc icon
            if (!imageUrl && !fileImage) image = "";
            if (!iconUrl && !fileIcon) icon = "";

            const payload = { ...values, image, icon };
            const res = await updateCategory(categoryId, payload);

            if (!res.error) {
                message.success("Cập nhật danh mục thành công!");
                form.resetFields();
                setImageUrl("");
                setIconUrl("");
                setFileImage(null);
                setFileIcon(null);
                setIsModalOpen(false);
                await getData();
            } else {
                message.error(res.error ?? "Something went wrong!");
            }
        } catch (error) {
            message.error("Có lỗi xảy ra khi cập nhật danh mục!");
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        form.resetFields();
        setImageUrl("");
        setIconUrl("");
        setFileImage(null);
        setFileIcon(null);
        setIsModalOpen(false);
    };

    return (
        <Modal
            title="Update Category"
            open={isModalOpen}
            onOk={handleOk}
            onCancel={handleClose}
            confirmLoading={loading}
        >
            <Form form={form} layout="vertical">
                <Form.Item
                    name="name"
                    label="Category Name"
                    rules={[{ required: true, message: "Tên danh mục không được bỏ trống!" }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item name="description" label="Description">
                    <Input.TextArea rows={3} />
                </Form.Item>


                <Form.Item label="Image">
                    {!imageUrl && (
                        <Upload
                            beforeUpload={beforeUploadImage}
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
                                            : `${process.env.NEXT_PUBLIC_BACKEND_URL}/public/images/categories/${imageUrl}`
                                }
                                alt="preview"
                                style={{ width: 80, height: 80, borderRadius: 8 }}
                            />
                            <CloseCircleFilled
                                onClick={() => {
                                    setImageUrl("");
                                    setFileImage(null);
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


                <Form.Item label="Icon">
                    {!iconUrl && (
                        <Upload
                            beforeUpload={beforeUploadIcon}
                            showUploadList={false}
                            accept="image/*"
                        >
                            <Button icon={<UploadOutlined />}>Upload Icon</Button>
                        </Upload>
                    )}

                    {iconUrl && (
                        <div
                            style={{
                                position: "relative",
                                display: "inline-block",
                                marginTop: 12,
                            }}
                        >
                            <img
                                src={
                                    iconUrl.startsWith("data:")
                                        ? iconUrl
                                        : iconUrl.startsWith("http")
                                            ? iconUrl
                                            : `${process.env.NEXT_PUBLIC_BACKEND_URL}/public/images/categories/${iconUrl}`
                                }
                                alt="preview"
                                style={{ width: 50, height: 50 }}
                            />
                            <CloseCircleFilled
                                onClick={() => {
                                    setIconUrl("");
                                    setFileIcon(null);
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

export default ModalUpdateCategory;
