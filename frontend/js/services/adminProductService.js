// js/services/adminProductService.js
import { api } from "./api.js";

// Tüm ürünleri çek
export async function getAllProductsAdmin() {
    const res = await api.get("/products/list");
    if (res.success) {
        return res.data;
    }
    console.error("Ürünler getirilemedi:", res.message);
    return [];
}

// Hızlı Stok Ekle (availableStock + quantity)
export async function addProductStock(id, quantity) {
    const res = await api.put(`/products/add-stock/${id}?quantity=${quantity}`);
    return res;
}

// Ürün Aktif/Pasif Durumunu Değiştir
export async function toggleProductStatus(id) {
    const res = await api.put(`/products/toggle-status/${id}`);
    return res;
}

// Yeni Ürün Kaydet
export async function saveProduct(productData) {
    const res = await api.post("/products/save", productData);
    return res;
}

// Ürün Güncelle
export async function updateProduct(id, productData) {
    const res = await api.put(`/products/update/${id}`, productData);
    return res;
}