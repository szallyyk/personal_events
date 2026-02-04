import axios from "axios";
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import apiConfig from "./apiConfig.json";

export default defineNuxtPlugin(() => {
    const api: AxiosInstance = axios.create({
        baseURL: apiConfig.url,
        timeout: 10000,
        headers: {
            "App-Name": apiConfig.headers["App-Name"],
            "Access-Token": apiConfig.headers["Access-Token"],
            "App-Version": apiConfig.headers["App-Version"],
        }
    });

    api.interceptors.request.use(
        (request) => {
            const userStore = useUserStore();
            if (userStore.user && userStore.user.bearerToken) {
                request.headers.Authorization = `Bearer ${userStore.user.bearerToken}`;
            }
            return request;
        },
        (error) => Promise.reject(error)
    );


    api.interceptors.response.use(
        (response) => response,
        (error) => Promise.reject(error)
    );

    const get = async <T>(
        url: string,
        params: object = {},
        config: AxiosRequestConfig = {}
    ): Promise<T> => {
        const response: AxiosResponse<T> = await api.get(url, { params, ...config });
        return response.data;
    };

    const post = async <T>(
        url: string,
        data: object = {},
        config: AxiosRequestConfig = {}
    ): Promise<T> => {
        const response: AxiosResponse<T> = await api.post(url, data, config);
        return response.data;
    };

    const put = async <T>(
        url: string,
        data: object = {},
        config: AxiosRequestConfig = {}
    ): Promise<T> => {
        const response: AxiosResponse<T> = await api.put(url, data, config);
        return response.data;
    };

    return {
        provide: { api, get, post, put }
    };
});