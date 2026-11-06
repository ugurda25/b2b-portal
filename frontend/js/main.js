// js/main.js

// 1. DİĞER KATMANLARI IMPORT ET
import { fetchProducts, filterProducts, products } from "./services/productService.js";
import { cart, addToCart, removeFromCart, getCartTotal, completeOrder } from "./services/cartService.js";
import { renderProductList } from "./views/productView.js";
import { getOrders, cancelOrder } from "./services/orderService.js";
import { renderOrderHistory } from "./views/orderView.js";
import { getRecurringOrders, saveRecurringOrder, cancelRecurringOrder } from "./services/recurringService.js";
import { renderRecurringOrders } from "./views/recurringView.js";
import { getBalanceSummary, getTransactions, payDebt } from "./services/balanceService.js";
import { renderBalanceView } from "./views/balanceView.js";
import { getLoyaltyData } from "./services/loyaltyService.js";
import { renderLoyalty } from "./views/loyaltyView.js";
import { getProfileData, updateProfileData, updatePasswordData } from "./services/settingsService.js";
import { renderSettingsView } from "./views/settingsView.js";
import { login, logout, getCurrentUser, requestPasswordReset } from "./services/authService.js";


// 2. DOM SEÇİCİLERİ
const menuButtons = document.querySelectorAll("#bayi-menu button");
const sectionTitle = document.querySelector("#section-title");
const contentArea = document.querySelector("#content-area");
const searchInput = document.querySelector("#searchProduct");
const btnRefresh = document.querySelector("#btnRefresh");
const cartBadge = document.querySelector("#cartBadge");

// Arama kutusunun dış kapsayıcısı (Search Input'un bulunduğu div)
const searchContainer = searchInput ? searchInput.closest(".input-group") || searchInput : null;

const btnOpenCart = document.querySelector("#btnOpenCart");
const cartList = document.querySelector("#cartList");
const cartTotal = document.querySelector("#cartTotal");
const btnOrder = document.querySelector("#btnOrder");
let cartDiscountRate = 0;

// Auth Seçicileri
const loginContainer = document.querySelector("#login-container");
const dashboardContainer = document.querySelector("#dashboard-container");
const mainContent = document.querySelector(".main-content");
const userDisplay = document.querySelector("#user-display");
const formLogin = document.querySelector("#form-login");
const btnForgotPassword = document.querySelector("#btn-forgot-password");
const btnLogout = document.querySelector("#menu-logout");




function renderCartModal() {
    cartList.innerHTML = "";

    if (!cart || cart.length === 0) {
        cartList.innerHTML = `<li class="list-group-item text-center text-muted">Sepetiniz boş.</li>`;
        cartTotal.innerText = "0.00 ₺";
        cartBadge.innerText = 0;
        return;
    }

    const discountMultiplier = 1 - (cartDiscountRate / 100);
    cart.forEach(item => {
        const basePrice = Number(item.unitPrice);
        const discountedPrice = Math.round((basePrice * discountMultiplier + Number.EPSILON) * 100) / 100;
        const itemTotal = discountedPrice * Number(item.quantity);
        const priceText = cartDiscountRate > 0
            ? `<del class="text-muted mr-1">${basePrice.toFixed(2)} ₺</del> ${discountedPrice.toFixed(2)} ₺ (%${cartDiscountRate} indirim)`
            : `${basePrice.toFixed(2)} ₺`;
        cartList.innerHTML += `
            <li class="list-group-item d-flex justify-content-between align-items-center">
                <div>
                    <h6 class="mb-0 font-weight-bold text-dark">${item.name}</h6>
                    <small>${priceText} x ${item.quantity} Adet</small>
                </div>
                <div class="d-flex align-items-center">
                    <span class="font-weight-bold text-primary mr-3">${itemTotal.toFixed(2)} ₺</span>
                    <button class="btn btn-sm btn-outline-danger btn-remove-cart-item" data-id="${item.productId}" title="Sepetten Çıkar">
                        <i class="fa-solid fa-trash-can"></i>
                    </button>
                </div>
            </li>
        `;
    });

    cartTotal.innerText = `${getCartTotal(cartDiscountRate).toFixed(2)} ₺`;
    cartBadge.innerText = cart.reduce((sum, item) => sum + item.quantity, 0);
}
// Oturum Kontrolü ve Ekran Gösterimi
// js/main.js

