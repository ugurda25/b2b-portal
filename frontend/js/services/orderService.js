// js/services/orderService.js

import { api } from "./api.js";
import { getCurrentUser } from "./authService.js";

// Giriş yapan bayinin geçmiş siparişlerini çeken fonksiyon
export async function getOrders() {
    const user = getCurrentUser();
    if (!user || !user.userId) return [];

    const res = await api.get(`/Orders/user/${user.userId}`);
    
    if (res && res.success && Array.isArray(res.data)) {
        return res.data;
    } else if (Array.isArray(res)) {
        return res;
    }
    return [];
}

// Sipariş İptal Etme
export async function cancelOrder(orderId) {
    return await api.put(`/Orders/cancel/${orderId}`);
}