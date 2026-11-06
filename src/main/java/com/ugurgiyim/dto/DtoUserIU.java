package com.ugurgiyim.dto;

import java.math.BigDecimal;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DtoUserIU {

	private Integer id;

	@NotBlank(message = "Şirket adı boş bırakılamaz!")
	private String companyName;
	private String role = "BAYI";

	@NotNull(message = "Kredi limiti boş olamaz!")
	@DecimalMin(value = "0.0", message = "Kredi limiti negatif olamaz!")
	private BigDecimal creditLimit;

	@NotNull(message = "Bakiye boş bırakılamaz!")
	@DecimalMin(value = "0.0", message = "Bakiye negatif olamaz!")
	private BigDecimal currentBalance;

	@NotBlank(message = "Kullanıcı adı boş bırakılamaz!")
	@Size(min = 3, max = 50, message = "Kullanıcı adı 3 ile 50 karakter arasında olmalıdır!")
	private String username;

	@NotBlank(message = "Şifre alanı boş bırakılamaz!")
	@Size(min = 6, message = "Şifre en az 6 karakter olmalıdır!")
	private String password;

	private Boolean isActive;
	
	private String email;
    private String phone;
    private String address;
    private String taxOffice;
}