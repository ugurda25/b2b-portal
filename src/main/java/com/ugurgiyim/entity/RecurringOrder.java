	package com.ugurgiyim.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "RecurringOrders")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class RecurringOrder {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Id")
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "UserId", referencedColumnName = "Id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "ProductId", referencedColumnName = "Id", nullable = false)
    private Product product;

    @Column(name = "Quantity", nullable = false)
    private Integer quantity;

    @Column(name = "PeriodInWeeks", nullable = false)
    private Integer periodInWeeks = 1;

    @Column(name = "NextRunDate", nullable = false)
    private LocalDateTime nextRunDate;

    @Column(name = "IsActive", nullable = false)
    private Boolean isActive = true;
}