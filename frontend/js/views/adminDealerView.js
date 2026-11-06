// js/views/adminDealerView.js

export function renderAdminDealerList(dealers, containerElement) {
    containerElement.innerHTML = `
        <div class="col-12">
            <!-- ÜST ARAÇ ÇUBUĞU -->
            <div class="card border-0 shadow-sm mb-4">
                <div class="card-body p-3">
                    <div class="row align-items-center">
                        <div class="col-md-6 mb-2 mb-md-0">
                            <div class="input-group">
                                <div class="input-group-prepend">
                                    <span class="input-group-text bg-white border-right-0"><i class="fa-solid fa-magnifying-glass text-muted"></i></span>
                                </div>
                                <input type="text" id="admin-dealer-search" class="form-control border-left-0" placeholder="Firma adı, e-posta veya telefon ile ara...">
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="d-flex justify-content-end">
                                <button class="btn btn-success btn-sm font-weight-bold" id="btn-add-dealer">
                                    <i class="fa-solid fa-user-plus mr-1"></i> Yeni Bayi Ekle
                                </button>
                                <select id="admin-dealer-status-filter" class="custom-select ml-2" style="width: auto;">
                                    <option value="ALL" selected>Tüm Bayiler</option>
                                    <option value="ACTIVE">Sadece Aktif Bayiler</option>
                                    <option value="PASSIVE">Sadece Pasif Bayiler</option>
                                    <option value="DEBT">Borcu Olan Bayiler (Bakiye > 0)</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- BAYİ TABLOSU -->
            <div class="card border-0 shadow-sm">
                <div class="table-responsive">
                    <table class="table table-hover align-middle mb-0">
                        <thead class="thead-dark small">
                            <tr>
                                <th style="width: 80px;">Bayi No</th>
                                <th>Firma Ünvanı</th>
                                <th>İletişim</th>
                                <th class="text-right">Kredi Limiti</th>
                                <th class="text-right">Güncel Borç</th>
                                <th class="text-center">Durum</th>
                                <th class="text-center" style="width: 180px;">İşlemler</th>
                            </tr>
                        </thead>
                        <tbody id="admin-dealers-tbody"></tbody>
                    </table>
                </div>
            </div>
        </div>

        <!-- BAYİ DÜZENLEME MODALI -->
        <div class="modal fade" id="modalAdminDealerForm" tabindex="-1" role="dialog" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                    <div class="modal-header bg-dark text-white py-2">
                        <h6 class="modal-title font-weight-bold"><i class="fa-solid fa-user-pen text-warning mr-2"></i>Bayi Düzenle</h6>
                        <button type="button" class="close text-white" data-dismiss="modal" aria-label="Kapat"><span aria-hidden="true">&times;</span></button>
                    </div>
                    <form id="form-dealer-save">
                        <div class="modal-body p-3">
                            <input type="hidden" id="form-dealer-id">
                            <div id="form-dealer-reset-alert" class="alert alert-warning py-2 d-none">
                                <i class="fa-solid fa-key mr-1"></i>Bu bayi şifre yenileme talebi gönderdi.
                            </div>
                            <div class="form-group mb-3">
                                <label class="small font-weight-bold text-muted">Firma Ünvanı</label>
                                <input type="text" id="form-dealer-name" class="form-control font-weight-bold text-dark" readonly>
                            </div>
                            <div class="row">
                                <div class="col-md-6 form-group mb-2">
                                    <label class="small font-weight-bold text-primary">Kredi Limiti (TL):</label>
                                    <input type="number" step="0.01" id="form-dealer-limit" class="form-control font-weight-bold" required>
                                </div>
                                <div class="col-md-6 form-group mb-2">
                                    <label class="small font-weight-bold text-danger">Güncel Bakiye / Borç (TL):</label>
                                    <input type="number" step="0.01" id="form-dealer-balance" class="form-control font-weight-bold text-danger" required>
                                </div>
                            </div>
                            <div class="form-group mt-3 mb-2">
                                <label class="small font-weight-bold text-danger">Yeni Şifre</label>
                                <input type="password" id="form-dealer-password" class="form-control" minlength="6"
                                    placeholder="Değiştirmeyecekseniz boş bırakın">
                                <small class="text-muted">Yeni şifre en az 6 karakter olmalıdır.</small>
                            </div>
                            <small class="text-muted d-block mt-2"><i class="fa-solid fa-info-circle mr-1"></i>Bayi ödeme yaptığında güncel borç tutarını buradan düşebilirsiniz.</small>
                        </div>
                        <div class="modal-footer py-2">
                            <button type="button" class="btn btn-secondary btn-sm font-weight-bold" data-dismiss="modal">İptal</button>
                            <button type="submit" class="btn btn-primary btn-sm font-weight-bold"><i class="fa-solid fa-save mr-1"></i> Kaydet</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>

        <!-- YENİ BAYİ EKLEME MODALI -->
        <div class="modal fade" id="modalAddDealer" tabindex="-1" role="dialog" aria-hidden="true">
            <div class="modal-dialog modal-lg modal-dialog-centered" role="document">
                <div class="modal-content">
                    <div class="modal-header bg-success text-white py-2">
                        <h6 class="modal-title font-weight-bold"><i class="fa-solid fa-user-plus text-white mr-2"></i>Yeni Bayi Hesabı Oluştur</h6>
                        <button type="button" class="close text-white" data-dismiss="modal" aria-label="Kapat"><span aria-hidden="true">&times;</span></button>
                    </div>
                    <form id="form-add-dealer">
                        <div class="modal-body p-3">
                            <div class="row">
                                <div class="col-md-6">
                                    <div class="form-group mb-2">
                                        <label class="small font-weight-bold text-muted">Firma Ünvanı *</label>
                                        <input type="text" id="add-dealer-company" class="form-control" required>
                                    </div>
                                    <div class="form-group mb-2">
                                        <label class="small font-weight-bold text-muted">Kullanıcı Adı *</label>
                                        <input type="text" id="add-dealer-username" class="form-control" minlength="3" required>
                                    </div>
                                    <div class="form-group mb-2">
                                        <label class="small font-weight-bold text-muted">Şifre *</label>
                                        <input type="password" id="add-dealer-password" class="form-control" minlength="6" required>
                                    </div>
                                    <div class="form-group mb-2">
                                        <label class="small font-weight-bold text-muted">E-posta</label>
                                        <input type="email" id="add-dealer-email" class="form-control">
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="form-group mb-2">
                                        <label class="small font-weight-bold text-muted">Telefon</label>
                                        <input type="text" id="add-dealer-phone" class="form-control">
                                    </div>
                                    <div class="form-group mb-2">
                                        <label class="small font-weight-bold text-muted">Adres</label>
                                        <textarea id="add-dealer-address" class="form-control" rows="2"></textarea>
                                    </div>
                                    <div class="form-group mb-2">
                                        <label class="small font-weight-bold text-muted">Vergi Dairesi</label>
                                        <input type="text" id="add-dealer-taxoffice" class="form-control">
                                    </div>
                                    <div class="form-group mb-2">
                                        <label class="small font-weight-bold text-primary">Kredi Limiti (TL)</label>
                                        <input type="number" step="0.01" id="add-dealer-limit" class="form-control" value="0">
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer py-2">
                            <button type="button" class="btn btn-secondary btn-sm font-weight-bold" data-dismiss="modal">İptal</button>
                            <button type="submit" class="btn btn-success btn-sm font-weight-bold"><i class="fa-solid fa-save mr-1"></i> Bayiyi Oluştur</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    `;
    renderDealerTableRows(dealers);
}

