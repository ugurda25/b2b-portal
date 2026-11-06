package com.ugurgiyim.service;

import java.util.List;

import com.ugurgiyim.dto.DtoOrder;
import com.ugurgiyim.dto.DtoOrderIU;

public interface IOrderService {
	public DtoOrder saveOrder(DtoOrderIU dtoOrderIU);
	public List<DtoOrder> getAllOrders();
	public DtoOrder getOrderById(Integer id);
	public DtoOrder cancelOrder(Integer orderId);
	public DtoOrder updateOrderStatus(Integer orderId,String newStatus);
	List<DtoOrder> getOrdersByUserId(Integer userId);
	
	

}
