"use client";
import React, { useState } from "react";
import { Button, Card, Input, message as antdMessage, Typography, Spin } from "antd";
import { AimOutlined, EnvironmentOutlined } from "@ant-design/icons";
import { sendRequest } from "@/utils/api";

const { Text } = Typography;

interface Props {
    address: string;
    setAddress: (v: string) => void;
    lat: number | null;
    lng: number | null;
    setLat: (v: number) => void;
    setLng: (v: number) => void;
}

interface ReverseGeoResponse {
    display_name: string;
    address?: Record<string, any>;
}

const AutoAddress: React.FC<Props> = ({
    address,
    setAddress,
    lat,
    lng,
    setLat,
    setLng,
}) => {
    const [loading, setLoading] = useState(false);
    const [statusMsg, setStatusMsg] = useState("");

    const handleAutoLocate = async () => {
        try {
            navigator.geolocation.getCurrentPosition(
                async (pos) => {
                    try {
                        const { latitude, longitude, accuracy } = pos.coords;
                        console.log("check pos", pos);

                        setLat(latitude);
                        setLng(longitude);

                        // Gọi API reverse geocode
                        const res = await sendRequest<ReverseGeoResponse>({
                            url: "https://nominatim.openstreetmap.org/reverse",
                            method: "GET",
                            queryParams: {
                                format: "json",
                                lat: latitude,
                                lon: longitude,
                            },
                            headers: {
                                "Accept-Language": "vi",
                            },
                        });

                        setAddress(res.display_name);

                        // 🔔 Thông báo độ lệch nếu sai số lớn
                        if (accuracy > 100) {
                            setStatusMsg(
                                `⚠️ Đã định vị thành công (sai số khoảng ±${Math.round(
                                    accuracy
                                )} m). Vị trí có thể chưa chính xác!`
                            );
                            antdMessage.warning(
                                `Vị trí có thể lệch ~${Math.round(accuracy)} m`
                            );
                        } else {
                            setStatusMsg(`✅ Đã định vị thành công (±${Math.round(accuracy)} m)`);
                            antdMessage.success("Đã lấy vị trí hiện tại!");
                        }
                    } catch (err) {
                        console.error("Reverse geocode error:", err);
                        setStatusMsg("❌ Không thể lấy địa chỉ!");
                        antdMessage.error("Không thể lấy địa chỉ!");
                    } finally {
                        setLoading(false);
                    }
                },
                (error) => {
                    console.error("Geolocation error:", error);
                    setStatusMsg("⚠️ Không thể truy cập vị trí!");
                    setLoading(false);
                    antdMessage.error("Không thể truy cập vị trí!");
                },
                {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 0,
                }
            );
        } catch (err) {
            console.error("📍 AutoLocate error:", err);
            setStatusMsg("❌ Lỗi không xác định khi định vị.");
            setLoading(false);
        }
    };


    return (
        <Card
            style={{
                borderRadius: 16,
                boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                marginTop: 16,
            }}
            title={
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <EnvironmentOutlined />
                    <span>Lấy vị trí tự động</span>
                </div>
            }
        >
            <Button
                type="primary"
                icon={<AimOutlined />}
                onClick={handleAutoLocate}
                loading={loading}
                style={{
                    background: "#ff6d00",
                    borderColor: "#ff6d00",
                    borderRadius: 10,
                    marginBottom: 12,
                }}
            >
                {loading ? "Đang định vị..." : "Lấy vị trí hiện tại"}
            </Button>

            {statusMsg && (
                <Text type="secondary" style={{ display: "block", marginBottom: 8 }}>
                    {statusMsg}
                </Text>
            )}

            {loading && (
                <div style={{ textAlign: "center", marginBottom: 12 }}>
                    <Spin size="small" />
                </div>
            )}

            <Input.TextArea
                rows={2}
                value={address}
                placeholder="Địa chỉ..."
                onChange={(e) => setAddress(e.target.value)}
                style={{ marginBottom: 10 }}
            />

            <div style={{ display: "flex", gap: 8 }}>
                <Input
                    value={lat ?? ""}
                    addonBefore="Lat"
                    readOnly
                    style={{ flex: 1 }}
                />
                <Input
                    value={lng ?? ""}
                    addonBefore="Lng"
                    readOnly
                    style={{ flex: 1 }}
                />
            </div>

            {/* 🗺️ Hiển thị map mini preview (tuỳ chọn) */}
            {lat && lng ? (
                <iframe
                    src={`https://www.openstreetmap.org/export/embed.html?bbox=${lng - 0.005}%2C${lat - 0.005}%2C${lng + 0.005}%2C${lat + 0.005}&layer=mapnik&marker=${lat}%2C${lng}`}
                    style={{
                        width: "100%",
                        height: 180,
                        borderRadius: 12,
                        border: "1px solid #ddd",
                        marginTop: 10,
                    }}
                />
            ) : (
                <div
                    style={{
                        marginTop: 10,
                        height: 150,
                        border: "1px dashed #ccc",
                        borderRadius: 12,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#777",
                        gap: 6,
                    }}
                >
                    <EnvironmentOutlined />
                    <span>Vị trí của bạn trên bản đồ</span>
                </div>
            )}
        </Card>
    );
};

export default AutoAddress;
