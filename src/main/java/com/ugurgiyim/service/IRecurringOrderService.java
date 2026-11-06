package com.ugurgiyim.service;

import java.util.List;

import com.ugurgiyim.dto.DtoRecurringOrder;
import com.ugurgiyim.dto.DtoRecurringOrderIU;

public interface IRecurringOrderService {
    DtoRecurringOrder createRecurringOrder(DtoRecurringOrderIU dtoRec);
    
    List<DtoRecurringOrder> getOrdersByUserId(Integer userId);
    
    void cancelRecurringOrder(Integer id);

    DtoRecurringOrder toggleRecurringOrderStatus(Integer id);
    
    List<DtoRecurringOrder> getAllRecurringOrders();

}
