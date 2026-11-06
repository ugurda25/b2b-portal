package com.ugurgiyim.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor 
@NoArgsConstructor  
public class DtoLogin {

    private Integer userId;
    private String username;
    private String companyName;
    private String role; 
    private String message;
}