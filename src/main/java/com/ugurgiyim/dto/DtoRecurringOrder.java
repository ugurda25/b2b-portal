package com.ugurgiyim.dto;

import java.time.LocalDateTime;
import lombok.Data;

@Data
public class DtoRecurringOrder {
    private Integer id;
    private Integer userId;
    private Integer productId;
    private String productName;
    private Integer quantity;
    private LocalDateTime nextRunDate;
    private Boolean isActive;
}
