// js/views/adminProductView.js

export function renderAdminProductList(products, containerElement) {
    containerElement.innerHTML = `
        <div class="col-12">
            <!-- ÜST ARAÇ ÇUBUĞU: ARAMA, FİLTRE VE YENİ ÜRÜN BUTONU -->
            <div class="card border-0 shadow-sm mb-4">
                <div class="card-body p-3">
                    <div class="row align-items-center">
                        <div class="col-md-5 mb-2 mb-md-0">
                            <div class="input-group">
                                <div class="input-group-prepend">
                                    <span class="input-group-text bg-white border-right-0"><i class="fa-solid fa-magnifying-glass text-muted"></i></span>
                                </div>
                                <input type="text" id="admin-product-search" class="form-control border-left-0" placeholder="Ürün adı veya barkod ile ara...">
                            </div>
                        </div>
                        <div class="col-md-4 mb-2 mb-md-0">
                            <select id="admin-status-filter" class="custom-select">
                                <option value="ALL">Tüm Ürünler (Aktif + Pasif)</option>
                                <option value="ACTIVE" selected>Sadece Aktif Ürünler</option>
                                <option value="PASSIVE">Sadece Pasif Ürünler</option>
                                <option value="CRITICAL">Kritik Stoktakiler (&lt; 30)</option>
                            </select>
                        </div>
                        <div class="col-md-3 text-md-right">
                            <button class="btn btn-success btn-block font-weight-bold" id="btn-open-new-product">
                                <i class="fa-solid fa-plus mr-1"></i> Yeni Ürün Ekle
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- ÜRÜN LİSTE TABLOSU -->
            <div class="card border-0 shadow-sm">
                <div class="table-responsive">
                    <table class="table table-hover align-middle mb-0" id="admin-products-table">
                        <thead class="thead-dark small">
                            <tr>
                                <th style="width: 70px;">ID</th>
                                <th>Ürün Adı</th>
                                <th>Barkod</th>
                                <th class="text-right">Maliyet (TL)</th>
                                <th class="text-right">Toptan Fiyat (TL)</th>
                                <th class="text-center">Min. Sipariş</th>
                                <th class="text-center">Kalan Stok</th>
                                <th class="text-center">Durum</th>
                                <th class="text-center" style="width: 170px;">İşlemler</th>
                            </tr>
                        </thead>
                        <tbody id="admin-products-tbody">
                            <!-- Satırlar dinamik basılacak -->
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <!-- HIZLI STOK EKLEME MODALI -->
        <div class="modal fade" id="modalAddStock" tabindex="-1" role="dialog" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered modal-sm" role="document">
                <div class="modal-content">
                    <div class="modal-header bg-dark text-white py-2">
                        <h6 class="modal-title font-weight-bold"><i class="fa-solid fa-boxes-stacked text-warning mr-2"></i>Hızlı Stok Ekle</h6>
                        <button type="button" class="close text-white" data-dismiss="modal" aria-label="Kapat">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body p-3">
                        <p class="small text-muted mb-2" id="modal-stock-product-name"></p>
                        <input type="hidden" id="modal-stock-product-id">
                        <div class="form-group mb-2">
                            <label class="small font-weight-bold">Eklenecek Adet:</label>
                            <input type="number" id="modal-stock-quantity" class="form-control font-weight-bold text-center" min="1" value="50">
                        </div>
                    </div>
                    <div class="modal-footer py-2">
                        <button type="button" class="btn btn-secondary btn-sm font-weight-bold" data-dismiss="modal">Vazgeç</button>
                        <button type="button" class="btn btn-primary btn-sm font-weight-bold" id="btn-confirm-add-stock">Stok Ekle</button>
                    </div>
                </div>
            </div>
        </div>

        <!-- YENİ ÜRÜN / DÜZENLEME MODALI -->
        <div class="modal fade" id="modalProductForm" tabindex="-1" role="dialog" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                    <div class="modal-header bg-dark text-white py-2">
                        <h6 class="modal-title font-weight-bold" id="modal-product-title">
                            <i class="fa-solid fa-shirt text-warning mr-2"></i>Ürün Bilgileri
                        </h6>
                        <button type="button" class="close text-white" data-dismiss="modal" aria-label="Kapat">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <form id="form-product-save">
                        <div class="modal-body p-3">
                            <input type="hidden" id="form-product-id">
                            <div class="form-group mb-2">
                                <label class="small font-weight-bold">Ürün Adı:</label>
                                <input type="text" id="form-product-name" class="form-control" required placeholder="Örn: Erkek Slim Fit Gömlek (M Mavi)">
                            </div>
                            <div class="form-group">
                                <label>Ürün Görseli Seç</label>
                                <!-- type="file" ile bilgisayardan dosya seçtiriyoruz -->
                                <input type="file" id="form-product-image" class="form-control-file" accept="image/*">
                                <input type="hidden" id="form-product-existing-image">
                                <img id="form-product-image-preview" src="" style="max-height: 100px; display: none; margin-top: 10px; border-radius: 5px;">
                            </div>
                            <div class="row">
                                <div class="col-md-6 form-group mb-2">
                                    <label class="small font-weight-bold">Barkod:</label>
                                    <input type="text" id="form-product-barcode" class="form-control" required placeholder="Örn: PRD-2001">
                                </div>
                                <div class="col-md-6 form-group mb-2">
                                    <label class="small font-weight-bold">Mevcut Stok:</label>
                                    <input type="number" id="form-product-stock" class="form-control" min="0" required value="100">
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-6 form-group mb-2">
                                    <label class="small font-weight-bold">Maliyet Fiyatı (TL):</label>
                                    <input type="number" step="0.01" id="form-product-cost" class="form-control" required placeholder="250.00">
                                </div>
                                <div class="col-md-6 form-group mb-2">
                                    <label class="small font-weight-bold">Toptan Fiyat (TL):</label>
                                    <input type="number" step="0.01" id="form-product-wholesale" class="form-control" required placeholder="450.00">
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-6 form-group mb-2">
                                    <label class="small font-weight-bold">Min. Sipariş Adedi:</label>
                                    <input type="number" id="form-product-min-order" class="form-control" min="1" required value="5">
                                </div>
                                <div class="col-md-6 form-group mb-2">
                                    <label class="small font-weight-bold">Durum:</label>
                                    <select id="form-product-isactive" class="custom-select">
                                        <option value="true" selected>Aktif (Satışta)</option>
                                        <option value="false">Pasif (Satışa Kapalı)</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer py-2">
                            <button type="button" class="btn btn-secondary btn-sm font-weight-bold" data-dismiss="modal">İptal</button>
                            <button type="submit" class="btn btn-success btn-sm font-weight-bold">Kaydet</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    `;

    renderProductTableRows(products);
}

