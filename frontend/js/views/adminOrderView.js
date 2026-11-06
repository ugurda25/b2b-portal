// js/views/adminOrderView.js

export function renderAdminOrderList(orders, containerElement) {
    containerElement.innerHTML = `
        <div class="col-12">
            <!-- ÜST ARAÇ ÇUBUĞU -->
            <div class="card border-0 shadow-sm mb-4">
                <div class="card-body p-3">
                    <div class="row align-items-center">
                        <div class="col-md-6 mb-2 mb-md-0">
                            <div class="input-group">
                                <div class="input-group-prepend">
                                    <span class="input-group-text bg-white border-right-0">
                                        <i class="fa-solid fa-magnifying-glass text-muted"></i>
                                    </span>
                                </div>
                                <input type="text" id="admin-order-search" class="form-control border-left-0" placeholder="Sipariş no veya bayi adı ile ara...">
                            </div>
                        </div>
                        <div class="col-md-6">
                            <select id="admin-order-status-filter" class="custom-select">
                                <option value="ALL">Tüm Siparişler</option>
                                <option value="PENDING" selected>Bekleyenler (PENDING)</option>
                                <option value="APPROVED">Onaylananlar (APPROVED)</option>
                                <option value="SHIPPED">Kargoda / Sevk Edildi (SHIPPED)</option>
                                <option value="DELIVERED">Teslim Edildi (DELIVERED)</option>
                                <option value="CANCELED">İptal Edilenler (CANCELED)</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            <!-- SİPARİŞ TABLOSU -->
            <div class="card border-0 shadow-sm">
                <div class="table-responsive">
                    <table class="table table-hover align-middle mb-0">
                        <thead class="thead-dark small">
                            <tr>
                                <th>Sipariş No</th>
                                <th>Bayi / Ünvan</th>
                                <th>Tarih</th>
                                <th class="text-right">Toplam Tutar</th>
                                <th class="text-center">Kalem</th>
                                <th class="text-center">Durum</th>
                                <th class="text-center" style="width: 250px;">İşlemler</th>
                            </tr>
                        </thead>
                        <tbody id="admin-orders-tbody">
                            <!-- Satırlar dinamik gelecek -->
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <!-- SİPARİŞ DETAY MODALI -->
        <div class="modal fade" id="modalAdminOrderDetail" tabindex="-1" role="dialog" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
                <div class="modal-content">
                    <div class="modal-header bg-dark text-white py-2">
                        <h6 class="modal-title font-weight-bold" id="modal-order-title">Sipariş Detayı</h6>
                        <button type="button" class="close text-white" data-dismiss="modal" aria-label="Kapat">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body p-3">
                        <div class="d-flex justify-content-between border-bottom pb-2 mb-3 small">
                            <div><strong>Bayi:</strong> <span id="modal-order-dealer">-</span></div>
                            <div><strong>Tarih:</strong> <span id="modal-order-date">-</span></div>
                            <div><strong>Durum:</strong> <span id="modal-order-status">-</span></div>
                        </div>
                        <div class="table-responsive">
                            <table class="table table-sm table-bordered mb-0">
                                <thead class="thead-light small">
                                    <tr>
                                        <th>Ürün Adı</th>
                                        <th>Barkod</th>
                                        <th class="text-center">Adet</th>
                                        <th class="text-right">Birim Fiyat</th>
                                        <th class="text-right">Toplam</th>
                                    </tr>
                                </thead>
                                <tbody id="modal-order-items-tbody"></tbody>
                                <tfoot>
                                    <tr>
                                        <th colspan="4" class="text-right font-weight-bold">Genel Toplam:</th>
                                        <th class="text-right font-weight-bold text-primary" id="modal-order-grand-total">0.00 ₺</th>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </div>
                    <div class="modal-footer py-2">
                        <button type="button" class="btn btn-secondary btn-sm font-weight-bold" data-dismiss="modal">Kapat</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    renderOrderTableRows(orders);
}

export function renderOrderTableRows(orders) {
    const tbody = document.querySelector("#admin-orders-tbody");
    if (!tbody) return;

    if (!orders || orders.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" class="text-center text-muted py-4"><i class="fa-solid fa-box-open mr-1"></i> Sipariş bulunamadı.</td></tr>`;
        return;
    }

    tbody.innerHTML = orders.map(o => {
        const status = o.status || "PENDING";
        const itemCount = o.orderDetails ? o.orderDetails.length : 0;
        const total = Number(o.totalAmount || 0).toLocaleString("tr-TR", { minimumFractionDigits: 2 });
        const dateStr = o.orderDate ? new Date(o.orderDate).toLocaleString("tr-TR") : "-";
        const dealerName = o.user ? (o.user.companyName || o.user.username) : "Bilinmeyen Bayi";
        const orderNo = o.orderNumber || ('#' + o.id);

        let badgeClass = "badge-warning text-dark";
        let statusText = "Beklemede";

        if (status === "APPROVED") { badgeClass = "badge-primary"; statusText = "Onaylandı"; }
        else if (status === "SHIPPED") { badgeClass = "badge-info"; statusText = "Kargoya Verildi"; }
        else if (status === "DELIVERED") { badgeClass = "badge-success"; statusText = "Teslim Edildi"; }
        else if (status === "CANCELED") { badgeClass = "badge-danger"; statusText = "İptal Edildi"; }

        return `
            <tr>
                <td class="font-weight-bold"><code>${orderNo}</code></td>
                <td class="font-weight-bold text-dark">${dealerName}</td>
                <td class="small text-muted">${dateStr}</td>
                <td class="text-right font-weight-bold text-primary">${total} ₺</td>
                <td class="text-center font-weight-bold">${itemCount}</td>
                <td class="text-center"><span class="badge ${badgeClass} px-2 py-1">${statusText}</span></td>
                <td class="text-center">
                    <button class="btn btn-sm btn-outline-info btn-view-order-detail mr-1" data-order='${JSON.stringify(o)}' title="Detayı Gör">
                        <i class="fa-solid fa-eye"></i>
                    </button>
                    ${status === "PENDING" ? `
                        <button class="btn btn-sm btn-success btn-update-order-status mr-1" data-id="${o.id}" data-status="APPROVED" title="Siparişi Onayla"><i class="fa-solid fa-check"></i> Onayla</button>
                        <button class="btn btn-sm btn-outline-danger btn-update-order-status" data-id="${o.id}" data-status="CANCELED" title="Siparişi İptal Et"><i class="fa-solid fa-xmark"></i></button>
                    ` : ''}
                    ${status === "APPROVED" ? `
                        <button class="btn btn-sm btn-info btn-update-order-status" data-id="${o.id}" data-status="SHIPPED" title="Kargoya Ver"><i class="fa-solid fa-truck-fast mr-1"></i> Sevk Et</button>
                    ` : ''}
                    ${status === "SHIPPED" ? `
                        <button class="btn btn-sm btn-success btn-update-order-status" data-id="${o.id}" data-status="DELIVERED" title="Teslim Edildi"><i class="fa-solid fa-box-check mr-1"></i> Teslim Et</button>
                    ` : ''}
                </td>
            </tr>
        `;
    }).join('');
}