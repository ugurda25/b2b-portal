package com.ugurgiyim.entity;

import java.math.BigDecimal;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
@Entity
@Table(name="Users")
@Data
@NoArgsConstructor
@AllArgsConstructor

public class User {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name="Id")
	private Integer id;
	
	@Column(name="CompanyName", length=100,nullable = false)
	private String companyName;
	
	@Column(name = "Role", nullable = false, length = 20)
    private String role = "BAYI";
	
	@Column(name = "CreditLimit", nullable = false, precision = 18, scale = 2)
    private BigDecimal creditLimit = BigDecimal.ZERO;
	
	@Column(name = "CurrentBalance", nullable = false, precision = 18, scale = 2)
    private BigDecimal currentBalance = BigDecimal.ZERO;
	
	@Column(name="Username",length=50,nullable = false, unique = true)
	private String username;
	
	@Column(name="Password",length=255,nullable = false)
	private String password ;	
	
	@Column(name = "IsActive", nullable = false)
    private Boolean isActive = true;

	@Column(name = "PasswordResetRequested")
	private Boolean passwordResetRequested = false;
	
	@Column(name = "Email", length = 100)
    private String email;

    @Column(name = "Phone", length = 20)
    private String phone;

    @Column(name = "Address", length = 500)
    private String address;

    @Column(name = "TaxOffice", length = 100)
    private String taxOffice;
	
	
	
	
	
	
	
	

}
