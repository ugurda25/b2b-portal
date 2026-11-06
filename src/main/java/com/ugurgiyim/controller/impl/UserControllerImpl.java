package com.ugurgiyim.controller.impl;

import jakarta.validation.Valid;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ugurgiyim.controller.IUserController;
import com.ugurgiyim.dto.DtoLogin;
import com.ugurgiyim.dto.DtoLoginIU;
import com.ugurgiyim.dto.DtoUser;
import com.ugurgiyim.dto.DtoUserIU;
import com.ugurgiyim.service.IUserService;

@RestController
@RequestMapping("/api/Users")
@CrossOrigin(origins = "*")
public class UserControllerImpl implements IUserController {

	@Autowired
	private IUserService userService;

	
	@PostMapping(path= "/save")
	@Override
	public DtoUser saveUser(@Valid @RequestBody DtoUserIU dtoUserIU) {
		return userService.saveUser(dtoUserIU);
	}

	@GetMapping("/list")
	@Override
	public List<DtoUser> getAllUsers() {
		return userService.getAllUsers();
	}

	@GetMapping(path= "/list/{id}")
	@Override
	public DtoUser getUserById(@PathVariable Integer id) {
		return userService.getUserById(id);
	}

	@PutMapping(path= "/update/{id}")
	@Override
	public DtoUser updateUser(@PathVariable(name="id") Integer id, @RequestBody DtoUserIU dtoUserIU) {
		return userService.updateUser(id, dtoUserIU);
	}

	@DeleteMapping(path= "/delete/{id}")
	@Override
	public void deleteUser(@PathVariable  Integer id) {
		userService.deleteUser(id);
		
	}

	@Override
	@PostMapping("/login")
	public DtoLogin login(@RequestBody @Valid  DtoLoginIU dtoLoginIU) {
		return userService.login(dtoLoginIU);
	}

	@Override
	@PostMapping("/request-password-reset")
	public String requestPasswordReset(@RequestBody Map<String, String> body) {
		return userService.requestPasswordReset(body.get("username"));
	}
	
	@Override
    @PutMapping("/change-password/{id}")
    public String changePassword(@PathVariable Integer id, @RequestBody Map<String, String> body) {
        String oldPassword = body.get("oldPassword");
        String newPassword = body.get("newPassword");
        return userService.changePassword(id, oldPassword, newPassword);
    }
	@PutMapping(path = "/toggle-status/{id}")
	@Override
	public DtoUser toggleUserStatus(@PathVariable Integer id) {
		return userService.toggleUserStatus(id);
	}
	@PutMapping(path = "/pay-debt/{id}")
	@Override
	public DtoUser payDebt(@PathVariable Integer id, @RequestBody Map<String, BigDecimal> body) {
		return userService.payDebt(id, body.get("amount"));
	}
	
}
