"use client";
import React from "react";
import { Form, Input, Button } from "antd";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { forgotPassword } from "@/utils/actions/auth/action.auth";
import { useNotify } from "@/lib/notificationProvider";

const ForgotPassword = () => {
    const router = useRouter();
    const notify = useNotify();
    const onFinish = async (values: any) => {
        const res = await forgotPassword(values.email);
        if (!res.error) {
            notify("success", { message: "OTP sent successfully!", description: "Please check your email." });
            router.push(`/verify?email=${values.email}&type=forgotPassword`);
        } else {
            notify("error", { message: "Send OTP failed!", description: res.error ?? "Something went wrong!" });
        }
    };

    return (
        <div style={wrapperStyle}>
            <h2 style={{ color: "white", marginBottom: "8px" }}>Forgot Password</h2>
            <p style={{ color: "#ddd", marginBottom: "20px" }}>
                Enter your registered email address and we’ll send you an OTP to reset your password.
            </p>

            <Form name="forgot" onFinish={onFinish} layout="vertical">
                <Form.Item name="email" rules={[{ required: true, message: "Please input your Email!" }]}>
                    <Input placeholder="Email Address" />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" block style={buttonStyle}>
                        Send OTP
                    </Button>
                </Form.Item>
            </Form>

            <p style={{ marginTop: "20px", color: "#ddd", textAlign: "center" }}>
                Remembered your password?{" "}
                <Link href="/login" style={{ color: "#00d4ff" }}>
                    Back to Login
                </Link>
            </p>
        </div>
    );

};

const wrapperStyle: React.CSSProperties = {
    background: "rgba(255,255,255,0.08)",
    backdropFilter: "blur(20px)",
    padding: "40px",
    borderRadius: "12px",
    textAlign: "center",
    width: "350px",
    boxShadow: "0 8px 32px rgba(31,38,135,0.37)",
    color: "white",
};

const buttonStyle: React.CSSProperties = {
    background: "linear-gradient(90deg, #4e54c8, #00d4ff)",
    border: "none",
};

export default ForgotPassword;
