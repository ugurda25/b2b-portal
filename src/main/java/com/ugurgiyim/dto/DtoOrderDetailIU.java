package com.ugurgiyim.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DtoOrderDetailIU {

    @NotNull(message = "Sipariş edilen ürün ID'si seçilmelidir!")
    private Integer productId;

    @NotNull(message = "Ürün adedi boş bırakılamaz!")
    @Min(value = 1, message = "Sipariş adedi en az 1 olmalıdır!")
    private Integer quantity;

}
