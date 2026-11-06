package com.ugurgiyim.service.impl;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.TemporalAdjusters;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.ugurgiyim.dto.DtoRecurringOrder;
import com.ugurgiyim.entity.Product;
import com.ugurgiyim.entity.RecurringOrder;
import com.ugurgiyim.entity.User;
import com.ugurgiyim.repository.RecurringOrderRepository;

@ExtendWith(MockitoExtension.class)
class RecurringOrderServiceImplTests {

    @Mock
    private RecurringOrderRepository recurringOrderRepository;

    @InjectMocks
    private RecurringOrderServiceImpl recurringOrderService;

    private RecurringOrder recurringOrder;

    @BeforeEach
    void setUp() {
        User user = new User();
        user.setId(10);

        Product product = new Product();
        product.setId(20);
        product.setName("Test Ürünü");

        recurringOrder = new RecurringOrder();
        recurringOrder.setId(1);
        recurringOrder.setUser(user);
        recurringOrder.setProduct(product);
        recurringOrder.setQuantity(5);
        recurringOrder.setPeriodInWeeks(1);

        when(recurringOrderRepository.findById(1)).thenReturn(Optional.of(recurringOrder));
        when(recurringOrderRepository.save(any(RecurringOrder.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));
    }

    @Test
    void shouldDeactivateActiveOrderWithoutChangingNextRunDate() {
        LocalDateTime nextRunDate = LocalDateTime.of(2026, 10, 5, 0, 0);
        recurringOrder.setIsActive(true);
        recurringOrder.setNextRunDate(nextRunDate);

        DtoRecurringOrder result = recurringOrderService.toggleRecurringOrderStatus(1);

        assertFalse(result.getIsActive());
        assertEquals(nextRunDate, result.getNextRunDate());
    }

    @Test
    void shouldActivatePassiveOrderForNextMonday() {
        recurringOrder.setIsActive(false);
        recurringOrder.setNextRunDate(LocalDateTime.of(2026, 9, 28, 0, 0));

        DtoRecurringOrder result = recurringOrderService.toggleRecurringOrderStatus(1);

        LocalDateTime expectedNextRunDate = LocalDate.now()
                .with(TemporalAdjusters.next(DayOfWeek.MONDAY))
                .atStartOfDay();
        assertTrue(result.getIsActive());
        assertEquals(expectedNextRunDate, result.getNextRunDate());
    }
}
