"use client";
import React from "react";
import { Form, Input, Button, Checkbox, Divider, notification } from "antd";
import { GoogleOutlined, GithubOutlined } from "@ant-design/icons";
import type { NotificationArgsProps } from 'antd';
import { useNotify } from "@/lib/notificationProvider";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { checkUser } from "@/utils/actions/auth/action.auth";


const Login = () => {
    const notify = useNotify();
    const router = useRouter();
    const onFinish = async (values: any) => {
        console.log("Success:", values);
        ///FIX BUG
        const res1 = await checkUser({ email: values.email, password: values.password });
        console.log("check res1: ", res1);
        if (res1.statusCode === 999) {
            notify("error", { message: "Please activate your account!", description: "Your account has been disabled." });
            router.push(`/verify?email=${values.email}&type=register`);
            return;
        } else if (res1.error) {
            notify("error", { message: "Login failed!", description: res1.error ?? "Something went wrong!" });
            return;
        }
        ///
        const res = await signIn("credentials", { username: values.email, password: values.password, redirect: false })
        console.log("check res: ", res);
        if (res?.ok) {
            notify("success", { message: "Login successful!", description: "You have been logged in successfully." });
            router.push("/redirect");
        }
    };

    return (

        <div
            style={{
                background: "rgba(255, 255, 255, 0.08)",
                backdropFilter: "blur(20px)",
                padding: "40px",
                borderRadius: "12px",
                textAlign: "center",
                width: "350px",
                boxShadow: "0 8px 32px rgba(31, 38, 135, 0.37)",
                color: "white",
            }}
        >
            <h2 style={{ color: "white", marginBottom: "8px" }}>Welcome Back</h2>
            <p style={{ color: "#ddd", marginBottom: "20px" }}>
                Sign in to your account
            </p>

            <Form name="login" onFinish={onFinish} layout="vertical">
                <Form.Item
                    name="email"
                    rules={[{ required: true, message: "Please input your Email!" }]}
                >
                    <Input placeholder="Email Address" />
                </Form.Item>

                <Form.Item
                    name="password"
                    rules={[{ required: true, message: "Please input your Password!" }]}
                >
                    <Input.Password placeholder="Password" />
                </Form.Item>

                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: "16px",
                        fontSize: "14px",
                        color: "#ddd",
                    }}
                >
                    <Checkbox>Remember me</Checkbox>
                    <Link href="/forgot-password" style={{ color: "#00d4ff" }}>
                        Forgot password?
                    </Link>
                </div>

                <Form.Item>
                    <Button
                        type="primary"
                        htmlType="submit"
                        block
                        style={{
                            background: "linear-gradient(90deg, #4e54c8, #00d4ff)",
                            border: "none",
                        }}
                    >
                        Sign In
                    </Button>
                </Form.Item>
            </Form>

            <Divider style={{ borderColor: "rgba(255,255,255,0.2)" }}>

            </Divider>


            <p style={{ marginTop: "20px", color: "#ddd" }}>
                Don’t have an account?{" "}
                <Link href="/register" style={{ color: "#00d4ff" }}>
                    Sign up
                </Link>
            </p>
        </div>

    );
};

export default Login;
