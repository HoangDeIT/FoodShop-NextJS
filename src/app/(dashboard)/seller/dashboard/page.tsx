import SellerDashboardClient from "@/components/seller/dashboard/dashboard.seller";
import { getSellerDashboard } from "@/utils/actions/sellers/action.dashboard";

// ⏱️ ISR: tái tạo lại mỗi 60 giây
export const revalidate = 60;

export default async function SellerDashboardPage() {
    const res = await getSellerDashboard();
    const data: ISellerDashboard | null = res?.data ?? null;

    return <SellerDashboardClient data={data} />;
}
