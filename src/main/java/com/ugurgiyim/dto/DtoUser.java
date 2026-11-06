package com.ugurgiyim.dto;

import java.math.BigDecimal;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DtoUser {
    private Integer id;
    private String companyName;
    private String role = "BAYI";
    private BigDecimal creditLimit;
    private BigDecimal currentBalance;
    private String username;    
    private Boolean isActive = true;
    private Boolean passwordResetRequested;
    
    private String email;
    private String phone;
    private String address;
    private String taxOffice;
}
