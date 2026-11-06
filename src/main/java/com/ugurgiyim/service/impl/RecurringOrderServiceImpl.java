package com.ugurgiyim.service.impl;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.TemporalAdjusters;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.ugurgiyim.dto.DtoRecurringOrder;
import com.ugurgiyim.dto.DtoRecurringOrderIU;
import com.ugurgiyim.entity.Product;
import com.ugurgiyim.entity.RecurringOrder;
import com.ugurgiyim.entity.User;
import com.ugurgiyim.repository.ProductRepository;
import com.ugurgiyim.repository.RecurringOrderRepository;
import com.ugurgiyim.repository.UserRepository;
import com.ugurgiyim.service.IRecurringOrderService;

@Service
public class RecurringOrderServiceImpl  implements IRecurringOrderService{
	@Autowired
    private RecurringOrderRepository recurringOrderRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductRepository productRepository;

	@Value("${recurring-order.demo-mode:false}")
	private boolean demoMode;

	
	
	@Override
	public DtoRecurringOrder createRecurringOrder(DtoRecurringOrderIU dtoRec) {
		
		User user = userRepository.findById(dtoRec.getUserId())
		        .orElseThrow(() -> new RuntimeException("Kullanıcı bulunamadı! ID: " + dtoRec.getUserId()));
		
		Product product = productRepository.findById(dtoRec.getProductId())
                .orElseThrow(() -> new RuntimeException("Ürün bulunamadı! ID: " + dtoRec.getProductId()));
		
		RecurringOrder recurringOrder = new RecurringOrder();
        recurringOrder.setUser(user);
        recurringOrder.setProduct(product);
        recurringOrder.setQuantity(dtoRec.getQuantity());
        recurringOrder.setPeriodInWeeks(1);
        if (demoMode) {
			recurringOrder.setNextRunDate(LocalDateTime.now());
		} else {
			recurringOrder.setNextRunDate(LocalDate.now()
					.with(TemporalAdjusters.next(DayOfWeek.MONDAY))
					.atStartOfDay());
		}
        recurringOrder.setIsActive(true);

        RecurringOrder saved = recurringOrderRepository.save(recurringOrder);
        return convertToDto(saved);
	}

	@Override
	public List<DtoRecurringOrder> getOrdersByUserId(Integer userId) {
		List<RecurringOrder> list = recurringOrderRepository.findByUserId(userId);
		List<DtoRecurringOrder> dtoList = new ArrayList<>();
		for (RecurringOrder item : list) {
		    dtoList.add(convertToDto(item));
		}
		return dtoList;
		
	}

	@Override
	public void cancelRecurringOrder(Integer id) {
		RecurringOrder order = recurringOrderRepository.findById(id)
		        .orElseThrow(() -> new RuntimeException("Talimat bulunamadı! ID: " + id));

		order.setIsActive(false);
		recurringOrderRepository.save(order);
		
	}

	@Override
	public DtoRecurringOrder toggleRecurringOrderStatus(Integer id) {
		RecurringOrder order = recurringOrderRepository.findById(id)
				.orElseThrow(() -> new RuntimeException("Talimat bulunamadı! ID: " + id));

		boolean currentStatus = order.getIsActive() != null ? order.getIsActive() : true;
		order.setIsActive(!currentStatus);

		if (!currentStatus) {
			if (demoMode) {
				order.setNextRunDate(LocalDateTime.now());
			} else {
				order.setNextRunDate(LocalDate.now()
						.with(TemporalAdjusters.next(DayOfWeek.MONDAY))
						.atStartOfDay());
			}
		}

		return convertToDto(recurringOrderRepository.save(order));
	}
	
	private DtoRecurringOrder convertToDto(RecurringOrder entity) {
        DtoRecurringOrder dto = new DtoRecurringOrder();
        dto.setId(entity.getId());
        dto.setUserId(entity.getUser().getId());
        dto.setProductId(entity.getProduct().getId());
        dto.setProductName(entity.getProduct().getName());
        dto.setQuantity(entity.getQuantity());
        dto.setNextRunDate(entity.getNextRunDate());
        dto.setIsActive(entity.getIsActive());
        return dto;
    }
	
	@Override
	public List<DtoRecurringOrder> getAllRecurringOrders() {
		List<RecurringOrder> list = recurringOrderRepository.findAll();
		List<DtoRecurringOrder> dtoList = new ArrayList<>();
		for (RecurringOrder item : list) {
		    dtoList.add(convertToDto(item));
		}
		return dtoList;
	}
	

}
