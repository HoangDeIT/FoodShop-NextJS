"use client";

import React, { useEffect, useState } from "react";
import {
    Form,
    Input,
    Button,
    Upload,
    Card,
    Space,
    Tabs,
    Switch,
} from "antd";
import {
    UploadOutlined,
    EnvironmentOutlined,
    SaveOutlined,
    AimOutlined,
    SearchOutlined,
} from "@ant-design/icons";
import AutoAddress from "./auto.address";
import MapAddress from "./map.address";
import SearchAddress from "./search.address";
import { getProfile, updateProfile } from "@/utils/actions/sellers/action.profile";
import { uploadFile } from "@/utils/actions/admin/action.users";
import useApp from "antd/es/app/useApp";




const SellerShopProfile: React.FC = () => {
    const [form] = Form.useForm();
    const isOpen = Form.useWatch("isOpen", form);
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [method, setMethod] = useState("auto");
    const { message } = useApp();
    // location state
    const [address, setAddress] = useState("");
    const [lat, setLat] = useState<number | null>(null);
    const [lng, setLng] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const getBase64 = (file: File, callback: (url: string) => void) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => callback(reader.result as string);
    };

    // 🔹 Kiểm tra định dạng + preview + chặn upload thật
    const beforeUpload = (file: File) => {
        if (!file.type.startsWith("image/")) {
            message.error("Chỉ được upload file ảnh!");
            return Upload.LIST_IGNORE; // 🚫 Không thêm vào danh sách
        }
        getBase64(file, (url) => setImageUrl(url)); // ✅ Preview ảnh
        setFile(file); // Lưu file để upload backend sau
        return false; // ⛔ Chặn upload thật lên server
    };
    const fetchSeller = async () => {
        setLoading(true);

        try {
            const res = await getProfile();
            console.log("check res: ", res);

            if (res?.data) {
                const user = res.data.user;
                const profile = res.data.profile;

                form.setFieldsValue({
                    name: user?.name ?? "",
                    description:
                        profile && profile.type === "seller"
                            ? profile.description ?? ""
                            : "",
                    isOpen:
                        profile && profile.type === "seller"
                            ? Boolean(profile.isOpen)
                            : false,
                });

                if (user?.avatar) {
                    setImageUrl(
                        `${process.env.NEXT_PUBLIC_BACKEND_URL}/public/images/users/${user.avatar}`
                    );
                }

                if (profile?.location) {
                    setAddress(profile.location.address ?? "");
                    setLat(profile.location.latitude ?? "");
                    setLng(profile.location.longitude ?? "");
                }
            }
        } catch (err) {
            console.log("Fetch seller failed: ", err);
            message.error("Không thể tải thông tin quán!");
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchSeller();
    }, []);
    const handleSubmit = async (values: any) => {
        if (!address || !lat || !lng) {
            message.warning("Vui lòng chọn vị trí hợp lệ!");
            return;
        }

        try {
            setLoading(true);

            // 👉 Upload ảnh trước (nếu có file mới)
            let avatar = imageUrl;
            if (file) {
                const resUpload = await uploadFile(file, "users");
                if (resUpload?.data?.fileName) {
                    avatar = resUpload.data.fileName;
                }
            } else if (imageUrl && imageUrl.startsWith("http")) {
                // giữ ảnh cũ
                avatar = imageUrl.split("/").pop() || "";
            }

            // 👉 Gửi dữ liệu update
            const payload = {
                name: values.name,
                description: values.description,
                avatar,
                isOpen: values.isOpen,    // 👈 thêm dòng này
                location: {
                    latitude: lat,
                    longitude: lng,
                    address,
                },
            };

            const res = await updateProfile(payload);

            if (res?.data) {
                message.success("✅ Cập nhật thông tin quán thành công!");
                fetchSeller(); // reload lại data
            } else {
                message.error(res.error ?? "Cập nhật thất bại!");
            }
        } catch (error) {
            console.log("Update seller failed: ", error);
            message.error("Có lỗi xảy ra khi cập nhật thông tin quán!");
        } finally {
            setLoading(false);
        }
    };
    return (
        <Card
            title="Cập nhật thông tin quán"
            style={{ maxWidth: 900, margin: "40px auto" }}
            variant="outlined"
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                initialValues={{
                    name: "",
                    description: "",
                    isOpen: false,
                }}
            >
                <Form.Item
                    label="Trạng thái hoạt động"
                    name="isOpen"
                    valuePropName="checked"
                >
                    <Space>
                        <Switch checkedChildren="Mở" unCheckedChildren="Đóng" checked={isOpen} onChange={(checked) => form.setFieldsValue({ isOpen: checked })} />
                        {isOpen ? "🟢 Đang mở cửa" : "🔴 Đang đóng cửa"}
                    </Space>
                </Form.Item>


                {/* --- THÔNG TIN CƠ BẢN --- */}
                <Form.Item
                    label="Tên quán"
                    name="name"
                    rules={[{ required: true, message: "Vui lòng nhập tên quán!" }]}
                >
                    <Input placeholder="Nhập tên quán của bạn" />
                </Form.Item>

                <Form.Item
                    label="Giới thiệu / mô tả"
                    name="description"
                    rules={[{ required: true, message: "Vui lòng nhập mô tả quán!" }]}
                >
                    <Input.TextArea
                        rows={4}
                        placeholder="Nhập mô tả ngắn gọn về quán, món nổi bật, phong cách, v.v."
                    />
                </Form.Item>

                {/* --- ẢNH ĐẠI DIỆN QUÁN --- */}
                <Form.Item label="Ảnh đại diện quán">
                    <Upload
                        listType="picture"
                        showUploadList={false}
                        beforeUpload={beforeUpload}

                    >
                        <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
                    </Upload>

                    {imageUrl && (
                        <div style={{ marginTop: 10 }}>
                            <img
                                src={imageUrl}
                                alt="preview"
                                style={{
                                    width: 100,
                                    height: 100,
                                    borderRadius: 8,
                                    objectFit: "cover",
                                    display: "block",
                                }}
                            />
                            <Button
                                danger
                                size="small"
                                style={{ marginTop: 6 }}
                                onClick={() => {
                                    setImageUrl(null);
                                    setFile(null);
                                    message.info("Ảnh đã được xóa tạm thời!");
                                }}
                            >
                                Xóa ảnh
                            </Button>
                        </div>
                    )}
                </Form.Item>

                {/* --- ĐỊA CHỈ QUÁN --- */}
                <Form.Item label="Địa chỉ quán">
                    <Tabs
                        activeKey={method}
                        onChange={setMethod}
                        items={[
                            { key: "auto", label: "Tự động", icon: <AimOutlined /> },
                            { key: "map", label: "Bản đồ", icon: <EnvironmentOutlined /> },
                            { key: "search", label: "Tìm kiếm", icon: <SearchOutlined /> },
                        ]}
                    />

                    {method === "auto" && (
                        <AutoAddress
                            address={address}
                            setAddress={setAddress}
                            setLat={setLat}
                            setLng={setLng}
                            lat={lat}
                            lng={lng}
                        />
                    )}

                    {method === "map" && (
                        <MapAddress
                            address={address}
                            setAddress={setAddress}
                            lat={lat}
                            lng={lng}
                            setLat={setLat}
                            setLng={setLng}
                        />
                    )}

                    {method === "search" && (
                        <SearchAddress
                            address={address}
                            setAddress={setAddress}
                            lat={lat}
                            lng={lng}
                            setLat={setLat}
                            setLng={setLng}
                        />
                    )}
                </Form.Item>

                <Form.Item>
                    <Space>
                        <Button
                            type="primary"
                            icon={<SaveOutlined />}
                            htmlType="submit"
                            loading={loading}
                        >
                            Lưu thay đổi
                        </Button>
                        <Button htmlType="reset">Đặt lại</Button>
                    </Space>
                </Form.Item>
            </Form>
        </Card>
    );
};

export default SellerShopProfile;
