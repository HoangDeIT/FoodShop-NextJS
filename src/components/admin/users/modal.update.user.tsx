import { Button, Form, Input, Modal, Select, Upload } from "antd"
import { UploadOutlined, CloseCircleFilled } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { getUserById, updateUser, uploadFile } from "@/utils/actions/admin/action.users";
import useApp from "antd/es/app/useApp";

interface ModalUpdateUserProps {
    isModalOpen: boolean;
    setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    userId: string; // truyền id từ component cha
    getData: () => Promise<void>;
}

const ModalUpdateUser = ({ isModalOpen, setIsModalOpen, userId, getData }: ModalUpdateUserProps) => {
    const [avatarUrl, setAvatarUrl] = useState<string>("");
    const [file, setFile] = useState<File | null>(null);
    const [form] = Form.useForm<ICreateUser>();
    const [loading, setLoading] = useState(false);
    const { message } = useApp();
    const fetchUser = async () => {
        setLoading(true);
        try {
            if (userId) {
                const res = await getUserById(userId);
                console.log("check res: ", res);
                if (res?.data) {
                    form.setFieldsValue({
                        name: res.data.name,
                        email: res.data.email,
                        role: res.data.role,
                        status: res.data.status,
                        password: "", // không show password cũ
                    });
                    if (res.data.avatar) {
                        setAvatarUrl(
                            `${process.env.NEXT_PUBLIC_BACKEND_URL}/public/images/users/${res.data.avatar}`
                        );
                    }
                }
            }
        } catch (error) {
            console.log("Fetch user failed: ", error);
            message.error("Không thể tải thông tin user!");
        } finally {
            setLoading(false);
        }
    };
    // load thông tin user khi có userId
    useEffect(() => {
        fetchUser();

    }, [userId, isModalOpen]);

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
        setFile(file);
        return false;
    };

    const handleOk = async () => {
        setLoading(true);
        try {
            const values = await form.validateFields();

            let avatar = avatarUrl; // giữ avatar cũ
            if (file) {
                const res = await uploadFile(file, "users");
                if (res?.data?.fileName) {
                    avatar = res.data.fileName;
                }
            }
            if (!avatarUrl && !file) {
                avatar = ""; // nếu xoá ảnh
            }

            // xử lý password theo yêu cầu
            let payload: any = {
                ...values,
                avatar,
            };

            if (!values.password || values.password.length !== 1) {
                delete payload.password;
            }

            const res = await updateUser(userId!, payload);
            if (!res.error) {
                setIsModalOpen(false);
                form.resetFields();
                setAvatarUrl("");
                setFile(null);
                await getData();
                message.success("Cập nhật người dùng thành công!");
            } else {
                message.error(res.error ?? "Something went wrong!");
            }
        } catch (error) {
            console.log("Update user failed: ", error);
            message.error("Có lỗi xảy ra khi cập nhật user!");
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setAvatarUrl("");
        setFile(null);
        setIsModalOpen(false);
        form.resetFields();
    }
    return (
        <Modal
            title="Update User"
            open={isModalOpen}
            onOk={handleOk}
            onCancel={handleClose}
            confirmLoading={loading}

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

                {/* Password không bắt buộc trong update */}
                <Form.Item
                    name="password"
                    label="Password (leave blank nếu không đổi)"
                    rules={[
                        { min: 6, message: "Password phải có ít nhất 6 ký tự!" },
                        {
                            pattern: /^(|(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{6,})$/,
                            message: "Password phải chứa cả chữ cái và số!",
                        },
                    ]}
                >
                    <Input.Password placeholder="Để trống nếu không muốn đổi" />
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
    );
};
export default ModalUpdateUser;