// Tablo satırlarını basan yardımcı fonksiyon
export function renderProductTableRows(products) {
    const tbody = document.querySelector("#admin-products-tbody");
    if (!tbody) return;

    if (!products || products.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="9" class="text-center text-muted py-4">
                    <i class="fa-solid fa-box-open mr-1"></i> Aradığınız kriterlere uygun ürün bulunamadı.
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = products.map(p => {
        const isActive = p.isActive !== false;
        const stock = p.availableStock || 0;
        const isCritical = stock < 30;

        return `
            <tr class="${!isActive ? 'table-secondary opacity-75' : ''}">
                <td class="font-weight-bold text-muted">${p.id}</td>
                <td class="font-weight-bold">
                    ${p.name}
                    ${!isActive ? '<span class="badge badge-secondary ml-1">Pasif</span>' : ''}
                </td>
                <td><code class="text-muted font-weight-bold">${p.barcode || '-'}</code></td>
                <td class="text-right text-muted">${Number(p.costPrice || 0).toLocaleString("tr-TR", { minimumFractionDigits: 2 })} ₺</td>
                <td class="text-right font-weight-bold text-dark">${Number(p.wholeSalePrice || 0).toLocaleString("tr-TR", { minimumFractionDigits: 2 })} ₺</td>
                <td class="text-center font-weight-bold">${p.minOrderQuantity || 1}</td>
                <td class="text-center">
                    <span class="badge ${stock === 0 ? 'badge-dark' : isCritical ? 'badge-danger' : 'badge-success'} px-2 py-1">
                        ${stock} adet
                    </span>
                </td>
                <td class="text-center">
                    <button class="btn btn-sm ${isActive ? 'btn-outline-success' : 'btn-outline-secondary'} btn-toggle-status font-weight-bold px-2 py-0" 
                            data-id="${p.id}" title="Durumu Değiştir">
                        ${isActive ? '<i class="fa-solid fa-check mr-1"></i>Aktif' : '<i class="fa-solid fa-ban mr-1"></i>Pasif'}
                    </button>
                </td>
                <td class="text-center">
                    <div class="btn-group btn-group-sm">
                        <button class="btn btn-outline-primary btn-add-stock" data-id="${p.id}" data-name="${p.name}" title="Stok Ekle">
                            <i class="fa-solid fa-plus"></i>
                        </button>
                        <button class="btn btn-outline-dark btn-edit-product" data-product='${JSON.stringify(p)}' title="Düzenle">
                            <i class="fa-solid fa-pen"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}