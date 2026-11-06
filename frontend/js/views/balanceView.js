// js/views/balanceView.js

export function renderBalanceView(summary, transactions, containerElement) {
    containerElement.innerHTML = "";

    // 1. Üst Bakiye Kartları (Tüm genişliği kaplar)
    const cardsHtml = `
        <div class="col-12 mb-4">
            <div class="row">
                <div class="col-md-4 mb-3 mb-md-0">
                    <div class="card border-0 shadow-sm bg-primary text-white p-3 h-100">
                        <div class="d-flex justify-content-between align-items-center">
                            <div>
                                <small class="text-white-50 text-uppercase font-weight-bold">Toplam Kredi Limiti</small>
                                <h3 class="mb-0 mt-1 font-weight-bold">${Number(summary.creditLimit || 0).toFixed(2)} ₺</h3>
                            </div>
                            <i class="fa-solid fa-wallet fa-2x text-white-50"></i>
                        </div>
                    </div>
                </div>
                <div class="col-md-4 mb-3 mb-md-0">
                    <div class="card border-0 shadow-sm bg-danger text-white p-3 h-100">
                        <div class="d-flex justify-content-between align-items-center">
                            <div>
                                <small class="text-white-50 text-uppercase font-weight-bold">Güncel Borç / Bakiye</small>
                                <h3 class="mb-0 mt-1 font-weight-bold">${Number(summary.currentBalance || 0).toFixed(2)} ₺</h3>
                            </div>
                            <i class="fa-solid fa-file-invoice-dollar fa-2x text-white-50"></i>
                        </div>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="card border-0 shadow-sm bg-success text-white p-3 h-100">
                        <div class="d-flex justify-content-between align-items-center">
                            <div>
                                <small class="text-white-50 text-uppercase font-weight-bold">Kullanılabilir Limit</small>
                                <h3 class="mb-0 mt-1 font-weight-bold">${Number(summary.availableLimit || 0).toFixed(2)} ₺</h3>
                            </div>
                            <i class="fa-solid fa-circle-check fa-2x text-white-50"></i>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    const currentBalance = Number(summary.currentBalance || 0);
    const paymentHtml = `
        <div class="col-12 mb-4">
            <div class="card border-0 shadow-sm">
                <div class="card-body p-4">
                    <h5 class="font-weight-bold text-dark mb-3">
                        <i class="fa-solid fa-money-bill-wave mr-2 text-success"></i>Borç Ödeme
                    </h5>
                    ${currentBalance > 0 ? `
                        <form id="form-pay-debt" class="form-row align-items-end">
                            <div class="form-group col-md-8 mb-0">
                                <label for="paymentAmount" class="font-weight-bold small text-muted">ÖDENECEK TUTAR</label>
                                <input type="number" class="form-control" id="paymentAmount" min="0.01" max="${currentBalance.toFixed(2)}" step="0.01" placeholder="Ödeme tutarını giriniz" required>
                            </div>
                            <div class="col-md-4 mt-3 mt-md-0">
                                <button type="submit" class="btn btn-success btn-block font-weight-bold">
                                    <i class="fa-solid fa-credit-card mr-1"></i> Borcu Öde
                                </button>
                            </div>
                        </form>
                    ` : `
                        <div class="alert alert-success mb-0">
                            <i class="fa-solid fa-circle-check mr-1"></i> Ödenecek borcunuz bulunmuyor.
                        </div>
                    `}
                </div>
            </div>
        </div>
    `;

    // 2. Alt Tablo (Tüm genişliği kaplar)
    let rowsHtml = "";
    if (!transactions || transactions.length === 0) {
        rowsHtml = `<tr><td colspan="4" class="text-center py-4 text-muted">Hesap hareketi bulunamadı.</td></tr>`;
    } else {
        transactions.forEach(t => {
            rowsHtml += `
                <tr>
                    <td class="align-middle text-nowrap">${t.date}</td>
                    <td class="align-middle font-weight-500">${t.description}</td>
                    <td class="align-middle"><span class="badge badge-warning text-dark">${t.type}</span></td>
                    <td class="align-middle font-weight-bold text-danger text-right text-nowrap">-${Number(t.amount || 0).toFixed(2)} ₺</td>
                </tr>
            `;
        });
    }

    const tableHtml = `
        <div class="col-12">
            <div class="card border-0 shadow-sm w-100">
                <div class="card-header bg-white border-bottom-0 py-3">
                    <h5 class="mb-0 font-weight-bold text-dark"><i class="fa-solid fa-list-check mr-2 text-primary"></i>Cari Hesap Hareketleri</h5>
                </div>
                <div class="card-body p-0">
                    <div class="table-responsive w-100">
                        <table class="table table-hover mb-0 w-100">
                            <thead class="thead-light">
                                <tr>
                                    <th>Tarih</th>
                                    <th>Açıklama</th>
                                    <th>İşlem Türü</th>
                                    <th class="text-right">Tutar</th>
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

    containerElement.innerHTML = cardsHtml + paymentHtml + tableHtml;
}
