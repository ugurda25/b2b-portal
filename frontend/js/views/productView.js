// js/views/productView.js

export function renderProductList(productList, containerElement) {
    containerElement.innerHTML = "";

    if (!productList || productList.length === 0) {
        containerElement.innerHTML = `
            <div class="col-12 text-center py-5">
                <i class="fa-solid fa-box-open fa-3x text-muted mb-3 d-block"></i>
                <h5 class="text-muted">Aradığınız kriterlere uygun ürün bulunamadı.</h5>
            </div>
        `;
        return;
    }

    const productCards = productList.map(product => {
        const noImageSvg = 'data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22300%22%20height%3D%22200%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20fill%3D%22%23e9ecef%22%2F%3E%3Ctext%20x%3D%2250%25%22%20y%3D%2250%25%22%20dominant-baseline%3D%22middle%22%20text-anchor%3D%22middle%22%20font-family%3D%22sans-serif%22%20font-size%3D%2220%22%20fill%3D%22%236c757d%22%3EGorsel%20Yok%3C%2Ftext%3E%3C%2Fsvg%3E';
        const imgSrc = product.imageBase64 ? product.imageBase64 : noImageSvg;
        const stockBadge = product.availableStock < 30 
            ? `<span class="badge badge-warning text-dark">Kritik Stok: ${product.availableStock} Adet</span>` 
            : `<span class="badge badge-success">Stok: ${product.availableStock} Adet</span>`;

        return `
            <div class="col-md-4 mb-4">
                <div class="card h-100 shadow-sm border-0">
                    <img src="${imgSrc}" class="card-img-top" style="height: 200px; object-fit: cover;" alt="${product.name}">
                    <div class="card-body d-flex flex-column justify-content-between">
                        <div>
                            <div class="d-flex justify-content-between align-items-start mb-2">
                                <h5 class="card-title font-weight-bold text-dark mb-0">${product.name}</h5>
                                ${stockBadge}
                            </div>
                            <p class="text-muted small mb-2">Barkod: ${product.barcode}</p>
                            <h4 class="text-primary font-weight-bold mb-3">${product.wholeSalePrice.toFixed(2)} ₺ <small class="text-muted font-weight-normal">/ Adet</small></h4>
                        </div>
                        
                        <div class="input-group">
                            <input type="number" class="form-control" placeholder="Adet" min="${product.minOrderQuantity}" value="${product.minOrderQuantity}" id="adet-kutusu-${product.id}">
                            <div class="input-group-append">
                                <button class="btn btn-dark font-weight-bold btn-add-cart" data-id="${product.id}">
                                    <i class="fa-solid fa-cart-plus mr-1"></i> Ekle
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });

    containerElement.innerHTML = productCards.join("");
}
