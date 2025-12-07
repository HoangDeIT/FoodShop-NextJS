import DashboardClient from "@/components/admin/dashboard/dashboard.admin";
import { getAdminDashboard } from "@/utils/actions/admin/action.dashboard";

export const revalidate = 300;

export default async function AdminDashboardPage() {
    const res = await getAdminDashboard();
    const data = res.data;
    if (!data) return null;
    return <DashboardClient data={data} />;
}