async function checkAuth() {
    const user = getCurrentUser();

    if (user && user.userId) {
        // Eğer kullanıcı ADMIN ise doğrudan admin paneline yönlendir
        if (user.role && user.role.toUpperCase() === "ADMIN") {
            window.location.href = "admin.html";
            return;
        }

        // Bayi ise Login formunu kapat, Paneli aç
        loginContainer.style.setProperty("display", "none", "important");
        dashboardContainer.style.setProperty("display", "flex", "important");
        mainContent.style.setProperty("display", "block", "important");

        if (userDisplay) {
            userDisplay.innerText = user.companyName || user.username || "Bayi";
        }

        // Ürün kataloğunu yükle
        if (searchContainer) searchContainer.style.display = "";
        const productList = await fetchProducts();
        renderProductList(productList, contentArea);
    } else {
        // Oturum yoksa Login kutusunu göster, paneli tamamen gizle
        loginContainer.style.setProperty("display", "block", "important");
        dashboardContainer.style.setProperty("display", "none", "important");
        mainContent.style.setProperty("display", "none", "important");
    }
}

// Çıkış Yap Butonu
if (btnLogout) {
    btnLogout.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (confirm("Oturumu kapatmak istediğinize emin misiniz?")) {
            logout();
            if (formLogin) {
                formLogin.reset();
            }
            checkAuth();
        }
    });
}

// Giriş Formu
formLogin.addEventListener("submit", async (e) => {
    e.preventDefault(); //postu kesiyorum

    const usernameInput = document.querySelector("#loginUsername");
    const passwordInput = document.querySelector("#loginPassword");
    const submitBtn = formLogin.querySelector("button[type='submit']");

    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();

    submitBtn.disabled = true;
    submitBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin mr-2"></i> Giriş Yapılıyor...`;

    const res = await login(username, password);

    submitBtn.disabled = false;
    submitBtn.innerHTML = `<i class="fa-solid fa-right-to-bracket mr-2"></i> Giriş Yap`;

    if (res.success) {
        if (res.user && res.user.role && res.user.role.toUpperCase() === "ADMIN") {
            window.location.href = "admin.html";
        } else {
            checkAuth();
        }
    } else {
        alert(res.message);
    }
});

if (btnForgotPassword) {
    btnForgotPassword.addEventListener("click", async () => {
        const usernameInput = document.querySelector("#loginUsername");
        const username = prompt("Kullanıcı adınızı giriniz:", usernameInput.value.trim());

        if (username === null) return;
        if (!username.trim()) {
            alert("Kullanıcı adı boş bırakılamaz!");
            return;
        }

        const res = await requestPasswordReset(username.trim());
        if (res.success) {
            alert("Şifre yenileme talebiniz yöneticiye gönderildi.");
        } else {
            alert(res.message);
        }
    });
}

// 3. OLAY DİNLEYİCİLERİ (Event Listeners)

// Menü Butonları Tıklamaları
menuButtons.forEach(button => {
    button.addEventListener("click", handleMenuClick);
});

// Sadece Ürün Arama Kutusu (Sadece Ürünleri Filtreler)
if (searchInput) {
    searchInput.addEventListener("input", (e) => {
        const filtered = filterProducts(e.target.value);
        renderProductList(filtered, contentArea);
    });
}

// Yenile Butonu
if (btnRefresh) {
    btnRefresh.addEventListener("click", async () => {
        if (searchInput) searchInput.value = "";
        const refreshedProducts = await fetchProducts();
        renderProductList(refreshedProducts, contentArea);
    });
}

// Sepeti açma butonu
btnOpenCart.addEventListener("click", async () => {
    const user = getCurrentUser();
    const loyaltyData = user ? await getLoyaltyData(user.userId || user.id) : null;
    cartDiscountRate = Number(loyaltyData?.discountRate || 0);
    renderCartModal();
});

// Sepetten ürün silme butonu
if (cartList) {
    cartList.addEventListener("click", (e) => {
        const removeBtn = e.target.closest(".btn-remove-cart-item");
        if (removeBtn) {
            const productId = parseInt(removeBtn.dataset.id);
            removeFromCart(productId); // Servis veriyi siler
            renderCartModal(); // View ekranı yeniler
        }
    });
}

// Sipariş Ver Butonu
btnOrder.addEventListener("click", async () => {
    btnOrder.disabled = true;
    btnOrder.innerHTML = `<i class="fa-solid fa-spinner fa-spin mr-2"></i> İşleniyor...`;

    const result = await completeOrder();

    btnOrder.disabled = false;
    btnOrder.innerHTML = `Siparişi Onayla`;

    if (!result.success) {
        alert(result.message);
        return;
    }

    alert(result.message);
    cartBadge.innerText = 0;
    $("#cartModal").modal("hide");

    const refreshedProducts = await fetchProducts();
    renderProductList(refreshedProducts, contentArea);
});

