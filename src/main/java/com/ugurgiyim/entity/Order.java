package com.ugurgiyim.entity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.ugurgiyim.enums.OrderStatus;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "Orders")
@Data //getter setter falan filan
@NoArgsConstructor
@AllArgsConstructor

public class Order {
	@Id //primary key
	@GeneratedValue(strategy=GenerationType.IDENTITY) // 1 den bailadığını belirtir.
	@Column(name="Id")
	private int id;
	
	@Column(name = "OrderNumber", nullable = false, unique = true, length = 50)
    private String orderNumber;
	
	@ManyToOne
	@JoinColumn(name = "UserId",referencedColumnName="Id")
	private User user;
	
	@Column(name = "OrderDate")
    private LocalDateTime orderDate;
	
	@Column(name="TotalAmount", precision = 18, scale = 2)
	private BigDecimal totalAmount;
	
	@Enumerated(EnumType.STRING)
	@Column(name = "Status", nullable = false, length = 20)
	private OrderStatus status = OrderStatus.PENDING;
	
	@Column(name = "IsAutomated", nullable = false)
    private Boolean isAutomated = false;

}
