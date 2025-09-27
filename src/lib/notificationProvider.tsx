"use client";

import { ReactNode, createContext, useContext } from "react";
import { notification } from "antd";
import type { NotificationArgsProps } from "antd";

type NotificationType = "success" | "info" | "warning" | "error";

interface NotifyContextType {
    notify: (
        type: NotificationType,
        options: {
            message: string;
            description?: ReactNode;
            placement?: NotificationArgsProps["placement"];
        }
    ) => void;
}

const NotifyContext = createContext<NotifyContextType | null>(null);

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
    const [api, contextHolder] = notification.useNotification();

    const notify: NotifyContextType["notify"] = (
        type,
        { message, description, placement }
    ) => {
        api[type]({
            message,
            description,
            placement: placement || "topRight",
        });
    };

    return (
        <NotifyContext.Provider value={{ notify }}>
            {contextHolder}
            {children}
        </NotifyContext.Provider>
    );
};

export const useNotify = () => {
    const ctx = useContext(NotifyContext);
    if (!ctx) {
        throw new Error("useNotify must be used inside NotificationProvider");
    }
    return ctx.notify;
};
