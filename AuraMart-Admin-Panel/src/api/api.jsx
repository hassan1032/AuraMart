import axios from "axios";
import { getToken, removeToken } from "../auth/authToken";


export const api = axios.create({
    baseURL: import.meta.VITE_API_URL,
    headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
    },
});


api.interceptors.request.use((config) => {
    const token = getToken();

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
},
    (error) => Promise.reject(error)

);


// Response

api.interceptors.response.use((response) =>
    response,
    (error) => {
        const msg = error?.response?.data?.message;

        if (msg === "Token expired please login again.") {
            removeToken();
            // window.location.reload();
            window.location.href = "/login"
        }

        return Promise.reject(error);
    });