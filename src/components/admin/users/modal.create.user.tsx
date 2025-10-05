import { Button, Form, Input, message, Modal, Select, Upload } from "antd"
import { UploadOutlined, CloseCircleFilled } from "@ant-design/icons";
import { useState } from "react";
import { createUser, uploadFile } from "@/utils/actions/admin/action.users";
import useApp from "antd/es/app/useApp";
const ModalCreateUser = ({ isModalOpen, setIsModalOpen, getData }: { isModalOpen: boolean, setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>, getData: () => Promise<void> }) => {
    const [avatarUrl, setAvatarUrl] = useState<string>("");
    const [form] = Form.useForm<ICreateUser>();
    const [file, setFile] = useState<File | null>(null)
    const { message } = useApp();
    const getBase64 = (file: File, callback: (url: string) => void) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => callback(reader.result as string);
    };
    const beforeUpload = (file: File) => {
        const isImage = file.type.startsWith("image/");
        if (!isImage) {
            message.error("Chỉ được upload file ảnh!");
            return Upload.LIST_IGNORE;
        }
        getBase64(file, (url) => setAvatarUrl(url));
        setFile(file)
        return false; // chặn upload thật, chỉ preview
    };
    const handleOk = async () => {

        const values = await form.validateFields();

        let avatar = "";
        if (file) {
            // 1. Upload avatar trước
            const res = await uploadFile(file, "users");
            console.log("check res: ", res);
            if (res?.data?.fileName) {
                avatar = res.data?.fileName;
                console.log("check avatar: ", avatar);
            }
        }
        const payload = {
            ...values,
            avatar: avatar || "", // nếu không upload thì để trống
        };
        console.log("check payload: ", payload);
        const res = await createUser(payload);
        if (!res.error) {
            setAvatarUrl("");
            setFile(null);
            setIsModalOpen(false);
            await getData();
            form.resetFields();
            message.success("Thêm người dung thanh cong!");
        } else {
            message.error(res.error ?? "Something went wrong!");
        }
    }
    const handleClose = () => {
        setAvatarUrl("");
        setFile(null);
        setIsModalOpen(false);
        form.resetFields();
    }
    return (
        <Modal
            title="Add User"
            open={isModalOpen}
            onOk={handleOk}
            onCancel={handleClose}
        >
            <Form form={form} layout="vertical">
                <Form.Item
                    name="name"
                    label="Name"
                    rules={[{ required: true, message: "Tên không được bỏ trống!" }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    name="email"
                    label="Email"
                    rules={[
                        { required: true, message: "Email bắt buộc!" },
                        { type: "email", message: "Email không hợp lệ!" }
                    ]}
                >
                    <Input />
                </Form.Item>

                {/* Thêm Password */}
                <Form.Item
                    name="password"
                    label="Password"
                    rules={[
                        { required: true, message: "Password bắt buộc!" },
                        { min: 6, message: "Password phải có ít nhất 6 ký tự!" },
                        {
                            pattern: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{6,}$/,
                            message: "Password phải chứa cả chữ cái và số!",
                        },
                    ]}
                >
                    <Input.Password placeholder="Nhập mật khẩu" />
                </Form.Item>
                <Form.Item name="role" label="Role" rules={[{ required: true }]}>
                    <Select
                        options={[
                            { value: "admin", label: "Admin" },
                            { value: "seller", label: "Seller" },
                            { value: "customer", label: "Customer" },
                        ]}
                    />
                </Form.Item>
                <Form.Item name="status" label="Status" rules={[{ required: true }]}>
                    <Select
                        options={[
                            { value: "active", label: "Active" },
                            { value: "inactive", label: "Inactive" },
                        ]}
                    />
                </Form.Item>
                <Form.Item label="Avatar">
                    <Upload
                        beforeUpload={beforeUpload}
                        showUploadList={false}
                        accept="image/*"
                    >
                        <Button icon={<UploadOutlined />}>Upload Avatar</Button>
                    </Upload>
                    {avatarUrl && (
                        <div
                            style={{
                                position: "relative",
                                display: "inline-block",
                                marginTop: 12,
                            }}
                        >
                            <img
                                src={avatarUrl}
                                alt="preview"
                                style={{ width: 80, height: 80, borderRadius: "50%" }}
                            />
                            <CloseCircleFilled
                                onClick={() => {
                                    setAvatarUrl("");
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
    )
}
export default ModalCreateUser;