package com.ugurgiyim.service.impl;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.ugurgiyim.dto.DtoLogin;
import com.ugurgiyim.dto.DtoLoginIU;
import com.ugurgiyim.dto.DtoUser;
import com.ugurgiyim.dto.DtoUserIU;
import com.ugurgiyim.entity.User;
import com.ugurgiyim.repository.UserRepository;
import com.ugurgiyim.service.IUserService;

@Service
public class UserServiceImpl implements IUserService {
	@Autowired
	private UserRepository userRepository;
	@Autowired
	private PasswordEncoder passwordEncoder;

	@Override
	public DtoUser saveUser(DtoUserIU dtoUserIU) {
		User user = new User();
		BeanUtils.copyProperties(dtoUserIU, user);
		user.setPassword(passwordEncoder.encode(dtoUserIU.getPassword()));
		
		if (user.getIsActive() == null) {
			user.setIsActive(true);
		}
		if (user.getPasswordResetRequested() == null) {
			user.setPasswordResetRequested(false);
		}
		User dbUser = userRepository.save(user);
		DtoUser response = new DtoUser();
		BeanUtils.copyProperties(dbUser, response);
		return response;
	}

	@Override
	public List<DtoUser> getAllUsers() {
		List<User> userList = userRepository.findAll();
		List<DtoUser> responseList = new ArrayList<>();
		for (User user : userList) {
			DtoUser responseUser = new DtoUser();
			BeanUtils.copyProperties(user, responseUser);
			responseList.add(responseUser);

		}
		return responseList;
	}

	@Override
	public DtoUser getUserById(Integer id) {
		User dbUser = userRepository.findById(id)
				.orElseThrow(() -> new RuntimeException("Hata: " + id + " numaralı aranan müşteri bulunamadı!"));
		DtoUser optionalDtoUser = new DtoUser();
		BeanUtils.copyProperties(dbUser, optionalDtoUser);
		return optionalDtoUser;
	}

	@Override
	public void deleteUser(Integer id) {
		User dbUser = userRepository.findById(id)
				.orElseThrow(() -> new RuntimeException("Hata: " + id + " Numaralı ürün bulunamadı!"));
		dbUser.setIsActive(false);
		userRepository.save(dbUser);

	}

	@Override
	public DtoUser updateUser(Integer id, DtoUserIU dtoUserIU) {

		DtoUser response = new DtoUser();

		Optional<User> optional = userRepository.findById(id);
		if (optional.isPresent()) {
			User dbUser = optional.get();

			// Sadece formdan dolu gelen alanları güncelle
			if (dtoUserIU.getCompanyName() != null) dbUser.setCompanyName(dtoUserIU.getCompanyName());
			if (dtoUserIU.getEmail() != null) dbUser.setEmail(dtoUserIU.getEmail());
			if (dtoUserIU.getPhone() != null) dbUser.setPhone(dtoUserIU.getPhone());
			if (dtoUserIU.getAddress() != null) dbUser.setAddress(dtoUserIU.getAddress());
			if (dtoUserIU.getTaxOffice() != null) dbUser.setTaxOffice(dtoUserIU.getTaxOffice());

			// Şifre, Bakiye ve Kredi Limitini ezme (Sadece geldiyse güncelle)
			if (dtoUserIU.getUsername() != null && !dtoUserIU.getUsername().isBlank()) dbUser.setUsername(dtoUserIU.getUsername());
			if (dtoUserIU.getPassword() != null && !dtoUserIU.getPassword().isBlank()) {
				if (dtoUserIU.getPassword().length() < 6) {
					throw new RuntimeException("Şifre en az 6 karakter olmalıdır!");
				}
				dbUser.setPassword(passwordEncoder.encode(dtoUserIU.getPassword()));
				dbUser.setPasswordResetRequested(false);
			}
			if (dtoUserIU.getCreditLimit() != null) dbUser.setCreditLimit(dtoUserIU.getCreditLimit());
			if (dtoUserIU.getCurrentBalance() != null) dbUser.setCurrentBalance(dtoUserIU.getCurrentBalance());
			
			if (dtoUserIU.getIsActive() != null) dbUser.setIsActive(dtoUserIU.getIsActive());

			User updatedUser = userRepository.save(dbUser);

			BeanUtils.copyProperties(updatedUser, response);
			return response;
		}

		return null;
	}

