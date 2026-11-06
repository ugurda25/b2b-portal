// js/services/api.js

const BASE_URL = "http://localhost:8080/api";

async function request(endpoint, options = {}) {
    const url = `${BASE_URL}${endpoint}`;
    
    const defaultHeaders = {
        "Content-Type": "application/json"
    };

    const config = {
        ...options,
        headers: {
            ...defaultHeaders,
            ...options.headers
        }
    };

    try {
        const response = await fetch(url, config);
        const data = await response.json().catch(() => null); // Boş body dönerse hata vermesin

        if (!response.ok) {
            // Backend GlobalExceptionHandler'dan dönen hata mesajını yakala
            const errorMessage = Array.isArray(data) ? data[0] : (data?.message || "Sunucu hatası oluştu!");
            throw new Error(errorMessage);
        }

        return { success: true, data: data };
    } catch (error) {
        console.error(`[API Hatası] ${endpoint}:`, error.message);
        return { success: false, message: error.message };
    }
}

export const api = {
    get: (endpoint) => request(endpoint, { method: "GET" }),
    post: (endpoint, body) => request(endpoint, { method: "POST", body: JSON.stringify(body) }),
    put: (endpoint, body) => request(endpoint, { method: "PUT", body: JSON.stringify(body) }),
    delete: (endpoint) => request(endpoint, { method: "DELETE" })
};