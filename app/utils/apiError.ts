// utils/apiError.ts
import axios from "axios";

interface ApiError {
    message: string;
    errors: Record<string, string[]>;
    status: number | null;
}

export function parseApiError(err: unknown): ApiError {
    if (axios.isAxiosError(err) && err.response) {
        return {
            message: err.response.data?.message ?? "Chyba serveru",
            errors: err.response.data?.errors ?? {},
            status: err.response.status,
        };
    }

    if (axios.isAxiosError(err) && err.request) {
        return {
            message: "Server neodpovídá",
            errors: {},
            status: null,
        };
    }

    return {
        message: "Neočekávaná chyba",
        errors: {},
        status: null,
    };
}