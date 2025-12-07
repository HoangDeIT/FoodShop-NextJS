"use client";
import React from "react";
import { Modal } from "antd";
import { EnvironmentOutlined } from "@ant-design/icons";

interface Props {
    open: boolean;
    onClose: () => void;
    location: {
        lat: number;
        lng: number;
        address: string;
    } | null;
}

export default function MapModal({ open, onClose, location }: Props) {
    return (
        <Modal
            open={open}
            onCancel={onClose}
            footer={null}
            width={600}
            title={
                <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                    <EnvironmentOutlined />
                    Vị trí giao hàng
                </div>
            }
        >
            {!location ? (
                <div>Không có dữ liệu vị trí 😿</div>
            ) : (
                <>
                    <p>
                        <b>Địa chỉ:</b> {location.address}
                    </p>
                    <p>
                        <b>Lat:</b> {location.lat} — <b>Lng:</b> {location.lng}
                    </p>

                    {/* 🗺️ Map Preview */}
                    <iframe
                        src={`https://www.openstreetmap.org/export/embed.html?bbox=${location.lng - 0.005
                            }%2C${location.lat - 0.005}%2C${location.lng + 0.005}%2C${location.lat + 0.005
                            }&layer=mapnik&marker=${location.lat}%2C${location.lng}`}
                        style={{
                            width: "100%",
                            height: 300,
                            borderRadius: 12,
                            border: "1px solid #ddd",
                            marginTop: 10,
                        }}
                    />
                </>
            )}
        </Modal>
    );
}
