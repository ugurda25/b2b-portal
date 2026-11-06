// js/services/cartService.js

import { api } from "./api.js";
import { getProductById } from "./productService.js";
import { getCurrentUser } from "./authService.js";

export let cart = [];

// Sepete Ürün Ekle
export function addToCart(productId, quantity) {
    const product = getProductById(productId);

    if (!product) {
        return { success: false, message: "Ürün bulunamadı!" };
    }

    if (quantity < product.minOrderQuantity) {
        return { success: false, message: `Bu ürün için minimum sipariş adedi: ${product.minOrderQuantity}` };
    }

    if (quantity > product.availableStock) {
        return { success: false, message: `Yetersiz stok! Mevcut stok: ${product.availableStock}` };
    }

    const existingIndex = cart.findIndex(item => item.productId === productId);

    if (existingIndex > -1) {
        const newQty = cart[existingIndex].quantity + quantity;
        if (newQty > product.availableStock) {
            return { success: false, message: `Toplam siparişiniz mevcut stoğu (${product.availableStock}) aşıyor!` };
        }
        cart[existingIndex].quantity = newQty;
    } else {
        cart.push({
            productId: product.id,
            name: product.name,
            unitPrice: product.wholeSalePrice,
            quantity: quantity
        });
    }

    return { success: true, message: "Ürün sepete eklendi." };
}




// Sepetten Belirli Bir Ürünü Sil
export function removeFromCart(productId) {
    const initialLength = cart.length;
    cart = cart.filter(item => Number(item.productId) !== Number(productId));
    return cart.length !== initialLength;
}

// Sepet Toplam Tutarı
export function getCartTotal(discountRate = 0) {
    const multiplier = 1 - (discountRate / 100);
    return cart.reduce((total, item) => {
        const discountedUnitPrice = Math.round((item.unitPrice * multiplier + Number.EPSILON) * 100) / 100;
        return total + (discountedUnitPrice * item.quantity);
    }, 0);
}

// Sepeti Temizle
export function clearCart() {
    cart = [];
}

// Siparişi Backend'e Gönder (POST /api/Orders/save)
export async function completeOrder() {
    if (cart.length === 0) {
        return { success: false, message: "Sepetiniz boş!" };
    }

    const currentUser = getCurrentUser();
    if (!currentUser || !currentUser.userId) {
        return { success: false, message: "Lütfen önce giriş yapınız!" };
    }

    // Backend DtoOrderIU formatı
    const orderPayload = {
        userId: currentUser.userId,
        status: "PENDING",
        isAutomated: false,
        orderDetails: cart.map(item => ({
            productId: item.productId,
            quantity: item.quantity
        }))
    };

    const res = await api.post("/Orders/save", orderPayload);

    if (res.success) {
        clearCart();
        return { 
            success: true, 
            message: `Siparişiniz başarıyla oluşturuldu! Sipariş No: ${res.data.orderNumber}`
        };
    }

    return { success: false, message: res.message };
}
