import ManageProducts from "@/components/seller/product/manage.products";
import { getProductsBySeller, getSellerCategories } from "@/utils/actions/sellers/action.products";

const ManageProductsPage = async () => {
    const res = await getProductsBySeller({ current: 1, pageSize: 10 });
    const catRes = await getSellerCategories();

    const initialProducts = res?.data?.result ?? [];
    const initialMeta = res?.data?.meta ?? { current: 1, pageSize: 10, pages: 1, total: 0 };
    const categories = catRes?.data ?? [];
    return (
        <ManageProducts
            initialProducts={initialProducts}
            initialMeta={initialMeta}
            initialCategories={categories}
        />
    );
}
export default ManageProductsPage;