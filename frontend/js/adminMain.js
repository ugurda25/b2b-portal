// js/adminMain.js
import { api } from "./services/api.js";
import { getCurrentUser, logout } from "./services/authService.js";
import { renderAdminDashboard } from "./views/adminDashboardView.js";
import { getAllOrdersAdmin, updateOrderStatusAdmin } from "./services/adminOrderService.js";
import { renderAdminOrderList, renderOrderTableRows } from "./views/adminOrderView.js";
import { getAllDealersAdmin, updateDealerAdmin, toggleDealerStatusAdmin, saveDealer } from "./services/adminDealerService.js";
import { renderAdminDealerList, renderDealerTableRows } from "./views/adminDealerView.js";
import { getAllRecurringOrdersAdmin, toggleRecurringOrderStatusAdmin } from "./services/adminRecurringService.js";
import { renderAdminRecurringList, renderRecurringTableRows } from "./views/adminRecurringView.js";
import {
    getAllProductsAdmin,
    addProductStock,
    toggleProductStatus,
    saveProduct,
    updateProduct
} from "./services/adminProductService.js";
import {
    renderAdminProductList,
    renderProductTableRows
} from "./views/adminProductView.js";

// 1. GÜVENLİK KONTROLÜ: Admin olmayan login ekranına yönlendirilir
const currentUser = getCurrentUser();
if (!currentUser || !currentUser.role || currentUser.role.toUpperCase() !== "ADMIN") {
    alert("Bu alana erişim yetkiniz bulunmuyor! Lütfen yönetici hesabıyla giriş yapın.");
    logout();
    window.location.href = "index.html";
}

let allAdminProducts = []; // Ürün arama ve filtreleme için bellekteki liste
let currentView = "DASHBOARD"; // DASHBOARD | PRODUCTS | ORDERS | DEALERS | RECURRING

// Fotoğrafı alıp Base64 metne çeviren global yardımcı fonksiyon
function getBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