	@Override
	public String requestPasswordReset(String username) {
		if (username == null || username.isBlank()) {
			throw new RuntimeException("Kullanıcı adı boş bırakılamaz!");
		}

		User user = userRepository.findByUsername(username.trim())
				.orElseThrow(() -> new RuntimeException("Bu kullanıcı adına ait bayi bulunamadı!"));
		if (user.getRole() != null && !"BAYI".equalsIgnoreCase(user.getRole())) {
			throw new RuntimeException("Sadece bayi hesapları şifre yenileme talebi gönderebilir!");
		}

		user.setPasswordResetRequested(true);
		userRepository.save(user);
		return "Şifre yenileme talebiniz yöneticiye gönderildi.";
	}

	@Override
	public DtoLogin login(DtoLoginIU dtoLoginIU) {
		User user=userRepository.findByUsername(dtoLoginIU.getUsername()).orElseThrow(() -> new RuntimeException("Kullanıcı adı veya şifre hatalı!"));
		String storedPassword = user.getPassword();
		if (!passwordMatches(dtoLoginIU.getPassword(), storedPassword)) {
	        throw new RuntimeException("Kullanıcı adı veya şifre hatalı!");
	    }
		if (user.getIsActive() != null && !user.getIsActive()) {
	        throw new RuntimeException("Hesabınız pasif durumdadır, giriş yapamazsınız!");
	    }
		// Mevcut düz metin şifreleri ilk başarılı girişte BCrypt'e yükseltir.
		if (!isBcryptHash(storedPassword)) {
			user.setPassword(passwordEncoder.encode(dtoLoginIU.getPassword()));
			userRepository.save(user);
		}
		return new DtoLogin(
	            user.getId(),
	            user.getUsername(),
	            user.getCompanyName(),
	            user.getRole(),
	            "Giriş başarılı!"
	    );
	}
	@Override
	public String changePassword(Integer id, String oldPassword, String newPassword) {
	    Optional<User> optUser = userRepository.findById(id);
	    if (optUser.isEmpty()) {
	        return "Kullanıcı bulunamadı!";
	    }

	    User user = optUser.get();
	    if (!passwordMatches(oldPassword, user.getPassword())) {
	        return "Mevcut şifreniz hatalı!";
	    }

	    user.setPassword(passwordEncoder.encode(newPassword));
	    userRepository.save(user);
	    return "Şifre başarıyla güncellendi.";
	}
	@Override
	public DtoUser toggleUserStatus(Integer id) {
		User user = userRepository.findById(id)
				.orElseThrow(() -> new RuntimeException("Kullanıcı bulunamadı! ID: " + id));

		boolean currentStatus = user.getIsActive() != null ? user.getIsActive() : true;
		user.setIsActive(!currentStatus); // Aktifse pasif, pasifse aktif yap

		User updatedUser = userRepository.save(user);

		DtoUser response = new DtoUser();
		BeanUtils.copyProperties(updatedUser, response);
		return response;
	}
	@Override
	public DtoUser payDebt(Integer id, BigDecimal amount) {
		if (amount == null || amount.compareTo(BigDecimal.ZERO) <= 0) {
			throw new RuntimeException("Ödeme tutarı 0'dan büyük olmalıdır!");
		}

		User user = userRepository.findById(id)
				.orElseThrow(() -> new RuntimeException("Kullanıcı bulunamadı! ID: " + id));
		BigDecimal currentBalance = user.getCurrentBalance() != null
				? user.getCurrentBalance()
				: BigDecimal.ZERO;

		if (currentBalance.compareTo(BigDecimal.ZERO) <= 0) {
			throw new RuntimeException("Ödenecek borcunuz bulunmuyor!");
		}
		if (amount.compareTo(currentBalance) > 0) {
			throw new RuntimeException("Ödeme tutarı güncel borçtan fazla olamaz!");
		}

		user.setCurrentBalance(currentBalance.subtract(amount));
		User updatedUser = userRepository.save(user);
		DtoUser response = new DtoUser();
		BeanUtils.copyProperties(updatedUser, response);
		return response;
	}

	private boolean isBcryptHash(String password) {
		return password != null && (password.startsWith("$2a$")
				|| password.startsWith("$2b$")
				|| password.startsWith("$2y$"));
	}

	private boolean passwordMatches(String rawPassword, String storedPassword) {
		if (isBcryptHash(storedPassword)) {
			return passwordEncoder.matches(rawPassword, storedPassword);
		}
		return storedPassword != null && storedPassword.equals(rawPassword);
	}

}
