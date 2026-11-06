// js/services/adminDealerService.js
import { api } from "./api.js";

export async function getAllDealersAdmin() {
    const res = await api.get("/Users/list");
    if (res.success && Array.isArray(res.data)) {
        // Sadece BAYI rolündeki kullanıcıları getir
        return res.data.filter(user => (user.role || "BAYI").toUpperCase() === "BAYI");
    }
    return [];
}

export async function updateDealerAdmin(id, payload) {
    const res = await api.put(`/Users/update/${id}`, payload);
    return res;
}

export async function toggleDealerStatusAdmin(id, currentStatus) {
    // Sadece durumu tersine çeviren payload'ı mevcut update servisine gönderiyoruz
    const payload = { isActive: !currentStatus };
    const res = await api.put(`/Users/update/${id}`, payload);
    return res;
}

export async function saveDealer(payload) {
    const res = await api.post("/Users/save", payload);
    return res;
}