import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// Agregar el token JWT a las solicitudes
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

// Manejar los errores de autenticación
api.interceptors.response.use(
    (response) => response,
    (error) => {
        const requestUrl =
            error.config && error.config.url ?
            error.config.url :
            "";

        const isLoginRequest = requestUrl.includes("/auth/login");

        const isUnauthorized =
            error.response && error.response.status === 401;

        if (isUnauthorized && !isLoginRequest) {
            localStorage.removeItem("token");
            localStorage.removeItem("user");

            if (window.location.pathname !== "/login") {
                window.location.href = "/login";
            }
        }

        return Promise.reject(error);
    }
);

export default api;