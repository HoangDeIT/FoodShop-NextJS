"use client";
import React from "react";
import { Form, Input, Button, Checkbox, Divider, notification } from "antd";
import { GoogleOutlined, GithubOutlined } from "@ant-design/icons";
import type { NotificationArgsProps } from 'antd';
import { useNotify } from "@/lib/notificationProvider";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";


const Login = () => {
    const notify = useNotify();
    const router = useRouter();
    const onFinish = async (values: any) => {
        console.log("Success:", values);
        const res = await signIn("credentials", { username: values.email, password: values.password, redirect: false })
        if (res?.ok) {
            notify("success", { message: "Login successful!", description: "You have been logged in successfully." });
            router.push("/redirect");
        }
    };

    return (
        <div

            style={{
                height: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: `
      radial-gradient(circle at 20% 20%, rgba(255,255,255,0.1) 0%, transparent 40%),
      radial-gradient(circle at 80% 80%, rgba(255,255,255,0.05) 0%, transparent 50%),
      linear-gradient(135deg, #667eea, #764ba2)
    `,
                backgroundSize: "200% 200%",
                animation: "waves 10s linear infinite",
            }}
        >
            <style jsx global>{`
  @keyframes waves {
    0% {
      background-position: 0% 0%;
    }
    50% {
      background-position: 100% 100%;
    }
    100% {
      background-position: 0% 0%;
    }
  }
`}</style>
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
                        <a href="#" style={{ color: "#00d4ff" }}>
                            Forgot password?
                        </a>
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
                    <span style={{ color: "#ddd" }}>or continue with</span>
                </Divider>

                <div style={{ display: "flex", gap: "10px" }}>
                    <Button icon={<GoogleOutlined />} block>
                        Google
                    </Button>
                    <Button icon={<GithubOutlined />} block>
                        GitHub
                    </Button>
                </div>

                <p style={{ marginTop: "20px", color: "#ddd" }}>
                    Don’t have an account?{" "}
                    <a href="#" style={{ color: "#00d4ff" }}>
                        Sign up
                    </a>
                </p>
            </div>
        </div>
    );
};

export default Login;
