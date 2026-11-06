package com.ugurgiyim.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
@Data
@NoArgsConstructor
@AllArgsConstructor

public class DtoProduct {
	
	private Integer id;
	
	@NotBlank(message = "Barkod alanı boş bırakılamaz!")
    private String barcode;
	
    @NotBlank(message = "Ürün adı boş bırakılamaz!")
    private String name;
	
    @NotNull(message = "Stok miktarı boş bırakılamaz!")
    @Min(value = 0, message = "Mevcut stok eksi olamaz!")
    private Integer availableStock;

    @NotNull(message = "Maliyet fiyatı boş bırakılamaz!")
    @DecimalMin(value = "0.0", message = "Maliyet fiyatı negatif olamaz!")
    private BigDecimal costPrice;

    @NotNull(message = "Toptan satış fiyatı boş bırakılamaz!")
    @DecimalMin(value = "0.0", message = "Toptan satış fiyatı negatif olamaz!")
    private BigDecimal wholeSalePrice;

    private String currency = "TRY";

    @Min(value = 1, message = "Minimum sipariş miktarı en az 1 olmalıdır!")
    private Integer minOrderQuantity = 1;

    private Boolean isActive = true;
    
    private String imageBase64;
}
