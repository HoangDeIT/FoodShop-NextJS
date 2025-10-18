"use client";
import React, { useEffect, useState } from "react";
import { Input, Card, Spin, Typography } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { useMap, useMapEvents } from "react-leaflet";
import type { LatLngExpression } from "leaflet";
import "leaflet/dist/leaflet.css";
import { sendRequest } from "@/utils/api";
import dynamic from "next/dynamic";

const { Text } = Typography;

// Dynamic import để tránh lỗi SSR
const MapContainer = dynamic(() => import("react-leaflet").then(m => m.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then(m => m.TileLayer), { ssr: false });
const Marker = dynamic(() => import("react-leaflet").then(m => m.Marker), { ssr: false });

// 🗺️ Component di chuyển map khi chọn kết quả
const FlyToLocation: React.FC<{ lat: number; lng: number }> = ({ lat, lng }) => {
    const map = useMap();
    useEffect(() => {
        map.flyTo([lat, lng], 15, { duration: 0.8 });
    }, [lat, lng]);
    return null;
};

// 🧭 Component phụ: Bắt sự kiện click trên map
const MapClickHandler: React.FC<{
    setLat: (v: number) => void;
    setLng: (v: number) => void;
    reverseGeocode: (lat: number, lng: number) => Promise<void>;
}> = ({ setLat, setLng, reverseGeocode }) => {
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

interface Props {
    address: string;
    setAddress: (v: string) => void;
    lat: number | null;
    lng: number | null;
    setLat: (v: number) => void;
    setLng: (v: number) => void;
}

interface Place {
    place_id: number;
    lat: string;
    lon: string;
    display_name: string;
}

const SearchAddress: React.FC<Props> = ({ address, setAddress, lat, lng, setLat, setLng }) => {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<Place[]>([]);
    const [loading, setLoading] = useState(false);
    const [debouncedQuery, setDebouncedQuery] = useState(query);
    const [selected, setSelected] = useState<{ lat: number; lng: number } | null>(null);

    // 🕓 Debounce 500ms
    useEffect(() => {
        const handler = setTimeout(() => setDebouncedQuery(query), 500);
        return () => clearTimeout(handler);
    }, [query]);

    // ⚡ Gọi API khi debouncedQuery thay đổi
    useEffect(() => {
        const fetchResults = async () => {
            if (debouncedQuery.length < 3) {
                setResults([]);
                return;
            }

            try {
                setLoading(true);
                const res = await sendRequest<Place[]>({
                    url: "https://nominatim.openstreetmap.org/search",
                    method: "GET",
                    queryParams: {
                        format: "json",
                        q: debouncedQuery,
                        countrycodes: "vn",
                        addressdetails: 1,
                        limit: 8,
                    },
                    headers: { "User-Agent": "FoodShopWeb/1.0 (https://nextjs.org)" },
                });

                setResults(res || []);
            } catch (err) {
                console.error("❌ Lỗi tìm địa chỉ:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchResults();
    }, [debouncedQuery]);

    // 🧭 Reverse geocode khi kéo marker hoặc click map
    const reverseGeocode = async (lat: number, lng: number) => {
        try {
            const res = await sendRequest<any>({
                url: "https://nominatim.openstreetmap.org/reverse",
                method: "GET",
                queryParams: {
                    format: "json",
                    lat,
                    lon: lng,
                    "accept-language": "vi",
                },
            });
            setAddress(res.display_name || "Không xác định được địa chỉ");
        } catch {
            setAddress("Không thể xác định địa chỉ");
        }
    };

    // 🧭 Khi chọn địa chỉ trong kết quả
    const handleSelect = (place: Place) => {
        const latNum = parseFloat(place.lat);
        const lngNum = parseFloat(place.lon);
        setAddress(place.display_name);
        setLat(latNum);
        setLng(lngNum);
        setSelected({ lat: latNum, lng: lngNum });
        setResults([]);
        setQuery(place.display_name);
    };

    const latNum = lat ?? 10.0452;
    const lngNum = lng ?? 105.7469;

    return (
        <Card
            title="Tìm địa chỉ"
            style={{
                borderRadius: 18,
                boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                marginTop: 16,
            }}
        >
            <Text type="secondary">
                Dữ liệu từ OpenStreetMap (ưu tiên gần vị trí hiện tại)
            </Text>

            {/* Ô nhập tìm kiếm */}
            <div style={{ marginTop: 12, position: "relative", zIndex: 10 }}>
                <Input
                    placeholder="Nhập địa chỉ hoặc địa điểm (VD: bệnh viện, quán ăn...)"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    prefix={<SearchOutlined />}
                    suffix={loading && <Spin size="small" />}
                    style={{ borderRadius: 8 }}
                />

                {results.length > 0 && (
                    <div
                        style={{
                            border: "1px solid #ddd",
                            borderRadius: 10,
                            marginTop: 4,
                            background: "#fff",
                            maxHeight: 200,
                            overflowY: "auto",
                            boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
                            position: "absolute",
                            width: "100%",
                            zIndex: 1000,
                        }}
                    >
                        {results.map((place) => (
                            <div
                                key={place.place_id}
                                onClick={() => handleSelect(place)}
                                style={{
                                    padding: "8px 10px",
                                    cursor: "pointer",
                                    borderBottom: "1px solid #f0f0f0",
                                }}
                            >
                                {place.display_name}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* 🗺️ Map */}
            <div
                style={{
                    height: 300,
                    borderRadius: 14,
                    overflow: "hidden",
                    border: "1px solid #ddd",
                    marginTop: 16,
                    position: "relative",
                    zIndex: 1,
                }}
            >
                <MapContainer
                    center={[latNum, lngNum]}
                    zoom={15}
                    style={{ height: "100%", width: "100%" }}
                >
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    {selected && <FlyToLocation lat={selected.lat} lng={selected.lng} />}

                    {/* ✅ Bắt sự kiện click để di chuyển marker */}
                    <MapClickHandler
                        setLat={setLat}
                        setLng={setLng}
                        reverseGeocode={reverseGeocode}
                    />

                    <Marker
                        draggable
                        position={[latNum, lngNum] as LatLngExpression}
                        eventHandlers={{
                            dragend: async (e) => {
                                const p = e.target.getLatLng();
                                setLat(p.lat);
                                setLng(p.lng);
                                await reverseGeocode(p.lat, p.lng);
                            },
                        }}
                    />
                </MapContainer>
            </div>

            <Input.TextArea
                rows={2}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Địa chỉ..."
                style={{ marginTop: 12 }}
            />

            <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                <Input addonBefore="Lat" value={latNum.toFixed(6)} readOnly />
                <Input addonBefore="Lng" value={lngNum.toFixed(6)} readOnly />
            </div>
        </Card>
    );
};

export default SearchAddress;
