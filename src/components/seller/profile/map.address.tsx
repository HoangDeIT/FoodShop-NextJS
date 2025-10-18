"use client";
import React, { useEffect, useState } from "react";
// import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import type { LatLngExpression } from "leaflet";
import "leaflet/dist/leaflet.css";

import { Card, Input, Spin, Typography } from "antd";
import { sendRequest } from "@/utils/api";
import dynamic from "next/dynamic";
import { useMapEvents } from "react-leaflet";

// import leaflet chỉ khi chạy client
const MapContainer = dynamic(() => import("react-leaflet").then(m => m.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then(m => m.TileLayer), { ssr: false });
const Marker = dynamic(() => import("react-leaflet").then(m => m.Marker), { ssr: false });
let L: any = null;
if (typeof window !== "undefined") {
    L = require("leaflet");

    // 🔧 Sửa lỗi icon của Leaflet khi chạy trong Next.js
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
        iconRetinaUrl:
            "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    });
}

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
// 🧩 Component phụ — bắt sự kiện click & drag
const MapHandler: React.FC<{
    setLat: (v: number) => void;
    setLng: (v: number) => void;
    setAddress: (v: string) => void;
    setLoading: (v: boolean) => void;
}> = ({ setLat, setLng, setAddress, setLoading }) => {
    const reverseGeocode = async (lat: number, lng: number) => {
        try {
            setLoading(true);
            const res = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=vi`
            );
            const data = await res.json();
            setAddress(data.display_name || "Không xác định được địa chỉ");
        } catch (err) {
            console.error("❌ Reverse geocode error:", err);
            setAddress("Không thể xác định địa chỉ");
        } finally {
            setLoading(false);
        }
    };

    useMapEvents({
        click: async (e) => {
            const { lat, lng } = e.latlng;
            setLat(lat);
            setLng(lng);
            await reverseGeocode(lat, lng);
        },
    });

    return null;
};

const MapAddress: React.FC<Props> = ({
    address,
    setAddress,
    lat,
    lng,
    setLat,
    setLng,
}) => {
    const [loading, setLoading] = useState(false);
    const [center, setCenter] = useState<LatLngExpression>([
        lat ?? 10.0301,
        lng ?? 105.7722,
    ]);

    // 🧭 Lấy vị trí hiện tại nếu chưa có lat/lng
    useEffect(() => {
        if (!lat || !lng) {
            if ("geolocation" in navigator) {
                navigator.geolocation.getCurrentPosition(
                    async (pos) => {
                        const { latitude, longitude } = pos.coords;
                        setLat(latitude);
                        setLng(longitude);
                        setCenter([latitude, longitude]);

                        try {
                            setLoading(true);
                            const res = await fetch(
                                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&accept-language=vi`
                            );
                            const data = await res.json();
                            setAddress(data.display_name || "Không xác định được địa chỉ");
                        } catch {
                            setAddress("Không thể xác định địa chỉ");
                        } finally {
                            setLoading(false);
                        }
                    },
                    (err) => {
                        console.warn("📍 Không thể lấy vị trí:", err);
                    },
                    { enableHighAccuracy: true, timeout: 10000 }
                );
            }
        }
    }, []);

    const hasCoords = lat !== null && lng !== null;

    return (
        <Card
            title="Chọn vị trí trên bản đồ"
            style={{
                borderRadius: 18,
                boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                marginTop: 16,
            }}
        >
            <Text type="secondary">
                Chạm vào bản đồ để đặt ghim, địa chỉ sẽ tự điền.
            </Text>

            <div
                style={{
                    height: 300,
                    borderRadius: 14,
                    overflow: "hidden",
                    border: "1px solid #ddd",
                    marginTop: 12,
                    position: "relative",
                }}
            >
                {hasCoords ? (
                    <MapContainer
                        center={center}
                        zoom={15}
                        style={{ height: "100%", width: "100%" }}
                    >
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/">OSM</a>'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <MapHandler
                            setLat={setLat}
                            setLng={setLng}
                            setAddress={setAddress}
                            setLoading={setLoading}
                        />
                        <Marker
                            draggable
                            position={[lat!, lng!] as LatLngExpression}
                            eventHandlers={{
                                dragend: async (e) => {
                                    const p = e.target.getLatLng();
                                    setLat(p.lat);
                                    setLng(p.lng);
                                    try {
                                        setLoading(true);
                                        const res = await sendRequest<ReverseGeoResponse>({
                                            url: "https://nominatim.openstreetmap.org/reverse",
                                            method: "GET",
                                            queryParams: {
                                                format: "json",
                                                lat: p.lat,
                                                lon: p.lng,
                                            },
                                            headers: {
                                                "Accept-Language": "vi",
                                            },
                                        });

                                        setAddress(res.display_name);
                                    } finally {
                                        setLoading(false);
                                    }
                                },
                            }}
                        />
                    </MapContainer>
                ) : (
                    <div
                        style={{
                            height: "100%",
                            borderStyle: "dashed",
                            borderColor: "#ccc",
                            borderWidth: 1,
                            borderRadius: 14,
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            color: "#777",
                            gap: 6,
                        }}
                    >
                        <span style={{ fontSize: 24 }}>📍</span>
                        <span>Đang tải bản đồ...</span>
                    </div>
                )}
                {loading && (
                    <div
                        style={{
                            position: "absolute",
                            top: 0,
                            bottom: 0,
                            left: 0,
                            right: 0,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            background: "rgba(255,255,255,0.5)",
                        }}
                    >
                        <Spin size="small" />
                    </div>
                )}
            </div>

            <Input.TextArea
                rows={2}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Địa chỉ..."
                style={{ marginTop: 12 }}
            />

            <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                <Input addonBefore="Lat" value={lat ?? ""} readOnly />
                <Input addonBefore="Lng" value={lng ?? ""} readOnly />
            </div>
        </Card>
    );
};

export default MapAddress;
