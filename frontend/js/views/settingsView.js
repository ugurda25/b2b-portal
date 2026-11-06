// js/views/settingsView.js

export function renderSettingsView(userData, containerElement) {
    const user = userData || {};

    containerElement.innerHTML = `
        <div class="col-12">
            <div class="row">
                <!-- Firma / Profil Bilgileri -->
                <div class="col-lg-7 mb-4">
                    <div class="card border-0 shadow-sm">
                        <div class="card-header bg-white font-weight-bold py-3 border-bottom">
                            <i class="fa-solid fa-building mr-2 text-primary"></i>Firma Bilgileri & İletişim
                        </div>
                        <div class="card-body p-4">
                            <form id="form-profile">
                                <div class="form-group">
                                    <label class="font-weight-bold small">Firma / Bayi Ünvanı</label>
                                    <input type="text" id="companyName" class="form-control" value="${user.companyName || user.dealerName || ''}" required>
                                </div>
                                <div class="row">
                                    <div class="col-md-6 form-group">
                                        <label class="font-weight-bold small">Vergi Dairesi / No</label>
                                        <input type="text" id="taxOffice" class="form-control" value="${user.taxOffice || ''}">
                                    </div>
                                    <div class="col-md-6 form-group">
                                        <label class="font-weight-bold small">Telefon</label>
                                        <input type="text" id="phone" class="form-control" value="${user.phone || ''}">
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label class="font-weight-bold small">E-Posta Adresi</label>
                                    <input type="email" id="email" class="form-control" value="${user.email || ''}" required>
                                </div>
                                <div class="form-group mb-4">
                                    <label class="font-weight-bold small">Sevkiyat & Fatura Adresi</label>
                                    <textarea id="address" class="form-control" rows="3">${user.address || ''}</textarea>
                                </div>
                                <button type="submit" class="btn btn-primary font-weight-bold px-4">
                                    <i class="fa-solid fa-floppy-disk mr-1"></i> Bilgileri Güncelle
                                </button>
                            </form>
                        </div>
                    </div>
                </div>

                <!-- Şifre Değiştirme -->
                <div class="col-lg-5 mb-4">
                    <div class="card border-0 shadow-sm mb-4">
                        <div class="card-header bg-white font-weight-bold py-3 border-bottom">
                            <i class="fa-solid fa-lock mr-2 text-danger"></i>Şifre Değiştir
                        </div>
                        <div class="card-body p-4">
                            <form id="form-password">
                                <div class="form-group">
                                    <label class="font-weight-bold small">Mevcut Şifre</label>
                                    <input type="password" id="oldPassword" class="form-control" placeholder="••••••••" required>
                                </div>
                                <div class="form-group">
                                    <label class="font-weight-bold small">Yeni Şifre</label>
                                    <input type="password" id="newPassword" class="form-control" placeholder="••••••••" required>
                                </div>
                                <div class="form-group mb-4">
                                    <label class="font-weight-bold small">Yeni Şifre (Tekrar)</label>
                                    <input type="password" id="newPasswordConfirm" class="form-control" placeholder="••••••••" required>
                                </div>
                                <button type="submit" class="btn btn-outline-danger btn-block font-weight-bold">
                                    <i class="fa-solid fa-key mr-1"></i> Şifreyi Güncelle
                                </button>
                            </form>
                        </div>
                    </div>

                    <div class="card border-0 shadow-sm bg-light">
                        <div class="card-body p-3">
                            <small class="text-muted d-block">Hesap Durumu</small>
                            <span class="badge badge-success font-weight-bold">Aktif Onaylı Bayi</span>
                            <small class="text-muted d-block mt-2">Kullanıcı Kodu: <b>#USR-${user.id || '2'}</b></small>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}