export const api_url = "http://127.0.0.1:8000/api";
export const api_image_url = "http://127.0.0.1:8000/images";

export const API_ENDPOINTS = {
    LOGIN: `${api_url}/login`,
    LOGOUT: `${api_url}/logout`,
    USERS: `${api_url}/user`,
    USER_BY_ID: (id: number | string) => `${api_url}/user/${id}`,
    UPDATE_STATUS: (id: number | string) => `${api_url}/user/${id}/status`,

    MENU_TURSINA: `${api_url}/menu`,
    MENU_BY_ID: (id: number | string) => `${api_url}/menu/${id}`,

    GALERI: `${api_url}/galeri`,
    GALERI_BY_ID: (id: number | string) => `${api_url}/galeri/${id}`,

    PROMO: `${api_url}/promo`,
    PROMO_BY_ID: (id: number | string) => `${api_url}/promo/${id}`,

    OUTLET: `${api_url}/outlet`,
    OUTLET_BY_ID: (id: number | string) => `${api_url}/outlet/${id}`,

    CAREER: `${api_url}/karir`,
    CAREER_BY_ID: (id: number | string) => `${api_url}/karir/${id}`,

    MEMBERSHIP: `${api_url}/member`,
    MEMBERSHIP_BY_ID: (id: number | string) => `${api_url}/member/${id}`,

    CHANGE_PASSWORD: `${api_url}/change-password`,

    // Points management endpoints
    ADD_POINTS: (id: number) => `${api_url}/members/${id}/add-points`,
    REDEEM_POINTS: (id: number) => `${api_url}/members/${id}/redeem-points`,
    RESET_POINTS: (id: number) => `${api_url}/members/${id}/reset-points`,
    POINTS_HISTORY: (id: number) => `${api_url}/members/${id}/points-history`,
};