document.addEventListener("DOMContentLoaded", () => {
    // Sol paneldeki kullanıcı adı
    const userDisplay = document.querySelector("#user-display");
    if (userDisplay && currentUser) {
        userDisplay.innerText = currentUser.companyName || currentUser.username || "Yönetici";
    }

    const contentArea = document.querySelector("#content-area");
    const sectionTitle = document.querySelector("#section-title");
    const sectionSubtitle = document.querySelector("#section-subtitle");
    const menuButtons = document.querySelectorAll("#admin-menu button");
    const btnRefresh = document.querySelector("#btnRefresh");
    const btnLogout = document.querySelector("#menu-logout");

    // Sayfa açılınca ilk Dashboard'u yükle
    loadDashboard();

    // Menü Butonları Tıklamaları
    menuButtons.forEach(button => {
        button.addEventListener("click", handleMenuClick);
    });

    async function handleMenuClick(e) {
        const clickedButton = e.currentTarget;
        if (clickedButton.id === "menu-logout") return;

        menuButtons.forEach(btn => btn.classList.remove("active"));
        clickedButton.classList.add("active");

        if (clickedButton.id === "menu-admin-dashboard") {
            currentView = "DASHBOARD";
            sectionTitle.innerHTML = `<i class="fa-solid fa-chart-pie mr-2 text-warning"></i> Genel Bakış & Metrikler`;
            sectionSubtitle.innerText = "Sistem genel durumu, satış istatistikleri ve kritik stoklar";
            loadDashboard();
        } else if (clickedButton.id === "menu-admin-products") {
            currentView = "PRODUCTS";
            sectionTitle.innerHTML = `<i class="fa-solid fa-boxes-stacked mr-2 text-warning"></i> Ürün & Stok Yönetimi`;
            sectionSubtitle.innerText = "Katalog yönetimi, hızlı stok girişi ve ürün durumu";
            loadProductsView();
        } else if (clickedButton.id === "menu-admin-orders") {
            currentView = "ORDERS";
            sectionTitle.innerHTML = `<i class="fa-solid fa-truck-ramp-box mr-2 text-warning"></i> Sipariş & Sevkiyat Yönetimi`;
            sectionSubtitle.innerText = "Tüm bayi siparişlerinin onayı, durum takibi ve sevk işlemleri";
            loadOrdersView(); 
        } else if (clickedButton.id === "menu-admin-dealers") {
            currentView = "DEALERS";
            sectionTitle.innerHTML = `<i class="fa-solid fa-users-gear mr-2 text-warning"></i> Bayi & Cari Yönetimi`;
            sectionSubtitle.innerText = "Bayi hesap durumları, kredi limitleri ve bakiye takibi";
            loadDealersView();
        } else if (clickedButton.id === "menu-admin-recurring") {
            currentView = "RECURRING";
            sectionTitle.innerHTML = `<i class="fa-solid fa-arrows-rotate mr-2 text-warning"></i> Otomatik Sipariş Talimatları`;
            sectionSubtitle.innerText = "Bayilerin kayıtlı periyodik siparişleri ve robot tetikleme";
            loadRecurringView();
        }
    }

    // Yenile Butonu (Hangi ekrandaysak orayı yeniden çeker)
    if (btnRefresh) {
        btnRefresh.addEventListener("click", () => {
            if (currentView === "DASHBOARD") loadDashboard();
            else if (currentView === "PRODUCTS") loadProductsView();
            else if (currentView === "ORDERS") loadOrdersView();
            else if (currentView === "DEALERS") loadDealersView();
            else if (currentView === "RECURRING") loadRecurringView();
        });
    }

    // Çıkış Yap Butonu
    if (btnLogout) {
        btnLogout.addEventListener("click", (e) => {
            e.preventDefault();
            if (confirm("Yönetici oturumunu kapatmak istediğinize emin misiniz?")) {
                logout();
                window.location.href = "index.html";
            }
        });
    }

    // 1. DASHBOARD YÜKLE
    async function loadDashboard() {
        contentArea.innerHTML = `
            <div class="col-12 text-center py-5">
                <div class="spinner-border text-primary" role="status"></div>
                <p class="mt-2 text-muted">Dashboard verileri veritabanından alınıyor...</p>
            </div>
        `;

        const res = await api.get("/admin/dashboard/summary");
        if (res.success) {
            renderAdminDashboard(res.data, contentArea);
        } else {
            renderAdminDashboard(null, contentArea);
        }
    }

    // 2. ÜRÜN & STOK EKRANINI YÜKLE
    async function loadProductsView() {
        contentArea.innerHTML = `
            <div class="col-12 text-center py-5">
                <div class="spinner-border text-primary" role="status"></div>
                <p class="mt-2 text-muted">Ürün kataloğu yükleniyor...</p>
            </div>
        `;

        allAdminProducts = await getAllProductsAdmin();
        renderAdminProductList(allAdminProducts, contentArea);
        setupProductEventListeners();
    }

    // 3. ÜRÜN EKRANI İŞLEMLERİ (Arama, Filtre, Modallar, CRUD)
    function setupProductEventListeners() {
        const searchInput = document.querySelector("#admin-product-search");
        const statusFilter = document.querySelector("#admin-status-filter");

        function applyFilters() {
            const query = (searchInput.value || "").toLowerCase().trim();
            const filterVal = statusFilter.value;

            const filtered = allAdminProducts.filter(p => {
                const matchesText = (p.name && p.name.toLowerCase().includes(query)) ||
                    (p.barcode && p.barcode.toLowerCase().includes(query));

                let matchesStatus = true;
                if (filterVal === "ACTIVE") matchesStatus = (p.isActive !== false);
                else if (filterVal === "PASSIVE") matchesStatus = (p.isActive === false);
                else if (filterVal === "CRITICAL") matchesStatus = ((p.availableStock || 0) < 30);

                return matchesText && matchesStatus;
            });

            renderProductTableRows(filtered);
        }

        if (searchInput) searchInput.addEventListener("input", applyFilters);
        if (statusFilter) statusFilter.addEventListener("change", applyFilters);

        // Dinamik Buton Tıklamaları (Event Delegation)
        contentArea.addEventListener("click", async (e) => {
            // A) Hızlı Stok Ekle Butonu (+)
            const btnStock = e.target.closest(".btn-add-stock");
            if (btnStock) {
                const id = btnStock.dataset.id;
                const name = btnStock.dataset.name; 
                document.querySelector("#modal-stock-product-id").value = id;
                document.querySelector("#modal-stock-product-name").innerText = name;
                document.querySelector("#modal-stock-quantity").value = 50;
                window.$("#modalAddStock").modal("show");
                return;
            }

            // B) Aktif / Pasif Toggle Butonu
            const btnToggle = e.target.closest(".btn-toggle-status");
            if (btnToggle) {
                const id = btnToggle.dataset.id;
                const res = await toggleProductStatus(id);
                if (res.success) {
                    loadProductsView();
                } else {
                    alert("Durum güncellenemedi: " + res.message);
                }
                return;
            }

            // C) Ürün Düzenle Butonu (Kalem)
            const btnEdit = e.target.closest(".btn-edit-product");

            if (btnEdit) {
                const p = JSON.parse(btnEdit.dataset.product);

                document.querySelector("#modal-product-title").innerHTML = `<i class="fa-solid fa-pen text-warning mr-2"></i>Ürünü Düzenle`;
                document.querySelector("#form-product-id").value = p.id;
                document.querySelector("#form-product-name").value = p.name;
                document.querySelector("#form-product-barcode").value = p.barcode;
                document.querySelector("#form-product-stock").value = p.availableStock || 0;
                document.querySelector("#form-product-cost").value = p.costPrice || 0;
                document.querySelector("#form-product-wholesale").value = p.wholeSalePrice || 0;
                document.querySelector("#form-product-min-order").value = p.minOrderQuantity || 1;
                document.querySelector("#form-product-isactive").value = (p.isActive !== false) ? "true" : "false";

                const imgPreview = document.querySelector("#form-product-image-preview");
                const existingImageInput = document.querySelector("#form-product-existing-image");

                existingImageInput.value = p.imageBase64 || "";

                if (p.imageBase64) {
                    imgPreview.src = p.imageBase64;
                    imgPreview.style.display = "block";
                } else {
                    imgPreview.style.display = "none";
                }

                // Modal açılmadan hemen önce dosya seçiciyi sıfırla
                const fileInput = document.querySelector("#form-product-image");
                if (fileInput) fileInput.value = "";

                window.$("#modalProductForm").modal("show");
                return;
            }

            // D) Yeni Ürün Ekle Butonu
            const btnNew = e.target.closest("#btn-open-new-product");
            if (btnNew) {
                document.querySelector("#modal-product-title").innerHTML = `<i class="fa-solid fa-plus text-success mr-2"></i>Yeni Ürün Ekle`;
                document.querySelector("#form-product-save").reset();
                document.querySelector("#form-product-id").value = "";
                
                // Form sıfırlandığında resim önizlemesini ve gizli inputu da temizleyelim
                const existingImageInput = document.querySelector("#form-product-existing-image");
                const imgPreview = document.querySelector("#form-product-image-preview");
                if(existingImageInput) existingImageInput.value = "";
                if(imgPreview) {
                    imgPreview.src = "";
                    imgPreview.style.display = "none";
                }

                // Modal açılmadan hemen önce dosya seçiciyi sıfırla
                const fileInput = document.querySelector("#form-product-image");
                if (fileInput) fileInput.value = "";

                window.$("#modalProductForm").modal("show");
                return;
            }
        });

        // Hızlı Stok Ekle Onay Butonu
        const btnConfirmStock = document.querySelector("#btn-confirm-add-stock");
        if (btnConfirmStock) {
            btnConfirmStock.addEventListener("click", async () => {
                const id = document.querySelector("#modal-stock-product-id").value;
                const qty = parseInt(document.querySelector("#modal-stock-quantity").value);

                if (!qty || qty <= 0) {
                    alert("Lütfen 0'dan büyük geçerli bir adet giriniz!");
                    return;
                }

                const res = await addProductStock(id, qty);
                window.$("#modalAddStock").modal("hide");

                if (res.success) {
                    loadProductsView();
                } else {
                    alert("Stok eklenemedi: " + res.message);
                }
            });
        }

        // Ürün Formu Kaydet / Güncelle Submit 
        const formProduct = document.querySelector("#form-product-save");
        if (formProduct) {
            formProduct.addEventListener("submit", async (e) => {
                e.preventDefault();

                const id = document.querySelector("#form-product-id").value;
                
                // --- RESİM İŞLEMLERİ ---
                const fileInput = document.querySelector("#form-product-image");
                const existingImageInput = document.querySelector("#form-product-existing-image");
                
                let resimMetni = existingImageInput ? existingImageInput.value : null; 

                // Yeni dosya seçildiyse çevir
                if (fileInput && fileInput.files.length > 0) {
                    resimMetni = await getBase64(fileInput.files[0]);
                }
                
                const payload = {
                    name: document.querySelector("#form-product-name").value.trim(),
                    barcode: document.querySelector("#form-product-barcode").value.trim(),
                    availableStock: parseInt(document.querySelector("#form-product-stock").value),
                    costPrice: parseFloat(document.querySelector("#form-product-cost").value),
                    wholeSalePrice: parseFloat(document.querySelector("#form-product-wholesale").value),
                    minOrderQuantity: parseInt(document.querySelector("#form-product-min-order").value),
                    currency: "TRY", 
                    isActive: document.querySelector("#form-product-isactive").value === "true",
                    imageBase64: resimMetni // Resmi pakete ekliyoruz!
                };

                let res;
                if (id) {
                    res = await updateProduct(id, payload);
                } else {
                    res = await saveProduct(payload);
                }

                window.$("#modalProductForm").modal("hide");

                if (res.success) {
                    loadProductsView();
                } else {
                    alert("İşlem başarısız: " + res.message);
                }
            });
        }
    }
    
    let allAdminOrders = [];
    let orderEventController = null;

    async function loadOrdersView() {
        contentArea.innerHTML = `
            <div class="col-12 text-center py-5">
                <div class="spinner-border text-primary" role="status"></div>
                <p class="mt-2 text-muted">Sipariş listesi yükleniyor...</p>
            </div>
        `;
        allAdminOrders = await getAllOrdersAdmin();
        renderAdminOrderList(allAdminOrders, contentArea);
        setupOrderEventListeners();
    }

    function setupOrderEventListeners() {
        if (orderEventController) orderEventController.abort();
        orderEventController = new AbortController();
        const { signal } = orderEventController;

        const searchInput = document.querySelector("#admin-order-search");
        const statusFilter = document.querySelector("#admin-order-status-filter");

        function applyOrderFilters() {
            const query = (searchInput.value || "").toLowerCase().trim();
            const filterVal = statusFilter.value;

            const filtered = allAdminOrders.filter(o => {
                const orderNum = (o.orderNumber || "").toLowerCase();
                const dealerName = (o.user ? (o.user.companyName || o.user.username || "") : "").toLowerCase();
                const matchesText = orderNum.includes(query) || dealerName.includes(query);
                const matchesStatus = (filterVal === "ALL") || ((o.status || "PENDING") === filterVal);

                return matchesText && matchesStatus;
            });
            renderOrderTableRows(filtered);
        }

        if (searchInput) searchInput.addEventListener("input", applyOrderFilters, { signal });
        if (statusFilter) statusFilter.addEventListener("change", applyOrderFilters, { signal });

        applyOrderFilters(); // İlk açılışta PENDING olanları getir

        contentArea.addEventListener("click", async (e) => {
            // Durum Güncelleme Butonları
            const btnStatus = e.target.closest(".btn-update-order-status");
            if (btnStatus) {
                const orderId = btnStatus.dataset.id;
                const newStatus = btnStatus.dataset.status;

                if (newStatus === "CANCELED" && !confirm("Siparişi iptal etmek istediğinize emin misiniz? (Stoklar ve bakiye iade edilecek)")) return;

                btnStatus.disabled = true;
                const res = await updateOrderStatusAdmin(orderId, newStatus);
                if (res.success) {
                    const orderIndex = allAdminOrders.findIndex(order => Number(order.id) === Number(orderId));
                    if (orderIndex !== -1) {
                        allAdminOrders[orderIndex] = res.data;
                    }
                    applyOrderFilters();
                } else {
                    btnStatus.disabled = false;
                    alert("Durum güncellenemedi: " + res.message);
                }
                return;
            }

            // Sipariş Detayı Modalı Açma
            const btnDetail = e.target.closest(".btn-view-order-detail");
            if (btnDetail) {
                const order = JSON.parse(btnDetail.dataset.order);
                document.querySelector("#modal-order-title").innerHTML = `<i class="fa-solid fa-receipt text-warning mr-2"></i>Sipariş Detayı: <code>${order.orderNumber || '#' + order.id}</code>`;
                document.querySelector("#modal-order-dealer").innerText = order.user ? (order.user.companyName || order.user.username) : "Bayi";
                document.querySelector("#modal-order-date").innerText = order.orderDate ? new Date(order.orderDate).toLocaleString("tr-TR") : "-";
                document.querySelector("#modal-order-status").innerText = order.status || "PENDING";
                document.querySelector("#modal-order-grand-total").innerText = Number(order.totalAmount || 0).toLocaleString("tr-TR", { minimumFractionDigits: 2 }) + " ₺";

                const itemsTbody = document.querySelector("#modal-order-items-tbody");
                const details = order.orderDetails || [];
                if (details.length === 0) {
                    itemsTbody.innerHTML = `<tr><td colspan="5" class="text-center text-muted">Ürün kalemi bulunamadı.</td></tr>`;
                } else {
                    itemsTbody.innerHTML = details.map(d => {
                        const pName = d.product ? d.product.name : "Ürün";
                        const pBarcode = d.product ? (d.product.barcode || "-") : "-";
                        const qty = d.quantity || 0;
                        const uPrice = d.unitPrice || 0;
                        return `
                            <tr>
                                <td><strong>${pName}</strong></td>
                                <td><code>${pBarcode}</code></td>
                                <td class="text-center">${qty}</td>
                                <td class="text-right">${Number(uPrice).toLocaleString("tr-TR", { minimumFractionDigits: 2 })} ₺</td>
                                <td class="text-right font-weight-bold">${Number(qty * uPrice).toLocaleString("tr-TR", { minimumFractionDigits: 2 })} ₺</td>
                            </tr>
                        `;
                    }).join('');
                }
                window.$("#modalAdminOrderDetail").modal("show");
                return;
            }
        }, { signal });
    }

    // 4. BAYİ & CARİ YÖNETİMİ
    let allAdminDealers = [];

    async function loadDealersView() {
        contentArea.innerHTML = `
        <div class="col-12 text-center py-5">
            <div class="spinner-border text-primary" role="status"></div>
            <p class="mt-2 text-muted">Bayi listesi yükleniyor...</p>
        </div>
    `;
        allAdminDealers = await getAllDealersAdmin();
        renderAdminDealerList(allAdminDealers, contentArea);
        setupDealerEventListeners();
    }

    function setupDealerEventListeners() {
        const searchInput = document.querySelector("#admin-dealer-search");
        const statusFilter = document.querySelector("#admin-dealer-status-filter");

        function applyDealerFilters() {
            const query = (searchInput.value || "").toLowerCase().trim();
            const filterVal = statusFilter.value;

            const filtered = allAdminDealers.filter(d => {
                const name = (d.companyName || d.username || "").toLowerCase();
                const email = (d.email || "").toLowerCase();
                const phone = (d.phone || "").toLowerCase();
                const matchesText = name.includes(query) || email.includes(query) || phone.includes(query);

                let matchesStatus = true;
                if (filterVal === "ACTIVE") matchesStatus = (d.isActive !== false);
                else if (filterVal === "PASSIVE") matchesStatus = (d.isActive === false);
                else if (filterVal === "DEBT") matchesStatus = (Number(d.currentBalance || 0) > 0);

                return matchesText && matchesStatus;
            });
            renderDealerTableRows(filtered);
        }

        if (searchInput) searchInput.addEventListener("input", applyDealerFilters);
        if (statusFilter) statusFilter.addEventListener("change", applyDealerFilters);
        applyDealerFilters(); // İlk açılışta filtreyi çalıştır

        contentArea.addEventListener("click", async (e) => {
            // A) Aktif/Pasif Butonu
            const btnToggle = e.target.closest(".btn-toggle-dealer");
            if (btnToggle) {
                const res = await toggleDealerStatusAdmin(btnToggle.dataset.id, btnToggle.dataset.status === "true");
                if (res.success) loadDealersView();
                else alert("Durum güncellenemedi: " + res.message);
                return;
            }
              //DÜZENLE BAYİ  BORÇ / KREDİ
            const btnEdit = e.target.closest(".btn-edit-dealer");
            if (btnEdit) {
                const dealer = JSON.parse(btnEdit.dataset.dealer);
                document.querySelector("#form-dealer-id").value = dealer.id;
                document.querySelector("#form-dealer-name").value = dealer.companyName || dealer.username;
                document.querySelector("#form-dealer-limit").value = dealer.creditLimit || 0;
                document.querySelector("#form-dealer-balance").value = dealer.currentBalance || 0;
                document.querySelector("#form-dealer-password").value = "";
                document.querySelector("#form-dealer-reset-alert").classList.toggle("d-none", dealer.passwordResetRequested !== true);
                window.$("#modalAdminDealerForm").modal("show");
                return;
            }
        });
        //submit düzenleme borç kredi limit
        const formDealer = document.querySelector("#form-dealer-save");
        if (formDealer) {
            formDealer.addEventListener("submit", async (e) => {
                e.preventDefault();
                const id = document.querySelector("#form-dealer-id").value;
                const newPassword = document.querySelector("#form-dealer-password").value.trim();
                const payload = {
                    creditLimit: parseFloat(document.querySelector("#form-dealer-limit").value),
                    currentBalance: parseFloat(document.querySelector("#form-dealer-balance").value)
                };

                if (newPassword) payload.password = newPassword;

                const res = await updateDealerAdmin(id, payload);
                window.$("#modalAdminDealerForm").modal("hide");

                if (res.success) {
                    if (newPassword) alert("Bayi şifresi yenilendi. Yeni şifreyi bayiye iletiniz.");
                    loadDealersView();
                }
                else alert("İşlem başarısız: " + res.message);
            });
        }

        // "Yeni Bayi Ekle" butonu → modal aç
        const btnAddDealer = document.querySelector("#btn-add-dealer");
        if (btnAddDealer) {
            btnAddDealer.addEventListener("click", () => {
                document.querySelector("#form-add-dealer").reset();
                document.querySelector("#add-dealer-limit").value = "0";
                window.$("#modalAddDealer").modal("show");
            });
        }

        // Form submit → bayi oluştur
        const formAddDealer = document.querySelector("#form-add-dealer");
        if (formAddDealer) {
            formAddDealer.addEventListener("submit", async (e) => {
                e.preventDefault();
                const payload = {
                    companyName: document.querySelector("#add-dealer-company").value.trim(),
                    username: document.querySelector("#add-dealer-username").value.trim(),
                    password: document.querySelector("#add-dealer-password").value,
                    email: document.querySelector("#add-dealer-email").value.trim(),
                    phone: document.querySelector("#add-dealer-phone").value.trim(),
                    address: document.querySelector("#add-dealer-address").value.trim(),
                    taxOffice: document.querySelector("#add-dealer-taxoffice").value.trim(),
                    creditLimit: parseFloat(document.querySelector("#add-dealer-limit").value) || 0,
                    currentBalance: 0,
                    role: "BAYI",
                    isActive: true
                };

                const submitBtn = formAddDealer.querySelector("button[type='submit']");
                submitBtn.disabled = true;
                submitBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin mr-1"></i> Oluşturuluyor...`;

                const res = await saveDealer(payload);

                submitBtn.disabled = false;
                submitBtn.innerHTML = `<i class="fa-solid fa-save mr-1"></i> Bayiyi Oluştur`;

                window.$("#modalAddDealer").modal("hide");

                if (res.success || res.id) {
                    alert("Bayi başarıyla oluşturuldu!");
                    loadDealersView();
                } else {
                    alert("Hata: " + (res.message || "Bayi oluşturulamadı."));
                }
            });
        }
    }

    // 5. OTOMATİK SİPARİŞ YÖNETİMİ
    let allRecurringOrders = [];
    let recurringEventController = null;

    async function loadRecurringView() {
        contentArea.innerHTML = `
            <div class="col-12 text-center py-5">
                <div class="spinner-border text-primary" role="status"></div>
                <p class="mt-2 text-muted">Talimatlar yükleniyor...</p>
            </div>
        `;
        allRecurringOrders = await getAllRecurringOrdersAdmin();
        renderAdminRecurringList(allRecurringOrders, contentArea);
        setupRecurringEventListeners();
    }

    function setupRecurringEventListeners() {
        if (recurringEventController) recurringEventController.abort();
        recurringEventController = new AbortController();

        contentArea.addEventListener("click", async (e) => {
            const btnToggle = e.target.closest(".btn-toggle-recurring");
            if (!btnToggle) return;

            const isActive = btnToggle.dataset.active === "true";
            const actionText = isActive ? "pasife almak" : "aktifleştirmek";
            if (!confirm(`Bu otomatik sipariş talimatını ${actionText} istediğinize emin misiniz?`)) return;

            btnToggle.disabled = true;
            const res = await toggleRecurringOrderStatusAdmin(btnToggle.dataset.id);
            if (res.success) {
                const orderIndex = allRecurringOrders.findIndex(
                    order => Number(order.id) === Number(btnToggle.dataset.id)
                );
                if (orderIndex !== -1) {
                    allRecurringOrders[orderIndex] = res.data;
                }
                renderRecurringTableRows(allRecurringOrders);
            } else {
                btnToggle.disabled = false;
                alert("Talimat durumu güncellenemedi: " + res.message);
            }
        }, { signal: recurringEventController.signal });
    }
});
