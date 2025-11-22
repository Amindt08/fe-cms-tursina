export const api_url = "http://127.0.0.1:8000/api";
export const api_image_url = "http://127.0.0.1:8000/images";

export const API_ENDPOINTS = {
    LOGIN: `${api_url}/login`,
    LOGOUT: `${api_url}/logout`,
    USERS: `${api_url}/users`,
    USER_BY_ID: (id: number | string) => `${api_url}/users/${id}`,
    UPDATE_STATUS: (id: number | string) => `${api_url}/users/${id}/status`,

    MENU_TURSINA: `${api_url}/menu`,
    MENU_BY_ID: (id: number | string) => `${api_url}/menu/${id}`,

    PROMO: `${api_url}/promo`,
    PROMO_BY_ID: (id: number | string) => `${api_url}/promo/${id}`,

    OUTLET: `${api_url}/outlet`,
    OUTLET_BY_ID: (id: number | string) => `${api_url}/outlet/${id}`,

    CAREER: `${api_url}/karir`,
    CAREER_BY_ID: (id: number | string) => `${api_url}/karir/${id}`,
};
