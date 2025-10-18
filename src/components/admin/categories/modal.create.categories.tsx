"use client";

import { Button, Form, Input, message, Modal, Upload } from "antd";
import { UploadOutlined, CloseCircleFilled } from "@ant-design/icons";
import { useState } from "react";
import { createCategory, uploadFile } from "@/utils/actions/admin/action.categories";
import useApp from "antd/es/app/useApp";

const ModalCreateCategory = ({
    isModalOpen,
    setIsModalOpen,
    getData,
}: {
    isModalOpen: boolean;
    setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    getData: () => Promise<void>;
}) => {
    const [form] = Form.useForm<ICreateCategory>();
    const [imageUrl, setImageUrl] = useState<string>("");
    const [iconUrl, setIconUrl] = useState<string>("");
    const [fileImage, setFileImage] = useState<File | null>(null);
    const [fileIcon, setFileIcon] = useState<File | null>(null);
    const { message } = useApp();

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
        const values = await form.validateFields();

        let image = "";
        let icon = "";

        if (fileImage) {
            const res = await uploadFile(fileImage, "categories");
            if (res?.data?.fileName) image = res.data.fileName;
        }

        if (fileIcon) {
            const res = await uploadFile(fileIcon, "categories");
            if (res?.data?.fileName) icon = res.data.fileName;
        }

        const payload = { ...values, image, icon };
        const res = await createCategory(payload);

        if (!res.error) {
            message.success("Thêm danh mục thành công!");
            form.resetFields();
            setFileImage(null);
            setFileIcon(null);
            setImageUrl("");
            setIconUrl("");
            setIsModalOpen(false);
            await getData();
        } else {
            message.error(res.error ?? "Something went wrong!");
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
            title="Add Category"
            open={isModalOpen}
            onOk={handleOk}
            onCancel={handleClose}
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
                                src={imageUrl}
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
                                src={iconUrl}
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

export default ModalCreateCategory;
