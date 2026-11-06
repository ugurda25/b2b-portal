package com.ugurgiyim.service.impl;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ugurgiyim.dto.DtoLoyaltyInfo;
import com.ugurgiyim.entity.Order;
import com.ugurgiyim.enums.OrderStatus;
import com.ugurgiyim.repository.OrderRepository;
import com.ugurgiyim.service.ILoyaltyService;

@Service
public class LoyaltyServiceImpl implements ILoyaltyService {

    @Autowired
    private OrderRepository orderRepository;

    @Override
    public DtoLoyaltyInfo getLoyaltyInfoByUserId(Integer userId) {
        // Kullanıcının siparişlerini çek
        List<Order> orders = orderRepository.findByUserId(userId);

        // Toplam harcamayı (ciroyu) hesapla
        BigDecimal totalSpent = orders.stream()
                .filter(o -> o.getTotalAmount() != null)
                .filter(o -> o.getStatus() == OrderStatus.DELIVERED)
                .map(Order::getTotalAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // Puan: Toplam harcamanın %1'i
        BigDecimal loyaltyPoints = totalSpent.multiply(BigDecimal.valueOf(0.01)).setScale(2, RoundingMode.HALF_UP);

        // Kademeleri Belirle
        String tierName;
        String tierDisplayName;
        int discountRate;
        BigDecimal nextTierThreshold;

        double spent = totalSpent.doubleValue();

        if (spent >= 150000) {
            tierName = "PLATINUM";
            tierDisplayName = "Platin Bayi";
            discountRate = 15;
            nextTierThreshold = BigDecimal.valueOf(150000);
        } else if (spent >= 75000) {
            tierName = "GOLD";
            tierDisplayName = "Altın Bayi";
            discountRate = 10;
            nextTierThreshold = BigDecimal.valueOf(150000);
        } else if (spent >= 25000) {
            tierName = "SILVER";
            tierDisplayName = "Gümüş Bayi";
            discountRate = 5;
            nextTierThreshold = BigDecimal.valueOf(75000);
        } else {
            tierName = "BRONZE";
            tierDisplayName = "Bronz Bayi";
            discountRate = 0;
            nextTierThreshold = BigDecimal.valueOf(25000);
        }

        // Kalan tutar ve progress bar hesabı
        BigDecimal remaining = nextTierThreshold.subtract(totalSpent);
        if (remaining.compareTo(BigDecimal.ZERO) < 0) {
            remaining = BigDecimal.ZERO;
        }

        int progress = 100;
        if (nextTierThreshold.compareTo(BigDecimal.ZERO) > 0 && spent < 150000) {
            progress = (int) Math.min(100, (spent / nextTierThreshold.doubleValue()) * 100);
        }

        return DtoLoyaltyInfo.builder()
                .tierName(tierName)
                .tierDisplayName(tierDisplayName)
                .discountRate(discountRate)
                .totalSpent(totalSpent)
                .loyaltyPoints(loyaltyPoints)
                .nextTierThreshold(nextTierThreshold)
                .remainingForNextTier(remaining)
                .progressPercentage(progress)
                .build();
    }
}
