package com.ugurgiyim.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.ugurgiyim.enums.OrderStatus;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DtoOrder {

    private Integer id;
    private String orderNumber;
    private DtoUser user; // Siparişi veren bayi/kullanıcı bilgisi
    private LocalDateTime orderDate;
    private BigDecimal totalAmount;
    private OrderStatus status;
    private Boolean isAutomated;
    private List<DtoOrderDetail> orderDetails;
}