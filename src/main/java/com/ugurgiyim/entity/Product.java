package com.ugurgiyim.entity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.*;

@Entity
@Table(name = "Products")
@Data
@NoArgsConstructor
@AllArgsConstructor

public class Product {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name="Id")
	private Integer id;
	
	@Column(name="Barcode",nullable=false, length=50,unique=true)
	private String barcode;
	
	@Column(name="Name",length=100,nullable = false)
	private String name;
	
	@Column(name= "AvailableStock",nullable = false)
	private Integer availableStock;
	
	@Column(name="CostPrice",precision=18,scale=2,nullable = false)
	private BigDecimal costPrice;
	
	@Column(name="WholeSalePrice",precision=18,scale=2,nullable = false)
	private BigDecimal wholeSalePrice;
	
	@Column(name = "MinOrderQuantity", nullable = false)
    private Integer minOrderQuantity = 1;
	
	@Column(name="IsActive", length=100,nullable = false)
	private Boolean isActive=true;
	
	@Column(name = "currency", length = 10)
	private String currency = "TRY";
	
	@Column(name = "ImageBase64", columnDefinition = "NVARCHAR(MAX)")
	private String imageBase64;
	
	

}
