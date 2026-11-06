package com.ugurgiyim.service;

import com.ugurgiyim.dto.DtoLoyaltyInfo;

public interface ILoyaltyService {
    DtoLoyaltyInfo getLoyaltyInfoByUserId(Integer userId);
}