// js/services/adminRecurringService.js
import { api } from "./api.js";

export async function getAllRecurringOrdersAdmin() {
    const res = await api.get("/recurring-orders/list");
    if (res.success && Array.isArray(res.data)) {
        return res.data;
    }
    return [];
}

export async function toggleRecurringOrderStatusAdmin(id) {
    return await api.put(`/recurring-orders/toggle-status/${id}`);
}
