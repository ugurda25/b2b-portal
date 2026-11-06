package com.ugurgiyim.service;

import java.math.BigDecimal;
import java.util.List;

import com.ugurgiyim.dto.DtoLogin;
import com.ugurgiyim.dto.DtoLoginIU;
import com.ugurgiyim.dto.DtoUser;
import com.ugurgiyim.dto.DtoUserIU;

public interface IUserService {
	public DtoUser saveUser(DtoUserIU dtoUserIU);
	public List<DtoUser> getAllUsers();
	public DtoUser getUserById(Integer id);
	public void deleteUser(Integer id);
	public DtoUser updateUser(Integer id,DtoUserIU dtoUserIU);
	public DtoLogin login(DtoLoginIU dtoLoginIU);
	public String requestPasswordReset(String username);
	public String changePassword(Integer id, String oldPassword, String newPassword);
	public DtoUser toggleUserStatus(Integer id);
	public DtoUser payDebt(Integer id, BigDecimal amount);

}
