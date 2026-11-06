// js/services/loyaltyService.js

export async function getLoyaltyData(userId) {
    try {
        const response = await fetch(`http://localhost:8080/api/loyalty/user/${userId}`);
        if (!response.ok) {
            throw new Error("Sadakat verisi alınamadı");
        }
        return await response.json();
    } catch (error) {
        console.error("Sadakat servisi hatası:", error);
        return null;
    }
}