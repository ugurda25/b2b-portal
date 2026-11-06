// js/views/loyaltyView.js

export function renderLoyalty(loyaltyData, containerElement) {
    if (!loyaltyData) {
        containerElement.innerHTML = `<div class="alert alert-warning">Sadakat bilgileri yüklenemedi.</div>`;
        return;
    }

    let badgeColor = "secondary";
    if (loyaltyData.tierName === "SILVER") badgeColor = "secondary";
    if (loyaltyData.tierName === "GOLD") badgeColor = "warning text-dark";
    if (loyaltyData.tierName === "PLATINUM") badgeColor = "info text-white";

    containerElement.innerHTML = `
        <div class="col-12">
            <!-- ÜST KARTLAR -->
            <div class="row mb-4">
                <div class="col-md-4 mb-3">
                    <div class="card border-0 shadow-sm text-center py-4 h-100">
                        <div class="card-body">
                            <i class="fa-solid fa-crown fa-3x text-warning mb-3"></i>
                            <h6 class="text-muted text-uppercase mb-1">Bayi Kademesi</h6>
                            <h3 class="font-weight-bold mb-2">${loyaltyData.tierDisplayName || 'Bronz Bayi'}</h3>
                            <span class="badge badge-${badgeColor} px-3 py-2 font-weight-bold">
                                %${loyaltyData.discountRate || 0} Sabit İskonto
                            </span>
                        </div>
                    </div>
                </div>

                <div class="col-md-4 mb-3">
                    <div class="card border-0 shadow-sm text-center py-4 h-100">
                        <div class="card-body">
                            <i class="fa-solid fa-coins fa-3x text-primary mb-3"></i>
                            <h6 class="text-muted text-uppercase mb-1">Uğur Puan Bakiyesi</h6>
                            <h3 class="font-weight-bold text-primary mb-2">${Number(loyaltyData.loyaltyPoints || 0).toFixed(2)} Puan</h3>
                            <small class="text-muted">1 Puan = 1.00 ₺ değerindedir</small>
                        </div>
                    </div>
                </div>

                <div class="col-md-4 mb-3">
                    <div class="card border-0 shadow-sm text-center py-4 h-100">
                        <div class="card-body">
                            <i class="fa-solid fa-chart-line fa-3x text-success mb-3"></i>
                            <h6 class="text-muted text-uppercase mb-1">Toplam Ciro / Alım</h6>
                            <h3 class="font-weight-bold text-success mb-2">${Number(loyaltyData.totalSpent || 0).toFixed(2)} ₺</h3>
                            <small class="text-muted">Geçmişten bugüne tüm siparişler</small>
                        </div>
                    </div>
                </div>
            </div>

            <!-- İLERLEME ÇUBUĞU -->
            <div class="card border-0 shadow-sm mb-4">
                <div class="card-body p-4">
                    <div class="d-flex justify-content-between align-items-center mb-2">
                        <h6 class="font-weight-bold mb-0">Sonraki Kademeye İlerleme Durumu</h6>
                        <span class="font-weight-bold text-primary">%${loyaltyData.progressPercentage || 0}</span>
                    </div>
                    <div class="progress mb-3" style="height: 12px; border-radius: 6px;">
                        <div class="progress-bar bg-primary progress-bar-striped progress-bar-animated" 
                             role="progressbar" 
                             style="width: ${loyaltyData.progressPercentage || 0}%"></div>
                    </div>
                    <small class="text-muted">
                        ${loyaltyData.tierName === 'PLATINUM' 
                            ? 'Tebrikler, en üst seviyedesiniz! Maksimum iskonto avantajından yararlanıyorsunuz.' 
                            : `Bir sonraki kademeye geçmek için <b>${Number(loyaltyData.remainingForNextTier || 0).toFixed(2)} ₺</b> daha alım yapmanız gerekmektedir.`}
                    </small>
                </div>
            </div>

            <!-- AVANTAJ TABLOSU -->
            <div class="card border-0 shadow-sm mb-4">
                <div class="card-header bg-white font-weight-bold py-3 border-bottom">
                    <i class="fa-solid fa-table-list mr-2 text-primary"></i>Bayi Kademe ve İskonto Oranları
                </div>
                <div class="table-responsive">
                    <table class="table table-hover mb-0 text-center">
                        <thead class="thead-light">
                            <tr>
                                <th>Kademe</th>
                                <th>Ciro Aralığı</th>
                                <th>Otomatik İskonto</th>
                                <th>Puan Oranı</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr class="${loyaltyData.tierName === 'BRONZE' ? 'table-primary font-weight-bold' : ''}">
                                <td><i class="fa-solid fa-medal text-secondary mr-1"></i> Bronz</td>
                                <td>0 – 25.000 ₺</td>
                                <td>%0</td>
                                <td>%1</td>
                            </tr>
                            <tr class="${loyaltyData.tierName === 'SILVER' ? 'table-primary font-weight-bold' : ''}">
                                <td><i class="fa-solid fa-medal text-muted mr-1"></i> Gümüş</td>
                                <td>25.000 – 75.000 ₺</td>
                                <td>%5</td>
                                <td>%1</td>
                            </tr>
                            <tr class="${loyaltyData.tierName === 'GOLD' ? 'table-primary font-weight-bold' : ''}">
                                <td><i class="fa-solid fa-medal text-warning mr-1"></i> Altın</td>
                                <td>75.000 – 150.000 ₺</td>
                                <td>%10</td>
                                <td>%1</td>
                            </tr>
                            <tr class="${loyaltyData.tierName === 'PLATINUM' ? 'table-primary font-weight-bold' : ''}">
                                <td><i class="fa-solid fa-medal text-info mr-1"></i> Platin</td>
                                <td>150.000 ₺ ve Üzeri</td>
                                <td>%15</td>
                                <td>%1</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- BİLGİLENDİRME & PROGRAM KURALLARI (ALT AÇIKLAMALAR) -->
            <div class="row">
                <div class="col-md-6 mb-3">
                    <div class="card border-0 shadow-sm h-100">
                        <div class="card-body">
                            <h6 class="font-weight-bold text-dark mb-3">
                                <i class="fa-solid fa-circle-question mr-2 text-primary"></i>İskonto ve Puan Sistemi Nasıl Çalışır?
                            </h6>
                            <ul class="text-muted small pl-3 mb-0" style="line-height: 1.8;">
                                <li><strong>Otomatik Tanımlama:</strong> Ciro baremlerini aştığınız anda kademeniz anında güncellenir ve yeni siparişlerinizde indirim uygulanır.</li>
                                <li><strong>Puan Kazanımı:</strong> Tamamlanan her siparişinizin KDV hariç toplam tutarının <strong>%1'i</strong> hesabınıza Uğur Puan olarak eklenir.</li>
                                <li><strong>Bakiye Değeri:</strong> Biriken her 1 Puan, 1.00 ₺ değerinde olup cari hesap ödemelerinizde kullanılabilir.</li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div class="col-md-6 mb-3">
                    <div class="card border-0 shadow-sm h-100">
                        <div class="card-body">
                            <h6 class="font-weight-bold text-dark mb-3">
                                <i class="fa-solid fa-shield-halved mr-2 text-success"></i>Kullanım Şartları & Avantajlar
                            </h6>
                            <ul class="text-muted small pl-3 mb-0" style="line-height: 1.8;">
                                <li><strong>Öncelikli Sevkiyat:</strong> Altın ve Platin kademesindeki bayilerin siparişleri depodan aynı gün öncelikli sevk edilir.</li>
                                <li><strong>İptal / İade Durumu:</strong> İptal edilen siparişlerde kazanılan puanlar sistem tarafından otomatik olarak geri alınır.</li>
                                <li><strong>Kademe Geçerliliği:</strong> Ulaşılan bayi kademesi takvim yılı boyunca korunur.</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}