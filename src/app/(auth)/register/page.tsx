"use client";
import React from "react";
import { Form, Input, Button } from "antd";
import { useRouter } from "next/navigation";
import { useNotify } from "@/lib/notificationProvider";
import Link from "next/link";
import { register } from "@/utils/actions/auth/action.auth";

const Register = () => {
    const notify = useNotify();
    const router = useRouter();
    const [form] = Form.useForm();
    const onFinish = async (values: any) => {
        delete values.confirm;
        values.role = "seller";
        const res = await register(values);
        if (!res.error) {
            notify("success", { message: "Register successful!", description: "Please verify your account.Check your email." });
            router.push(`/verify?email=${values.email}&type=register`);
            form.resetFields();
        } else {
            notify("error", { message: "Register failed!", description: res.error ?? "Something went wrong!" });
        }
    };

    return (
        <div style={wrapperStyle}>
            <h2 style={{ color: "white", marginBottom: "8px" }}>Create Account</h2>
            <p style={{ color: "#ddd", marginBottom: "20px" }}>
                Fill in your details to get started. It only takes a minute.
            </p>

            <Form form={form} name="register" onFinish={onFinish} layout="vertical">
                <Form.Item name="name" rules={[{ required: true, message: "Please input your name!" }]}>
                    <Input placeholder="Full Name" />
                </Form.Item>

                <Form.Item name="email" rules={[{ required: true, message: "Please input your Email!" }]}>
                    <Input placeholder="Email Address" />
                </Form.Item>

                <Form.Item name="password" rules={[{ required: true, message: "Please input your Password!" }]}>
                    <Input.Password placeholder="Password" />
                </Form.Item>

                {/* strength indicator */}
                <span style={{ fontSize: "12px", color: "#ddd" }}>
                    Password must be at least 6 characters, include a number and a letter.
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
                    <Input.Password placeholder="Confirm Password" />
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" block style={buttonStyle}>
                        Register
                    </Button>
                </Form.Item>
            </Form>

            <p style={{ marginTop: "20px", color: "#ddd" }}>
                Already have an account?{" "}
                <Link href="/login" style={{ color: "#00d4ff" }}>
                    Sign In
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

export default Register;
