
import { withAuth } from "next-auth/middleware"

export default withAuth({
    pages: {
        signIn: "/login"
    },
    callbacks: {
        authorized({ req, token }) {
            // // Nếu không có token, tức người dùng chưa đăng nhập
            // if (!token?.access_token) return false;
            const { pathname } = req.nextUrl;
            if (token?.role === "customer" && !pathname.startsWith("/login")) return false;

            // Nếu truy cập trang admin, chỉ cho phép người dùng có role ADMIN
            if (pathname.startsWith("/admin")) {
                return token?.role === "admin";
            }

            // Nếu truy cập trang product, cho phép cả ADMIN và USER
            if (pathname.startsWith("/seller")) {
                return token?.role === "seller";
            }

            // Các trang khác cho phép truy cập nếu đã đăng nhập
            return true;
        },
    },
}
)


export const config = {
    matcher: ["/admin/:path*", "/seller/:path*"],
};
