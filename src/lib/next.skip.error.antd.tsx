"use client";

import { ReactNode, useEffect } from "react";

export default function ClientWrapper({ children }: { children: ReactNode }) {
    useEffect(() => {
        const originalWarn = console.warn;
        const originalError = console.error;

        // console.warn = (...args) => {
        //     if (
        //         typeof args[0] === "string" &&
        //         args[0].includes("[antd: compatible] antd v5 support React is 16 ~ 18.")
        //     ) {
        //         return;
        //     }
        //     originalWarn(...args);
        // };

        console.error = (...args) => {
            if (
                typeof args[0] === "string" &&
                args[0].includes("[antd: compatible] antd v5 support React is 16 ~ 18.")
            ) {
                return;
            }
            originalError(...args);
        };

        return () => {
            console.warn = originalWarn;
            console.error = originalError;
        };
    }, []);

    return <>{children}</>;
}
