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
        __v: number;
        OTP?: string;
        OTPExpired?: string;
        status: "active" | "inactive";
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
}