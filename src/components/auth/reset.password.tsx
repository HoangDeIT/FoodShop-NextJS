"use client";
import React, { useState } from "react";
import { Form, Input, Button, Divider } from "antd";
import { LockOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { resetPassword } from "@/utils/actions/auth/action.auth";
import { useNotify } from "@/lib/notificationProvider";

const ResetPassword = ({ email, otp }: { email: string; otp: string }) => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();
    const password = Form.useWatch("password", form);
    const notify = useNotify();
    const onFinish = async (values: any) => {
        try {
            setLoading(true);
            console.log("Reset password:", values);

            const res = await resetPassword({ newPassword: values.password, otp, email });
            if (!res.error) {
                router.push("/login");
            } else {
                notify("error", { message: "Reset password failed!", description: res.message ?? "Something went wrong!" });
            }
        }

        finally {
            setLoading(false);
        }
    };

    const getPasswordStrength = (value: string) => {
        if (!value) return "";
        if (value.length < 6) return "Weak";
        if (/^(?=.*[A-Za-z])(?=.*\d).{6,}$/.test(value)) return "Medium";
        if (/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&]).{8,}$/.test(value)) return "Strong";
        return "Weak";
    };

    return (
        <div style={wrapperStyle}>
            <h2 style={{ color: "white", marginBottom: "8px" }}>Reset Password</h2>
            <p style={{ color: "#ddd", marginBottom: "20px" }}>
                Please enter your new password below. Make sure it’s strong and different from your old one.
            </p>

            <Form form={form} name="reset" onFinish={onFinish} layout="vertical">
                <Form.Item
                    name="password"
                    rules={[{ required: true, message: "Please input new Password!" }]}
                >
                    <Input.Password prefix={<LockOutlined />} placeholder="New Password" />
                </Form.Item>

                <span style={{ fontSize: "12px", color: "#ddd" }}>
                    Strength: {getPasswordStrength(password)}
                </span>

                <Form.Item
                    name="confirm"
                    dependencies={["password"]}
                    rules={[
                        { required: true, message: "Please confirm your password!" },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (!value || getFieldValue("password") === value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject("Passwords do not match!");
                            },
                        }),
                    ]}
                >
                    <Input.Password prefix={<LockOutlined />} placeholder="Confirm Password" />
                </Form.Item>

                <Form.Item>
                    <Button
                        type="primary"
                        htmlType="submit"
                        block
                        style={buttonStyle}
                        loading={loading}
                    >
                        Reset Password
                    </Button>
                </Form.Item>
            </Form>

            <Divider style={{ borderColor: "rgba(255,255,255,0.2)" }}>OR</Divider>
            <p style={{ color: "#ddd", textAlign: "center" }}>
                Remembered your password?{" "}
                <a href="/login" style={{ color: "#00d4ff" }}>Back to Login</a>
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

export default ResetPassword;
