// js/views/orderView.js

export function renderOrderHistory(orders, containerElement) {
    containerElement.innerHTML = "";

    if (!orders || orders.length === 0) {
        containerElement.innerHTML = `
            <div class="col-12 text-center py-5">
                <i class="fa-solid fa-receipt fa-3x text-muted mb-3 d-block"></i>
                <h5 class="text-muted">Henüz verilmiş bir siparişiniz bulunmuyor.</h5>
            </div>
        `;
        return;
    }

    let rowsHtml = "";
    orders.forEach(order => {
        let statusBadge = `<span class="badge badge-secondary">${order.status}</span>`;
        let statusText = "Beklemede";

        if (order.status === "PENDING" || order.status === "PENDİNG") {
            statusBadge = `<span class="badge badge-warning text-dark">Hazırlanıyor</span>`;
            statusText = "Hazırlanıyor";
        } else if (order.status === "APPROVED") {
            statusBadge = `<span class="badge badge-primary">Onaylandı</span>`;
            statusText = "Onaylandı";
        } else if (order.status === "SHIPPED") {
            statusBadge = `<span class="badge badge-info">Kargoya Verildi</span>`;
            statusText = "Kargoya Verildi";
        } else if (order.status === "COMPLETED" || order.status === "DELIVERED") {
            statusBadge = `<span class="badge badge-success">Teslim Edildi</span>`;
            statusText = "Teslim Edildi";
        } else if (order.status === "CANCELED") {
            statusBadge = `<span class="badge badge-danger">İptal Edildi</span>`;
            statusText = "İptal Edildi";
        }

        const formattedDate = order.orderDate ? new Date(order.orderDate).toLocaleString("tr-TR") : "-";
        
        let itemsHtml = '<span class="text-muted small">Detay yok</span>';
        if (order.orderDetails && order.orderDetails.length > 0) {
            itemsHtml = order.orderDetails.map(d => {
                const productName = d.product ? d.product.name : 'Ürün';
                return `<div class="mb-1"><i class="fa-solid fa-cube text-secondary mr-1"></i> <span class="font-weight-500">${productName}</span> <span class="badge badge-light border ml-1">${d.quantity} Adet</span></div>`;
            }).join("");
        }

        const orderNo = order.orderNumber || ('ORD-' + order.id);

        rowsHtml += `
            <tr>
                <td class="font-weight-bold text-primary align-middle">${orderNo}</td>
                <td class="align-middle text-nowrap">${formattedDate}</td>
                <td class="align-middle">${itemsHtml}</td>
                <td class="font-weight-bold align-middle text-nowrap">${Number(order.totalAmount || 0).toFixed(2)} ₺</td>
                <td class="align-middle">${statusBadge}</td>
                <td class="align-middle">
                    ${order.isAutomated ? '<span class="badge badge-info"><i class="fa-solid fa-robot mr-1"></i>Oto</span>' : '<span class="badge badge-light">Manuel</span>'}
                </td>
                <td class="align-middle text-center">
                    ${(order.status === "PENDING" || order.status === "PENDİNG")
                        ? `<button class="btn btn-sm btn-outline-danger btn-cancel-order rounded-circle p-2" data-id="${order.id}" title="Siparişi İptal Et" style="width: 34px; height: 34px; display: inline-flex; align-items: center; justify-content: center;">
                            <i class="fa-solid fa-xmark"></i>
                           </button>`
                        : ''}
                    <button class="btn btn-sm btn-outline-danger btn-download-invoice rounded-circle p-2" 
                            data-id="${order.id}" 
                            data-no="${orderNo}" 
                            data-status="${statusText}" 
                            title="İrsaliye İndir" 
                            style="width: 34px; height: 34px; display: inline-flex; align-items: center; justify-content: center;">
                        <i class="fa-solid fa-file-pdf"></i>
                    </button>
                </td>
            </tr>
        `;
    });

    containerElement.innerHTML = `
        <div class="col-12">
            <div class="card shadow-sm border-0">
                <div class="card-body p-0">
                    <div class="table-responsive">
                        <table class="table table-hover align-items-center mb-0">
                            <thead class="thead-light">
                                <tr>
                                    <th>Sipariş No</th>
                                    <th>Tarih</th>
                                    <th>Kalemler</th>
                                    <th>Toplam Tutar</th>
                                    <th>Durum</th>
                                    <th>Tür</th>
                                    <th class="text-center" style="width: 80px;">İşlem</th>
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
}