package com.ugurgiyim.controller.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.ugurgiyim.dto.DtoLoyaltyInfo;
import com.ugurgiyim.service.ILoyaltyService;

@RestController
@RequestMapping("/api/loyalty")
@CrossOrigin
public class LoyaltyController {

    @Autowired
    private ILoyaltyService loyaltyService;

    @GetMapping("/user/{userId}")
    public ResponseEntity<DtoLoyaltyInfo> getLoyaltyInfo(@PathVariable Integer userId) {
        return ResponseEntity.ok(loyaltyService.getLoyaltyInfoByUserId(userId));
    }
}