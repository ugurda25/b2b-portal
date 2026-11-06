package com.ugurgiyim.dto;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DtoAdminDashboard {
    private BigDecimal totalRevenue;
    private Long pendingOrders;
    private Long activeDealers;
    private Integer criticalStockCount;
    private List<Map<String, Object>> criticalStockList;
    private List<Map<String, Object>> topSellingProducts;
}