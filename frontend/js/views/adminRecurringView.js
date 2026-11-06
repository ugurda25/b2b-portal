// js/views/adminRecurringView.js

export function renderAdminRecurringList(orders, containerElement) {
    containerElement.innerHTML = `
        <div class="col-12">
            <!-- TALİMAT TABLOSU -->
            <div class="card border-0 shadow-sm">
                <div class="card-header bg-white font-weight-bold py-3 border-bottom">
                    <i class="fa-solid fa-list-check mr-2 text-primary"></i>Tüm Bayi Talimatları
                    <small class="text-muted ml-2">Aktif talimatlar her pazartesi 00:00'da çalışır.</small>
                </div>
                <div class="table-responsive">
                    <table class="table table-hover align-middle mb-0">
                        <thead class="thead-light small">
                            <tr>
                                <th>Bayi No</th>
                                <th>Ürün Adı</th>
                                <th class="text-center">Adet</th>
                                <th class="text-center">Periyot</th>
                                <th>Sonraki Çalışma</th>
                                <th class="text-center">Durum</th>
                                <th class="text-center">İşlem</th>
                            </tr>
                        </thead>
                        <tbody id="admin-recurring-tbody"></tbody>
                    </table>
                </div>
            </div>
        </div>
    `;
    renderRecurringTableRows(orders);
}

export function renderRecurringTableRows(orders) {
    const tbody = document.querySelector("#admin-recurring-tbody");
    if (!tbody) return;

    if (!orders || orders.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" class="text-center text-muted py-4">Sistemde kayıtlı otomatik sipariş talimatı bulunmuyor.</td></tr>`;
        return;
    }

    tbody.innerHTML = orders.map(o => {
        const isActive = o.isActive !== false;
        const periodText = "Her Hafta";
        const nextRun = o.nextRunDate ? new Date(o.nextRunDate).toLocaleDateString("tr-TR") : "-";

        return `
            <tr class="${!isActive ? 'table-secondary opacity-75' : ''}">
                <td class="font-weight-bold text-muted">#USR-${o.userId}</td>
                <td class="font-weight-bold text-dark">${o.productName || 'Bilinmeyen Ürün'}</td>
                <td class="text-center"><span class="badge badge-light border">${o.quantity}</span></td>
                <td class="text-center text-primary font-weight-500">${periodText}</td>
                <td>${nextRun}</td>
                <td class="text-center">
                    ${isActive 
                        ? '<span class="badge badge-success"><i class="fa-solid fa-check mr-1"></i>Aktif</span>' 
                        : '<span class="badge badge-secondary"><i class="fa-solid fa-ban mr-1"></i>Pasif</span>'}
                </td>
                <td class="text-center">
                    <button class="btn btn-sm ${isActive ? 'btn-outline-danger' : 'btn-outline-success'} btn-toggle-recurring font-weight-bold"
                            data-id="${o.id}" data-active="${isActive}">
                        <i class="fa-solid ${isActive ? 'fa-pause' : 'fa-play'} mr-1"></i>
                        ${isActive ? 'Pasife Al' : 'Aktifleştir'}
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}
