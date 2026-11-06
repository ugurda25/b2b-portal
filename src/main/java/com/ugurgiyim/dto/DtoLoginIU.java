package com.ugurgiyim.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data 
public class DtoLoginIU {

    @NotBlank(message = "Kullanıcı adı boş olamaz!")
    private String username;

    @NotBlank(message = "Şifre boş olamaz!")
    private String password;
}