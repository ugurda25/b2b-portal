package com.ugurgiyim.dto;

import java.math.BigDecimal;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DtoOrderDetail {

	private Integer id;
	private DtoProduct product; // Ürün bilgilerini de içinde taşır
	private Integer quantity;
	private BigDecimal unitPrice;
}