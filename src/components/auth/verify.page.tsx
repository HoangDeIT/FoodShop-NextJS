"use client";
import React, { useState } from "react";
import { Button, Input, message } from "antd";
import { useRouter } from "next/navigation";
import { verifyOTP } from "@/utils/actions/auth/action.auth";
import { useNotify } from "@/lib/notificationProvider";

const VerifyOtp = ({ email, type }: { email: string, type: "register" | "forgotPassword" }) => {
    const [otp, setOtp] = useState(Array(6).fill(""));
    const router = useRouter();
    const notify = useNotify();
    const handleChange = (value: string, index: number) => {
        if (/^\d*$/.test(value)) {
            const newOtp = [...otp];
            newOtp[index] = value;
            setOtp(newOtp);

            // auto focus next
            if (value && index < 5) {
                const next = document.getElementById(`otp-${index + 1}`);
                (next as HTMLInputElement)?.focus();
            }

            // khi đủ 6 số
            if (newOtp.join("").length === 6) {
                verifyOtp(newOtp.join(""));
            }
        }
    };
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            const prev = document.getElementById(`otp-${index - 1}`);
            (prev as HTMLInputElement)?.focus();
        }
    };
    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        const pasteData = e.clipboardData.getData("text").trim();
        if (/^\d{6}$/.test(pasteData)) {
            setOtp(pasteData.split(""));
            // focus ra ô cuối cùng
            const last = document.getElementById("otp-5");
            (last as HTMLInputElement)?.focus();
        }
    };
    const verifyOtp = async (code: string) => {
        const res = await verifyOTP({ email, otp: code });
        if (!res.error) {
            setOtp(Array(6).fill(""));
            if (type === "register") {
                router.push("/login");
                notify("success", { message: "Register successful!", description: "OK" });
            } else {
                router.push(`/reset-password?email=${email}&otp=${code}`);
                notify("success", { message: "Verify successful!", description: "OK" });
            }

        } else {
            notify("error", { message: "Verify failed!", description: res.error ?? "Something went wrong!" });
        }
    };

    return (
        <div style={wrapperStyle}>
            <h2 style={{ color: "white", marginBottom: "8px" }}>Verify OTP</h2>
            <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
                {otp.map((digit, i) => (
                    <Input
                        key={i}
                        id={`otp-${i}`}
                        maxLength={1}
                        value={digit}
                        onKeyDown={(e) => handleKeyDown(e, i)}
                        onPaste={handlePaste}
                        onChange={(e) => handleChange(e.target.value, i)}
                        style={{
                            width: "40px",
                            height: "40px",
                            textAlign: "center",
                            fontSize: "18px",
                        }}
                    />
                ))}
            </div>
            <p style={{ color: "#ddd", marginTop: "16px" }}>
                Please enter the 6-digit code we sent to your email.
            </p>
            <Button
                type="primary"
                block
                style={{ marginTop: "20px", background: "linear-gradient(90deg,#4e54c8,#00d4ff)", border: "none" }}
                onClick={() => verifyOtp(otp.join(""))}
                disabled={otp.join("").length < 6}
            >
                Verify
            </Button>
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

export default VerifyOtp;
