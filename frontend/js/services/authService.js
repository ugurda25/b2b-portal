// js/services/authService.js
import { api } from "./api.js";

export async function login(username, password) {
    const res = await api.post("/Users/login", { username, password });

    if (res.success) {
        localStorage.setItem("currentUser", JSON.stringify(res.data));
        return { success: true, user: res.data };
    }

    return { success: false, message: res.message };
}

export async function requestPasswordReset(username) {
    return await api.post("/Users/request-password-reset", { username });
}

export function logout() {
    localStorage.removeItem("currentUser");
}

export function getCurrentUser() {
    const userJson = localStorage.getItem("currentUser");
    return userJson ? JSON.parse(userJson) : null;
}
