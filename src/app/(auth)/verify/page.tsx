// app/verify/page.tsx

import VerifyOtp from "@/components/auth/verify.page";
import { redirect } from "next/navigation";


const VerifyOtpPage = async ({
    searchParams,
}: {
    searchParams: Promise<{ email?: string; type?: "register" | "forgotPassword" }>;
}) => {
    // ✅ searchParams là Promise, cần await
    const { email, type } = await searchParams;
    if (!email || !type) {
        redirect("/login");
    }
    return <VerifyOtp email={email} type={type} />;
};

export default VerifyOtpPage;
