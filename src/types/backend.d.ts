export { }

declare global {

    interface IRequest {
        url: string;
        method: string;
        body?: { [key: string]: any } | FormData;
        queryParams?: any;
        useCredentials?: boolean;
        headers?: any;
        nextOption?: any;
    }

    interface IBackendRes<T> {
        error?: string | string[];
        message: string;
        statusCode: number | string;
        data?: T;
    }
    interface IModelPaginate<T> {
        meta: IMeta;
        result: T[]
    }
    interface IMeta {
        current: number;
        pageSize: number;
        pages: number;
        total: number;
    }
    interface IUserR {
        user: IUser;
        profile: IUserProfile;
    }
    type IUserProfile = ISellerProfile | ICustomerProfile | null;
    interface IUser {
        avatar?: string;
        _id: string;
        name: string;
        email: string;
        role: "admin" | "seller" | "customer"; // nếu role chỉ có 3 giá trị này
        createdBy: string | null;
        isDeleted: boolean;
        deletedAt: string | null;
        createdAt: string;
        updatedAt: string;
        isOpen: boolean;
        __v: number;
        OTP?: string;
        OTPExpired?: string;
        status: "active" | "inactive";
    }
    export interface ICustomerProfile {
        type: "customer";

        _id: string;
        userId: string;

        location?: ILocation;

        expoToken?: string;
        isOnline: boolean;

        lastActive?: string;

        createdAt: string;
        updatedAt: string;
    }
    export interface ISellerProfile {
        type: "seller";

        _id: string;
        userId: string;

        shopName: string;
        description?: string;

        location?: ILocation;

        isOpen: boolean;
        isOnline: boolean;

        lastActive?: string;

        createdBy?: {
            _id: string;
            email: string;
        };

        updatedBy?: {
            _id: string;
            email: string;
        };

        createdAt: string;
        updatedAt: string;
    }
    interface ILocation {
        latitude: number;
        longitude: number;
        address?: string;
    }
    interface ICreateUser {
        name: string,
        email: string,
        password: string,
        status: "active" | "inactive",
        role: "admin" | "seller" | "customer"
        avatar?: string
    }
    interface IUpdateUser extends ICreateUser {
        _id: string

    }

    interface ICategoryR {
        _id: string;
        name: string;
        description?: string;
        image?: string;
        icon?: string;
        createdBy: string | null;
        isDeleted: boolean;
        deletedAt: string | null;
        createdAt: string;
        updatedAt: string;
    }
    interface ICreateCategory {
        name: string;
        description?: string;
        image?: string;
        icon?: string;
    }

    interface IUpdateCategory extends ICreateCategory {

    }
    interface IProductR {
        _id: string;

        // 🧋 Thông tin cơ bản
        name: string;
        description?: string;
        image?: string;

        // 💰 Giá cơ bản
        basePrice: number;

        // 📦 Phân loại
        category: string | ICategoryR; // nếu populate thì là object
        seller: string | IUserR;        // nếu populate thì là object

        // 🧩 Biến thể sản phẩm
        sizes?: IProductSize[];
        toppings?: IProductTopping[];

        // ⚙️ Trạng thái
        inStock?: boolean;
        sold?: number;
        isDeleted?: boolean;
        deletedAt?: string | null;

        // 📅 Metadata
        createdBy?: {
            _id: string;
            email: string;
        } | null;
        createdAt?: string;
        updatedAt?: string;
        __v?: number;
    }

    // ✅ Sub-types
    interface IProductSize {
        _id?: string;
        name: string;
        price: number;
        isDefault?: boolean;
        isDeleted?: boolean;
        deletedAt?: string | null;
    }

    interface IProductTopping {
        _id?: string;
        name: string;
        price: number;
        isDeleted?: boolean;
        deletedAt?: string | null;
    }
    interface ICreateProduct {
        // 🧋 Thông tin cơ bản
        name: string;
        description?: string;
        image?: string;

        // 💰 Giá cơ bản
        basePrice: number;

        // 📦 Phân loại
        category: string; // _id của Category

        // 🧩 Tuỳ chọn sản phẩm
        sizes?: IProductSizeCreate[];
        toppings?: IProductToppingCreate[];

        // ⚙️ Trạng thái & số lượng
        inStock?: boolean;
        sold?: number;

        // ✅ Admin bật/tắt món
        isAvailable?: boolean;
    }

    // Sub-types cho nested field
    interface IProductSizeCreate {
        name: string;
        price: number;
        isDefault?: boolean;
    }

    interface IProductToppingCreate {
        name: string;
        price: number;
    }

    interface IOrderItem {
        productName: string;
        quantity: number;
        totalPrice: number;
        toppingNames: string[];
        sizeName?: string;
        image?: string;
    }
    interface IOrder {
        _id: string;
        customer?: { name: string; email: string };
        shop?: { name: string };
        items: IOrderItem[];
        totalPrice: number;
        orderStatus:
        | "pending"
        | "confirmed"
        | "preparing"
        | "delivering"
        | "completed"
        | "cancelled";
        receiverName: string;
        receiverPhone: string;
        note: string;
        orderDate: string;

        /**  Địa chỉ giao hàng (có thể null nếu chưa set) */
        deliveryAddress?: {
            address?: string;
            latitude: number;
            longitude: number;
            coordinates?: number[]; // optional vì đôi khi không cần show
        };
    }

    // 🔹 Các trạng thái hợp lệ
    const ORDER_STATUSES = [
        "pending",
        "confirmed",
        "preparing",
        "delivering",
        "completed",
        "cancelled",
    ] as const;
    interface IReviewR {
        _id: string;
        user: IUserR;
        rating: number; // 1–5 sao
        comment: string;
        images: string[];
        replies: IReviewReplyR[];
        isDeleted: boolean;
        createdAt: string;
        updatedAt: string;
    }
    interface IReviewReplyR {
        user: IUserR;
        comment: string;
        isDeleted: boolean;
        createdAt: string;
        updatedAt: string;
    }
    interface ISellerReviewsGrouped {
        _id: string;
        product: IProductR;
        reviews: IReviewR[];
    }

    ///
    interface IRevenueByMonth {
        month: string; // "Jan", "Feb", ...
        revenue: number;
    }

    interface IUserRegisterByMonth {
        month: string;
        customers: number;
        sellers: number;
    }

    interface IAdminDashboard {
        totalSellers: number;
        totalCustomers: number;
        totalSuccessOrders: number;
        revenueMonth: number;
        revenueByMonth: IRevenueByMonth[];
        userRegisterByMonth: IUserRegisterByMonth[];
    }

    // ======================
    // 📊 DASHBOARD SELLER
    // ======================
    interface ISellerChartPoint {
        day: string; // "1", "2", ...
        revenue?: number;
        orders?: number;
    }

    interface ISellerDashboard {
        totalProducts: number;
        totalApprovedOrders: number;
        totalPendingOrders: number;
        revenueThisMonth: number;
        revenueData: ISellerChartPoint[];
        ordersData: ISellerChartPoint[];
        avgRating: number;
        favorites: number;
    }
}