"use client";

import {
    Card,
    Row,
    Col,
    Statistic,
    Space,
    Button,
    Alert,
    Tag,
    Typography,
} from "antd";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
} from "recharts";
import { io } from "socket.io-client";
import { useEffect, useState, useRef } from "react";
import dayjs from "dayjs";
import { useSession } from "next-auth/react";

const { Title, Text } = Typography;

// ⚙️ Cấu hình
const SOCKET_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3000";
const MAX_POINTS = 60; // lưu tối đa 60 mẫu (≈3 phút nếu mỗi 3 s update)
const formatUptime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    return `${h.toString().padStart(2, "0")}:${m
        .toString()
        .padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
};
export default function SystemDashboard() {
    const [cpu, setCpu] = useState(0);
    const [mem, setMem] = useState(0);
    const [uptime, setUptime] = useState(0);
    const [status, setStatus] = useState("🔌 Đang kết nối...");
    const [logs, setLogs] = useState<string[]>([]);
    const [samples, setSamples] = useState<any[]>([]);
    const socketRef = useRef<any>(null);
    const { data } = useSession()
    useEffect(() => {
        const token = data?.access_token
        const socket = io(`${SOCKET_URL}/monitor`, {
            auth: { token },
        });
        socketRef.current = socket;

        socket.on("connect", () => setStatus("🟢 Đã kết nối"));
        socket.on("disconnect", () => setStatus("🔴 Mất kết nối"));
        socket.on("systemMessage", (msg: string) => setStatus(msg));
        socket.on("systemLog", (txt: string) => {
            const arr = txt.split("\n").slice(-200);
            setLogs(arr.reverse());
        });

        socket.on("systemInfo", (data: any) => {
            setCpu(Number(data.cpuLoad));
            setMem(Number(data.memoryUsage));
            setUptime(data.uptime);

            setSamples((prev) => {
                const next = [
                    ...prev,
                    {
                        time: dayjs(data.timestamp).format("HH:mm:ss"),
                        cpuLoad: Number(data.cpuLoad),
                        memoryUsage: Number(data.memoryUsage),
                    },
                ];
                return next.slice(-MAX_POINTS);
            });
        });


        // cleanup đúng cách:
        return () => {
            socket.disconnect();
        };
    }, []);

    const sendCommand = (type: string) => {
        socketRef.current?.emit("adminCommand", { type });
    };

    const cpuWarn = cpu >= 85;
    const memWarn = mem >= 90;

    return (
        <div style={{ padding: 24 }}>
            <Row gutter={[16, 16]}>
                <Col span={24}>
                    <Title level={3}>⚙️ System Monitoring Dashboard</Title>
                    <Text type="secondary">
                        Theo dõi trạng thái hệ thống real-time, cập nhật mỗi 3 giây
                    </Text>
                </Col>

                {/* Tổng quan */}
                <Col xs={24} sm={12} md={6}>
                    <Card>
                        <Statistic title="CPU Load" value={cpu} precision={1} suffix="%" />
                        <Tag color={cpuWarn ? "red" : "green"} style={{ marginTop: 8 }}>
                            {cpuWarn ? "Cảnh báo" : "Ổn định"}
                        </Tag>
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <Card>
                        <Statistic title="Memory Usage" value={mem} precision={1} suffix="%" />
                        <Tag color={memWarn ? "red" : "green"} style={{ marginTop: 8 }}>
                            {memWarn ? "Cảnh báo" : "Bình thường"}
                        </Tag>
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <Card>
                        <Statistic title="Uptime" value={formatUptime(uptime)} />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <Card>
                        <Statistic title="Trạng thái" value={status} />
                    </Card>
                </Col>

                {/* Cảnh báo */}
                {(cpuWarn || memWarn) && (
                    <Col span={24}>
                        <Alert
                            type="error"
                            message="⚠️ Cảnh báo quá tải"
                            description={
                                <>
                                    {cpuWarn && <div>• CPU ≥ 85 %</div>}
                                    {memWarn && <div>• RAM ≥ 90 %</div>}
                                    <div>Hãy kiểm tra log hoặc restart server.</div>
                                </>
                            }
                            showIcon
                        />
                    </Col>
                )}

                {/* Biểu đồ realtime */}
                <Col xs={24} lg={12}>
                    <Card title="CPU Load (Realtime)">
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={samples}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="time" minTickGap={15} />
                                <YAxis domain={[0, 100]} />
                                <Tooltip />
                                <Line
                                    type="monotone"
                                    dataKey="cpuLoad"
                                    stroke="#ff4d4f"
                                    strokeWidth={2}
                                    dot={false}
                                    isAnimationActive={true}
                                    animationDuration={400}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </Card>
                </Col>
                <Col xs={24} lg={12}>
                    <Card title="Memory Usage (Realtime)">
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={samples}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="time" minTickGap={15} />
                                <YAxis domain={[0, 100]} />
                                <Tooltip />
                                <Line
                                    type="monotone"
                                    dataKey="memoryUsage"
                                    stroke="#1890ff"
                                    strokeWidth={2}
                                    dot={false}
                                    isAnimationActive={true}
                                    animationDuration={400}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </Card>
                </Col>

                {/* Admin control */}
                <Col xs={24} md={8}>
                    <Card title="Admin Controls">
                        <Space direction="vertical" style={{ width: "100%" }}>
                            <Button danger block onClick={() => sendCommand("restart")}>
                                🔄 Restart Server
                            </Button>
                            <Button block onClick={() => sendCommand("getLogs")}>
                                📜 Get Logs
                            </Button>
                            <Button block onClick={() => setLogs([])}>
                                🧹 Clear Local Logs
                            </Button>
                        </Space>
                    </Card>
                </Col>

                {/* Logs */}
                <Col xs={24} md={16}>
                    <Card
                        title="System Logs"
                        style={{ maxHeight: 400, overflowY: "auto" }}
                    >
                        <div style={{ fontFamily: "monospace", fontSize: 12 }}>
                            {logs.length === 0 ? (
                                <Text type="secondary">No logs yet</Text>
                            ) : (
                                logs.map((l, i) => (
                                    <div key={i} style={{ padding: "2px 0" }}>
                                        {l}
                                    </div>
                                ))
                            )}
                        </div>
                    </Card>
                </Col>
            </Row>
        </div>
    );
}
