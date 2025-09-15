"use client";

import { Provider } from "react-redux";
import { store } from "../redux/store";
import { fetchRates } from "@/lib/redux/thunks/rateThunks";
import { useEffect } from "react";

export function ReduxProvider({ children }: { children: React.ReactNode }) {
    useEffect(() => {
        store.dispatch(fetchRates());
    }, []);

    return <Provider store={store}>{children}</Provider>;
}
