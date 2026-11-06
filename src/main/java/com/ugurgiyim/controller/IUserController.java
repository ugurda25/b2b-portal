package com.ugurgiyim.controller;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

import com.ugurgiyim.dto.DtoLogin;
import com.ugurgiyim.dto.DtoLoginIU;
import com.ugurgiyim.dto.DtoUser;
import com.ugurgiyim.dto.DtoUserIU;

import jakarta.validation.Valid;

public interface IUserController {
	public DtoUser saveUser(@Valid DtoUserIU dtoUserIU);
    public List<DtoUser> getAllUsers();
    public DtoUser getUserById(Integer id);
    public DtoUser updateUser(Integer id, DtoUserIU dtoUserIU);
    public void deleteUser(Integer id);
    public DtoLogin login(DtoLoginIU dtoLoginIU);
    public String requestPasswordReset(Map<String, String> body);
    public String changePassword(Integer id, Map<String, String> body);
    public DtoUser toggleUserStatus(Integer id);
    public DtoUser payDebt(Integer id, Map<String, BigDecimal> body);
}
