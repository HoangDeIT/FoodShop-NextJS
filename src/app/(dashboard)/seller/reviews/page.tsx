import ManageReviewsGroupedClient from "@/components/reviews/manage.review";
import { getSellerReviewsGrouped } from "@/utils/actions/sellers/action.review";

const ManageReviewsPage = async () => {
    const res = await getSellerReviewsGrouped(1, 5, "all");
    const groups = res?.data?.result || [];
    const meta = res?.data?.meta || {};

    return (
        <ManageReviewsGroupedClient
            initialGroups={groups}
            initialMeta={meta}
        />
    );
}
export default ManageReviewsPage;