export function renderDealerTableRows(dealers) {
    const tbody = document.querySelector("#admin-dealers-tbody");
    if (!tbody) return;

    if (!dealers || dealers.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" class="text-center text-muted py-4">Bayi bulunamadı.</td></tr>`;
        return;
    }

    tbody.innerHTML = dealers.map(d => {
        const isActive = d.isActive !== false;
        const limit = Number(d.creditLimit || 0).toLocaleString("tr-TR", { minimumFractionDigits: 2 });
        const balance = Number(d.currentBalance || 0).toLocaleString("tr-TR", { minimumFractionDigits: 2 });

        return `
            <tr class="${!isActive ? 'table-secondary opacity-75' : ''}">
                <td class="font-weight-bold text-muted">#USR-${d.id}</td>
                <td class="font-weight-bold text-dark">
                    ${d.companyName || d.username}
                    ${!isActive ? '<span class="badge badge-secondary ml-1">Pasif</span>' : ''}
                    ${d.passwordResetRequested === true ? '<span class="badge badge-warning ml-1"><i class="fa-solid fa-key mr-1"></i>Şifre Talebi</span>' : ''}
                </td>
                <td class="small text-muted">
                    <div><i class="fa-solid fa-envelope mr-1"></i>${d.email || '-'}</div>
                    <div><i class="fa-solid fa-phone mr-1"></i>${d.phone || '-'}</div>
                </td>
                <td class="text-right font-weight-bold text-primary">${limit} ₺</td>
                <td class="text-right font-weight-bold text-danger">${balance} ₺</td>
                <td class="text-center">
                    <button class="btn btn-sm ${isActive ? 'btn-outline-success' : 'btn-outline-secondary'} btn-toggle-dealer font-weight-bold px-2 py-0" data-id="${d.id}" data-status="${isActive}">
                        ${isActive ? '<i class="fa-solid fa-check mr-1"></i>Aktif' : '<i class="fa-solid fa-ban mr-1"></i>Pasif'}
                    </button>
                </td>
                <td class="text-center">
                    <button class="btn btn-sm ${d.passwordResetRequested === true ? 'btn-warning' : 'btn-outline-dark'} btn-edit-dealer" data-dealer='${JSON.stringify(d)}' title="Bayi Düzenle">
                        <i class="fa-solid ${d.passwordResetRequested === true ? 'fa-key' : 'fa-pen'}"></i>
                        ${d.passwordResetRequested === true ? 'Şifre Yenile' : 'Düzenle'}
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}
