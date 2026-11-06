// js/services/recurringService.js

import { api } from "./api.js";
import { getCurrentUser } from "./authService.js";

// Bayiye ait talimatları çeker
export async function getRecurringOrders() {
    const user = getCurrentUser();
    if (!user) return [];

    const userId = user.userId || user.id;
    if (!userId) return [];

    const res = await api.get(`/recurring-orders/user/${userId}`);

    if (res && res.success && Array.isArray(res.data)) {
        return res.data;
    } else if (Array.isArray(res)) {
        return res;
    }
    return [];
}

// Yeni Talimat Kaydetme (DtoRecurringOrderIU formatı)
export async function saveRecurringOrder(payload) {
    return await api.post("/recurring-orders/save", payload);
}

// Talimatı Pasife Alma (Cancel)
export async function cancelRecurringOrder(id) {
    return await api.put(`/recurring-orders/cancel/${id}`);
}