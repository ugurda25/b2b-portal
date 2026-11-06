package com.ugurgiyim.entity;

import jakarta.persistence.*;

import lombok.*;


import java.math.BigDecimal;
@Entity
@Table(name = "OrderDetails")
@Data
@NoArgsConstructor
@AllArgsConstructor

public class OrderDetail {
	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Id")
    private Integer id;
	
	@ManyToOne
	@JoinColumn(name="OrderId",referencedColumnName="Id")
	private Order order;
	
	@ManyToOne
	@JoinColumn(name="ProductId",referencedColumnName="Id")
	private Product product;
	
	//quantity unitPrice
	@Column(name="Quantity")
	private Integer quantity;
	
	@Column(name="UnitPrice", precision = 18,scale = 2)
	private BigDecimal unitPrice;
	
	
}
