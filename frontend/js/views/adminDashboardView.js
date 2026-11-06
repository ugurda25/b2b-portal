// js/views/adminDashboardView.js

export function renderAdminDashboard(data, containerElement) {
    if (!data) {
        containerElement.innerHTML = `
            <div class="col-12 text-center py-5">
                <div class="alert alert-danger font-weight-bold">
                    <i class="fa-solid fa-triangle-exclamation mr-2"></i>Dashboard verileri sunucudan çekilemedi!
                </div>
            </div>
        `;
        return;
    }

    const totalRevenue = Number(data.totalRevenue || 0).toLocaleString("tr-TR", { minimumFractionDigits: 2 });
    const pendingOrders = data.pendingOrders || 0;
    const activeDealers = data.activeDealers || 0;
    const criticalStockCount = data.criticalStockCount || 0;

    const topProducts = data.topSellingProducts || [];
    const maxSold = topProducts.length > 0 ? topProducts[0].soldCount : 1;
    const criticalList = data.criticalStockList || [];

    containerElement.innerHTML = `
        <div class="col-12">
            <!-- 4 TEMEL KPI KARTI -->
            <div class="row mb-4">
                <div class="col-md-3 mb-3">
                    <div class="card border-0 shadow-sm text-white bg-primary p-3">
                        <div class="d-flex justify-content-between align-items-center">
                            <div>
                                <small class="text-uppercase font-weight-bold opacity-75">Toplam Ciro</small>
                                <h3 class="font-weight-bold mb-0 mt-1">${totalRevenue} ₺</h3>
                            </div>
                            <i class="fa-solid fa-wallet fa-2x opacity-75"></i>
                        </div>
                    </div>
                </div>

                <div class="col-md-3 mb-3">
                    <div class="card border-0 shadow-sm text-white bg-warning p-3">
                        <div class="d-flex justify-content-between align-items-center">
                            <div>
                                <small class="text-uppercase font-weight-bold text-dark opacity-75">Bekleyen Sipariş</small>
                                <h3 class="font-weight-bold text-dark mb-0 mt-1">${pendingOrders} Adet</h3>
                            </div>
                            <i class="fa-solid fa-clock-rotate-left fa-2x text-dark opacity-75"></i>
                        </div>
                    </div>
                </div>

                <div class="col-md-3 mb-3">
                    <div class="card border-0 shadow-sm text-white bg-success p-3">
                        <div class="d-flex justify-content-between align-items-center">
                            <div>
                                <small class="text-uppercase font-weight-bold opacity-75">Aktif Bayi</small>
                                <h3 class="font-weight-bold mb-0 mt-1">${activeDealers} Firma</h3>
                            </div>
                            <i class="fa-solid fa-users fa-2x opacity-75"></i>
                        </div>
                    </div>
                </div>

                <div class="col-md-3 mb-3">
                    <div class="card border-0 shadow-sm text-white bg-danger p-3">
                        <div class="d-flex justify-content-between align-items-center">
                            <div>
                                <small class="text-uppercase font-weight-bold opacity-75">Kritik Stok Uyarısı</small>
                                <h3 class="font-weight-bold mb-0 mt-1">${criticalStockCount} Ürün</h3>
                            </div>
                            <i class="fa-solid fa-triangle-exclamation fa-2x opacity-75"></i>
                        </div>
                    </div>
                </div>
            </div>

            <!-- EN ÇOK SATANLAR & KRİTİK STOK LİSTESİ -->
            <div class="row">
                <!-- Sol: En Çok Satanlar -->
                <div class="col-lg-7 mb-4">
                    <div class="card border-0 shadow-sm h-100">
                        <div class="card-header bg-white font-weight-bold py-3 border-bottom d-flex justify-content-between align-items-center">
                            <span><i class="fa-solid fa-fire text-danger mr-2"></i>En Çok Satan Ürünler (Top 10)</span>
                            <span class="badge badge-light">Satış Adetlerine Göre</span>
                        </div>
                        <div class="card-body p-3">
                            ${topProducts.length === 0 ? '<div class="text-muted text-center py-4">Henüz satış verisi yok.</div>' : ''}
                            ${topProducts.map(p => {
                                const percentage = Math.round((p.soldCount / maxSold) * 100);
                                return `
                                    <div class="mb-3">
                                        <div class="d-flex justify-content-between small font-weight-bold mb-1">
                                            <span>${p.name}</span>
                                            <span class="text-muted">${p.soldCount} Adet (${Number(p.revenue).toLocaleString('tr-TR')} ₺)</span>
                                        </div>
                                        <div class="progress" style="height: 10px; border-radius: 5px;">
                                            <div class="progress-bar bg-primary" role="progressbar" style="width: ${percentage}%"></div>
                                        </div>
                                    </div>
                                `;
                            }).join('')}
                        </div>
                    </div>
                </div>

                <!-- Sağ: Kritik Stoklar -->
                <div class="col-lg-5 mb-4">
                    <div class="card border-0 shadow-sm h-100">
                        <div class="card-header bg-white font-weight-bold py-3 border-bottom d-flex justify-content-between align-items-center">
                            <span><i class="fa-solid fa-bell text-warning mr-2"></i>Kritik Stok Takibi (&lt; 30)</span>
                            <span class="badge badge-danger">En Az Kalanlar</span>
                        </div>
                        <div class="table-responsive">
                            <table class="table table-hover mb-0">
                                <thead class="thead-light small">
                                    <tr>
                                        <th>Ürün Adı</th>
                                        <th>Barkod</th>
                                        <th class="text-center">Kalan</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${criticalList.map(item => `
                                        <tr>
                                            <td class="font-weight-bold small text-truncate" style="max-width: 170px;" title="${item.name}">${item.name}</td>
                                            <td><code class="text-muted small">${item.barcode}</code></td>
                                            <td class="text-center">
                                                <span class="badge ${item.stock === 0 ? 'badge-dark' : 'badge-danger'} px-2 py-1">${item.stock} adet</span>
                                            </td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}