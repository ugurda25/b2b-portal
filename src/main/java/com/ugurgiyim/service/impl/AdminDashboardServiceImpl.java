package com.ugurgiyim.service.impl;

import java.math.BigDecimal;
import java.sql.CallableStatement;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import com.ugurgiyim.dto.DtoAdminDashboard;
import com.ugurgiyim.service.IAdminDashboardService;

@Service
public class AdminDashboardServiceImpl implements IAdminDashboardService {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Override
    public DtoAdminDashboard getDashboardSummary() {
        return jdbcTemplate.execute((java.sql.Connection con) -> {
            try (CallableStatement cs = con.prepareCall("{call sp_GetAdminDashboardSummary()}")) {
                boolean hasResults = cs.execute();

                DtoAdminDashboard dashboard = new DtoAdminDashboard();

                // 1. SONUÇ KÜMESİ: KPI Kartları
                if (hasResults) {
                    try (ResultSet rs = cs.getResultSet()) {
                        if (rs.next()) {
                            dashboard.setTotalRevenue(rs.getBigDecimal("TotalRevenue"));
                            dashboard.setPendingOrders(rs.getLong("PendingOrders"));
                            dashboard.setActiveDealers(rs.getLong("ActiveDealers"));
                            dashboard.setCriticalStockCount(rs.getInt("CriticalStockCount"));
                        }
                    }
                }

                // 2. SONUÇ KÜMESİ: Kritik Stoklar
                if (cs.getMoreResults()) {
                    try (ResultSet rs = cs.getResultSet()) {
                        List<Map<String, Object>> criticalList = new ArrayList<>();
                        while (rs.next()) {
                            Map<String, Object> item = new HashMap<>();
                            item.put("id", rs.getInt("Id"));
                            item.put("name", rs.getString("Name"));
                            item.put("barcode", rs.getString("Barcode"));
                            item.put("stock", rs.getInt("Stock"));
                            criticalList.add(item);
                        }
                        dashboard.setCriticalStockList(criticalList);
                    }
                }

                // 3. SONUÇ KÜMESİ: En Çok Satanlar
                if (cs.getMoreResults()) {
                    try (ResultSet rs = cs.getResultSet()) {
                        List<Map<String, Object>> topSelling = new ArrayList<>();
                        while (rs.next()) {
                            Map<String, Object> item = new HashMap<>();
                            item.put("name", rs.getString("Name"));
                            item.put("soldCount", rs.getInt("SoldCount"));
                            item.put("revenue", rs.getBigDecimal("Revenue"));
                            topSelling.add(item);
                        }
                        dashboard.setTopSellingProducts(topSelling);
                    }
                }

                return dashboard;
            }
        });
    }
}