// Dinamik İçerik Tıklamaları (Sepet & Talimatlar)
contentArea.addEventListener("click", async (e) => {
    const addBtn = e.target.closest(".btn-add-cart");
    if (addBtn) {
        const productId = parseInt(addBtn.dataset.id);
        const qtyInput = document.querySelector(`#adet-kutusu-${productId}`);
        const quantity = qtyInput ? parseInt(qtyInput.value) : 1;

        const result = addToCart(productId, quantity);

        if (!result.success) {
            alert(result.message);
            return;
        }

        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartBadge.innerText = totalItems;
        if (qtyInput) qtyInput.value = 1;
        alert(result.message);
        return;
    }
    const cancelBtn = e.target.closest(".btn-cancel-recurring");
    if (cancelBtn) {
        if (!confirm("Bu otomatik sipariş talimatını iptal etmek istediğinize emin misiniz?")) return;

        const orderId = cancelBtn.dataset.id;
        cancelBtn.disabled = true;

        await cancelRecurringOrder(orderId);

        const recurringList = await getRecurringOrders();
        const productList = await fetchProducts();
        renderRecurringOrders(recurringList, productList, contentArea);
        return;
    }

    const cancelOrderBtn = e.target.closest(".btn-cancel-order");
    if (cancelOrderBtn) {
        if (!confirm("Bu siparişi iptal etmek istediğinize emin misiniz?")) return;
        cancelOrderBtn.disabled = true;
        await cancelOrder(cancelOrderBtn.dataset.id);
        const orderList = await getOrders();
        renderOrderHistory(orderList, contentArea);
        return;
    }
    // İrsaliye / Fatura PDF İndirme Butonu
    const invoiceBtn = e.target.closest(".btn-download-invoice");
    if (invoiceBtn) {
        const orderId = invoiceBtn.dataset.id;
        const orderNo = invoiceBtn.dataset.no || `#${orderId}`;
        const orderStatus = invoiceBtn.dataset.status || "Belirsiz"; // Dinamik durum bilgisi çekildi
        const user = getCurrentUser();
        const dealerTitle = user ? (user.companyName || user.dealerName || "Bayi") : "Bayi";

        // jsPDF nesnesi oluştur
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        // PDF İçeriği
        doc.setFontSize(18);
        doc.text("UGUR GIYIM SAN. TIC. LTD. STI.", 14, 22);

        doc.setFontSize(12);
        doc.text("SEVK IRSALIYESI / SIPARIS BELGESI", 14, 30);
        doc.line(14, 33, 196, 33);

        doc.setFontSize(10);
        doc.text(`Irsaliye / Siparis No: ${orderNo}`, 14, 42);
        doc.text(`Tarih: ${new Date().toLocaleDateString("tr-TR")}`, 14, 48);
        doc.text(`Alici Firma: ${dealerTitle}`, 14, 54);
        
        // Dinamik sipariş durumu yazdırılıyor:
        doc.text(`Sevkiyat Durumu: ${orderStatus}`, 14, 60);

        doc.line(14, 65, 196, 65);
        doc.text("Bu belge 213 sayili VUK hukumlerine gore resmi sevk irsaliyesi yerine gecer.", 14, 75);
        doc.text("Teslim Eden: Ugur Giyim Depo", 14, 95);
        doc.text("Teslim Alan (Kase / Imza):", 130, 95);

        // PDF'i indir
        doc.save(`Irsaliye_Siparis_${orderNo}.pdf`);
        return;
    }

});

// 4. YARDIMCI FONKSİYONLAR

async function handleMenuClick(e) {
    const clickedButton = e.currentTarget;
    menuButtons.forEach(btn => btn.classList.remove("active"));
    clickedButton.classList.add("active");

    const buttonText = clickedButton.innerText.trim();
    sectionTitle.innerText = buttonText;

    const subTitle = document.querySelector(".main-content small.text-muted");

    // Sadece Ürün Kataloğu'nda Arama Çubuğunu Göster, Diğerlerinde Gizle
    if (clickedButton.id === "menu-products") {
        if (searchContainer) searchContainer.style.display = "";
        if (btnRefresh) btnRefresh.style.display = "";
        if (searchInput) searchInput.value = "";
        if (subTitle) subTitle.innerText = "Toptan ürün listesi ve stok durumu";
        const productList = await fetchProducts();
        renderProductList(productList, contentArea);
    } else {
        if (searchContainer) searchContainer.style.display = "none";
        if (btnRefresh) btnRefresh.style.display = "none";

        if (clickedButton.id === "menu-orders") {
            if (subTitle) subTitle.innerText = "Geçmiş siparişleriniz ve durumları";
            const orderList = await getOrders();
            renderOrderHistory(orderList, contentArea);
        } else if (clickedButton.id === "menu-recurring") {
            if (subTitle) subTitle.innerText = "Periyodik otomatik sipariş şablonlarınız";
            const recurringList = await getRecurringOrders();
            const productList = await fetchProducts();
            renderRecurringOrders(recurringList, productList, contentArea);
        } else if (clickedButton.id === "menu-balance") {
            if (subTitle) subTitle.innerText = "Cari hesap ekstresi, limit ve bakiye detayları";
            const summary = await getBalanceSummary();
            const transactions = await getTransactions();
            renderBalanceView(summary, transactions, contentArea);
        } else if (clickedButton.id === "menu-loyalty") {
            if (subTitle) subTitle.innerText = "Bayi seviyeniz, iskonto oranları ve biriken puanlarınız";
            const user = getCurrentUser();
            const userId = user ? (user.userId || user.id) : 2;
            const loyaltyData = await getLoyaltyData(userId);
            renderLoyalty(loyaltyData, contentArea);
        } else if (clickedButton.id === "menu-settings") {
            if (subTitle) subTitle.innerText = "Firma bilgileri, sevkiyat adresleri ve hesap güvenliği";
            const user = getCurrentUser();
            const userId = user ? (user.userId || user.id) : 2;
            const profileData = await getProfileData(userId);
            renderSettingsView(profileData || user, contentArea);
        } else if (clickedButton.id === "menu-logout") {
            return;
        } else {
            if (subTitle) subTitle.innerText = "";
            contentArea.innerHTML = `<h3 class="p-4 text-muted">${buttonText} içeriği buraya gelecek</h3>`;
        }
    }
}


