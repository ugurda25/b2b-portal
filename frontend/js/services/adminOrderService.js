// js/services/adminOrderService.js
import { api } from "./api.js";

// Tüm siparişleri getir
export async function getAllOrdersAdmin() {
    const res = await api.get("/Orders/list");
    if (res.success) {
        return res.data;
    }
    console.error("Siparişler getirilemedi:", res.message);
    return [];
}

// Sipariş durumunu güncelle (PENDING -> APPROVED -> SHIPPED -> DELIVERED veya CANCELED)
export async function updateOrderStatusAdmin(orderId, newStatus) {
    const res = await api.put(`/Orders/update-status/${orderId}?status=${newStatus}`);
    return res;
}