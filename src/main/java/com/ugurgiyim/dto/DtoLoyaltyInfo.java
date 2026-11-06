package com.ugurgiyim.dto;

import java.math.BigDecimal;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DtoLoyaltyInfo {
    private String tierName;           // "BRONZE", "SILVER", "GOLD", "PLATINUM"
    private String tierDisplayName;    // "Altın Bayi"
    private Integer discountRate;       // 10 (%10)
    private BigDecimal totalSpent;      // Toplam ciro (örn: 95000.00)
    private BigDecimal loyaltyPoints;   // Kazanılan puan (örn: 950.00)
    private BigDecimal nextTierThreshold; // Sonraki seviye hedefi (örn: 150000.00)
    private BigDecimal remainingForNextTier; // Kalan tutar (örn: 55000.00)
    private Integer progressPercentage; // Progress bar yüzdesi (örn: %63)
}