// Profil ve Şifre Formları Borç Ödeme
contentArea.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (e.target.id === "form-pay-debt") {
        const amount = Number(document.querySelector("#paymentAmount").value);
        if (!amount || amount <= 0) {
            alert("Lütfen geçerli bir ödeme tutarı giriniz!");
            return;
        }

        const submitBtn = e.target.querySelector("button[type='submit']");
        submitBtn.disabled = true;
        submitBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin mr-1"></i> Ödeniyor...`;

        const res = await payDebt(amount);
        if (!res.success) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = `<i class="fa-solid fa-credit-card mr-1"></i> Borcu Öde`;
            alert(res.message);
            return;
        }

        alert("Ödeme başarıyla alındı. Güncel borcunuz: " + Number(res.data.currentBalance || 0).toFixed(2) + " ₺");
        const [summary, transactions] = await Promise.all([
            getBalanceSummary(),
            getTransactions()
        ]);
        renderBalanceView(summary, transactions, contentArea);
        return;
    }

    //otomatik sipariş formu
    if (e.target.id === "form-recurring-order") {
        const user = getCurrentUser();
        const userId = user ? (user.userId || user.id) : null;

        const productId = parseInt(document.querySelector("#recurringProductId").value);
        const quantity = parseInt(document.querySelector("#recurringQuantity").value);
        if (!productId || !quantity || quantity <= 0) {
            alert("Lütfen geçerli bir ürün ve miktar seçiniz!");
            return;
        }

        const payload = {
            userId: userId,
            productId: productId,
            quantity: quantity
        };

        const submitBtn = e.target.querySelector("button[type='submit']");
        submitBtn.disabled = true;
        submitBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin mr-1"></i> Kaydediliyor...`;

        const res = await saveRecurringOrder(payload);

        submitBtn.disabled = false;
        submitBtn.innerHTML = `<i class="fa-solid fa-floppy-disk mr-1"></i> Talimatı Kaydet`;

        if (res && (res.id || res.success)) {
            alert("Otomatik sipariş talimatı başarıyla oluşturuldu!");
            const recurringList = await getRecurringOrders();
            const productList = await fetchProducts();
            renderRecurringOrders(recurringList, productList, contentArea);
        } else {
            alert(res.message || "Talimat kaydedilirken bir hata oluştu!");
        }
    }


     // BİLGİLERİ GÜNCELLE
    if (e.target.id === "form-profile") {
        const user = getCurrentUser();
        const userId = user ? (user.userId || user.id) : 2;

        const payload = {
            companyName: document.querySelector("#companyName").value,
            taxOffice: document.querySelector("#taxOffice").value,
            email: document.querySelector("#email").value,
            phone: document.querySelector("#phone").value,
            address: document.querySelector("#address").value,
            role: user.role || "BAYI",
            username: user.username || ""
        };

        const res = await updateProfileData(userId, payload);
        alert(res.message);

        if (res.success && userDisplay) {
            userDisplay.innerText = payload.companyName;
        }
    }
    if (e.target.id === "form-password") {
        const user = getCurrentUser();
        const userId = user ? (user.userId || user.id) : 2;
        const oldPassword = document.querySelector("#oldPassword").value;
        const newPassword = document.querySelector("#newPassword").value;
        const newPasswordConfirm = document.querySelector("#newPasswordConfirm").value;

        if (newPassword !== newPasswordConfirm) {
            alert("Yeni şifreler birbiriyle eşleşmiyor!");
            return;
        }

        const res = await updatePasswordData(userId, oldPassword, newPassword);
        alert(res.message);
        if (res.success) {
            e.target.reset(); // Formu temizle
        }
    }
});

// 5. BAŞLAT

checkAuth();
