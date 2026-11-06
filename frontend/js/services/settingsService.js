// js/services/settingsService.js

const API_BASE = "http://localhost:8080/api/Users";

export async function getProfileData(userId) {
    try {
        const response = await fetch(`${API_BASE}/list/${userId}`);
        if (!response.ok) throw new Error("Profil bilgisi alınamadı");
        return await response.json();
    } catch (error) {
        console.error("Profil getirme hatası:", error);
        return null;
    }
}

export async function updateProfileData(userId, profileData) {
    try {
        const response = await fetch(`${API_BASE}/update/${userId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(profileData)
        });
        if (!response.ok) throw new Error("Profil güncellenemedi");
        return { success: true, message: "Firma bilgileri başarıyla güncellendi!" };
    } catch (error) {
        return { success: false, message: error.message };
    }
}

export async function updatePasswordData(userId, oldPassword, newPassword) {
    try {
        const response = await fetch(`${API_BASE}/change-password/${userId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ oldPassword, newPassword })
        });
        const text = await response.text();
        const isSuccess = text.includes("başarıyla");
        return { success: isSuccess, message: text };
    } catch (error) {
        return { success: false, message: "Bağlantı hatası oluştu!" };
    }
}