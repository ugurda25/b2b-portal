// js/views/recurringView.js

export function renderRecurringOrders(orders, products, containerElement) {
    containerElement.innerHTML = "";

    // Ürün Seçim Listesi (Aktif olanlar)
    let productOptions = '<option value="">-- Talimat Verilecek Ürünü Seçin --</option>';
    if (products && products.length > 0) {
        products.forEach(p => {
            productOptions += `<option value="${p.id}">${p.name} (Birim Fiyat: ${Number(p.wholeSalePrice || 0).toFixed(2)} ₺ - Stok: ${p.availableStock})</option>`;
        });
    }

    // 1. Yeni Talimat Oluşturma Formu
    const formHtml = `
        <div class="col-12 mb-4">
            <div class="card border-0 shadow-sm">
                <div class="card-header bg-white py-3">
                    <h5 class="mb-0 font-weight-bold text-dark">
                        <i class="fa-solid fa-plus-circle text-primary mr-2"></i>Yeni Otomatik Sipariş Talimatı Oluştur
                    </h5>
                </div>
                <div class="card-body">
                    <form id="form-recurring-order">
                        <div class="form-row">
                            <div class="form-group col-md-7">
                                <label class="font-weight-bold small text-muted">ÜRÜN SEÇİMİ</label>
                                <select class="form-control custom-select" id="recurringProductId" required>
                                    ${productOptions}
                                </select>
                            </div>
                            <div class="form-group col-md-5">
                                <label class="font-weight-bold small text-muted">SİPARİŞ ADEDİ</label>
                                <input type="number" class="form-control" id="recurringQuantity" min="1" value="10" required>
                            </div>
                        </div>
                        <div class="d-flex justify-content-between align-items-center mt-2">
                            <div class="text-muted small">
                                <i class="fa-solid fa-circle-info mr-1 text-info"></i> Talimatınız her pazartesi stok ve bakiye kontrolünden sonra otomatik sipariş oluşturur.
                            </div>
                            <button type="submit" class="btn btn-primary px-4">
                                <i class="fa-solid fa-floppy-disk mr-1"></i> Talimatı Kaydet
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    `;

    // 2. Mevcut Talimatlar Tablosu
    let rowsHtml = "";
    if (!orders || orders.length === 0) {
        rowsHtml = `<tr><td colspan="5" class="text-center py-4 text-muted">Tanımlı bir otomatik sipariş talimatınız bulunmuyor.</td></tr>`;
    } else {
        orders.forEach(item => {
            const productName = item.productName || (item.product ? item.product.name : "Ürün");
            const periodText = "Her Hafta";
            const isActive = item.isActive !== false;

            const statusBadge = isActive 
                ? `<span class="badge badge-success"><i class="fa-solid fa-check mr-1"></i>Aktif</span>`
                : `<span class="badge badge-secondary"><i class="fa-solid fa-ban mr-1"></i>Pasif / İptal</span>`;

            const actionBtn = isActive
                ? `<button class="btn btn-sm btn-outline-danger btn-cancel-recurring" data-id="${item.id}">
                     <i class="fa-solid fa-trash mr-1"></i>İptal Et
                   </button>`
                : `<span class="text-muted small">İşlem Yok</span>`;

            rowsHtml += `
                <tr>
                    <td class="align-middle font-weight-bold text-dark">${productName}</td>
                    <td class="align-middle"><span class="badge badge-light border font-weight-bold">${item.quantity} Adet</span></td>
                    <td class="align-middle text-primary font-weight-500">${periodText}</td>
                    <td class="align-middle">${statusBadge}</td>
                    <td class="align-middle text-right">${actionBtn}</td>
                </tr>
            `;
        });
    }

    const tableHtml = `
        <div class="col-12">
            <div class="card border-0 shadow-sm">
                <div class="card-header bg-white py-3">
                    <h5 class="mb-0 font-weight-bold text-dark">
                        <i class="fa-solid fa-clock-rotate-left mr-2 text-primary"></i>Kayıtlı Talimatlarım
                    </h5>
                </div>
                <div class="card-body p-0">
                    <div class="table-responsive">
                        <table class="table table-hover mb-0">
                            <thead class="thead-light">
                                <tr>
                                    <th>Ürün Adı</th>
                                    <th>Miktar</th>
                                    <th>Periyot</th>
                                    <th>Durum</th>
                                    <th class="text-right">İşlem</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${rowsHtml}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    `;

    containerElement.innerHTML = formHtml + tableHtml;
}
