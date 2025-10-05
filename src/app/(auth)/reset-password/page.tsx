import ResetPassword from "@/components/auth/reset.password";
import { redirect } from "next/navigation";


const ResetPasswordPage = async ({
    searchParams,
}: {
    searchParams: Promise<{ email?: string; otp?: string }>;
}) => {
    // ✅ searchParams là Promise, cần await
    const { email, otp } = await searchParams;
    if (!email || !otp) {
        redirect("/login");
    }
    return <ResetPassword email={email} otp={otp} />;
};

export default ResetPasswordPage;
