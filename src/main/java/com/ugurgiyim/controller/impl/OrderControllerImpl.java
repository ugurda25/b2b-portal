package com.ugurgiyim.controller.impl;

import com.ugurgiyim.service.IOrderService;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.ugurgiyim.controller.IOrderController;
import com.ugurgiyim.dto.DtoOrder;
import com.ugurgiyim.dto.DtoOrderIU;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/Orders")
@CrossOrigin(origins = "*")
public class OrderControllerImpl implements IOrderController {

	@Autowired
	private IOrderService orderService;

	@PostMapping("/save")
	@Override
	public DtoOrder saveOrder(@RequestBody @Valid DtoOrderIU dtoOrderIU) {
		return orderService.saveOrder(dtoOrderIU);
	}

	@GetMapping("/list")
	@Override
	public List<DtoOrder> getAllOrders() {

		return orderService.getAllOrders();
	}

	@GetMapping("/list/{id}")
	@Override
	public DtoOrder getOrderById(@PathVariable(name = "id") Integer id) {
		
		return orderService.getOrderById(id);
	}

	@PutMapping("/cancel/{id}")
	@Override
	public DtoOrder cancelOrder(@PathVariable(name="id")  Integer id) {
		return orderService.cancelOrder(id);
	}

	@PutMapping("/update-status/{id}")
	@Override
	public DtoOrder updateOrderStatus(@PathVariable(name="id")  Integer id, @RequestParam String status) {
		
		return orderService.updateOrderStatus(id, status);
	}

	@Override
	@GetMapping("/user/{userId}")
	public List<DtoOrder> getOrdersByUserId(@PathVariable Integer userId) {
		
		return orderService.getOrdersByUserId(userId);
	}

}
