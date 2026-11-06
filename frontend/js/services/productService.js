// js/services/productService.js
import { api } from "./api.js";

export let products = [];

export async function fetchProducts() {
    const res = await api.get("/products/list");
    if (res.success) {
        products = res.data.filter(product => product.isActive === true);
        return products;
    }
    return [];
}

export function filterProducts(keyword) {
    const term = keyword.toLowerCase().trim();
    if (!term) return products;

    return products.filter(p => 
        p.name.toLowerCase().includes(term) || 
        p.barcode.toLowerCase().includes(term)
    );
}

export function getProductById(id) {
    return products.find(p => p.id === id);
}