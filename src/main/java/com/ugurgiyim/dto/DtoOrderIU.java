package com.ugurgiyim.dto;

import java.util.List;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.ugurgiyim.enums.OrderStatus;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DtoOrderIU {

    @NotNull(message = "Siparişi veren kullanıcı ID'si boş olamaz!")
    private Integer userId;

    private String orderNumber;

    private OrderStatus status = OrderStatus.PENDING;

    private Boolean isAutomated = false;

    @NotEmpty(message = "Sipariş en az bir ürün detayı içermelidir!")
    @Valid // İçindeki DtoOrderDetailIU kurallarını da tetikler!
    private List<DtoOrderDetailIU> orderDetails;
}
