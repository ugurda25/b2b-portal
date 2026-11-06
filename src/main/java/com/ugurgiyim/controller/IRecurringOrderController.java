package com.ugurgiyim.controller;

import java.util.List;

import com.ugurgiyim.dto.DtoRecurringOrder;
import com.ugurgiyim.dto.DtoRecurringOrderIU;

public interface IRecurringOrderController {
    DtoRecurringOrder createRecurringOrder(DtoRecurringOrderIU dtoRec);
    
    List<DtoRecurringOrder> getOrdersByUserId(Integer userId);
    
    String cancelRecurringOrder(Integer id);

    DtoRecurringOrder toggleRecurringOrderStatus(Integer id);
    
	public List<DtoRecurringOrder> getAllRecurringOrders();

}
