// js/services/balanceService.js

import { api } from "./api.js";
import { getCurrentUser } from "./authService.js";

export async function getBalanceSummary() {
    const user = getCurrentUser();
    if (!user) {
        return { creditLimit: 0, currentBalance: 0, availableLimit: 0 };
    }

    const userId = user.userId || user.id;
    if (!userId) {
        return { creditLimit: 0, currentBalance: 0, availableLimit: 0 };
    }

    let userData = null;

    try {
        // Backend'den kullanıcıyı çek
        const res = await api.get(`/Users/list/${userId}`);
        console.log("Balance API Response:", res); // Gelen veriyi konsolda görmek için

        if (res && res.success && res.data) {
            userData = res.data;
        } else if (res && (res.id || res.userId || res.creditLimit !== undefined)) {
            userData = res;
        }
    } catch (e) {
        console.error("Kullanıcı bakiye verisi çekilemedi:", e);
    }

    // API'den gelmediyse localStorage'daki kullanıcı nesnesine bak
    if (!userData) {
        userData = user;
    }

    console.log("Hesaplanan User Data:", userData);

    const creditLimit = Number(userData.creditLimit || userData.credit_limit || 0);
    const currentBalance = Number(userData.currentBalance || userData.current_balance || 0);
    const availableLimit = Math.max(0, creditLimit - currentBalance);

    return {
        creditLimit,
        currentBalance,
        availableLimit
    };
}

export async function getTransactions() {
    const user = getCurrentUser();
    if (!user) return [];

    const userId = user.userId || user.id;
    if (!userId) return [];

    const res = await api.get(`/Orders/user/${userId}`);
    
    let orderList = [];
    if (res && res.success && Array.isArray(res.data)) {
        orderList = res.data;
    } else if (Array.isArray(res)) {
        orderList = res;
    }

    const filteredOrders = orderList.filter(o => o.status !== "CANCELED");
    return filteredOrders.map(order => ({
        id: order.id,
        date: order.orderDate ? new Date(order.orderDate).toLocaleString("tr-TR") : "-",
        description: `Toptan Sipariş (${order.orderNumber || 'ORD-' + order.id})`,
        type: "BORÇ",
        amount: Number(order.totalAmount || 0),
        status: order.status
    }));
}

export async function payDebt(amount) {
    const user = getCurrentUser();
    const userId = user ? (user.userId || user.id) : null;
    if (!userId) {
        return { success: false, message: "Lütfen önce giriş yapınız!" };
    }

    return api.put(`/Users/pay-debt/${userId}`, { amount });
}
