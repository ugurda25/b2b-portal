package com.ugurgiyim.controller;

import java.util.List;

import com.ugurgiyim.dto.DtoOrder;
import com.ugurgiyim.dto.DtoOrderIU;

public interface IOrderController {
	public DtoOrder saveOrder(DtoOrderIU dtoOrderIU);

	public List<DtoOrder> getAllOrders();

	public DtoOrder getOrderById(Integer id);
	public DtoOrder cancelOrder(Integer id);
	public DtoOrder updateOrderStatus(Integer id,String status);
	public List<DtoOrder> getOrdersByUserId(Integer userId);
	
	

}
