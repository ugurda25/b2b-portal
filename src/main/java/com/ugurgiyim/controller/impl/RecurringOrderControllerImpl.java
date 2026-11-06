package com.ugurgiyim.controller.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ugurgiyim.controller.IRecurringOrderController;
import com.ugurgiyim.dto.DtoRecurringOrder;
import com.ugurgiyim.dto.DtoRecurringOrderIU;
import com.ugurgiyim.service.IRecurringOrderService;

@RestController
@RequestMapping("/api/recurring-orders")
@CrossOrigin(origins = "*")
public class RecurringOrderControllerImpl implements IRecurringOrderController {

    @Autowired
    private IRecurringOrderService recurringOrderService;

	@Override
	@PostMapping("/save")
	public DtoRecurringOrder createRecurringOrder(@RequestBody  DtoRecurringOrderIU dtoRec) {
		
		return recurringOrderService.createRecurringOrder(dtoRec);
	}

	@Override
	@GetMapping("/user/{userId}")
	public List<DtoRecurringOrder> getOrdersByUserId(@PathVariable Integer userId) {
		
		return recurringOrderService.getOrdersByUserId(userId);
	}

	@Override
	@PutMapping("/cancel/{id}")
	public String cancelRecurringOrder(@PathVariable  Integer id) {
		
		recurringOrderService.cancelRecurringOrder(id);
		return "Otomatik sipariş talimatı başarıyla pasife alındı.";
		
	}

	@Override
	@PutMapping("/toggle-status/{id}")
	public DtoRecurringOrder toggleRecurringOrderStatus(@PathVariable Integer id) {
		return recurringOrderService.toggleRecurringOrderStatus(id);
	}
	
	@Override
	@GetMapping("/list")
	public List<DtoRecurringOrder> getAllRecurringOrders() {
		return recurringOrderService.getAllRecurringOrders();
	}
}
