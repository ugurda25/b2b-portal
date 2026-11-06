package com.ugurgiyim.service.impl;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.ugurgiyim.dto.DtoOrder;
import com.ugurgiyim.dto.DtoOrderDetail;
import com.ugurgiyim.dto.DtoOrderIU;
import com.ugurgiyim.dto.DtoProduct;
import com.ugurgiyim.dto.DtoUser;
import com.ugurgiyim.dto.DtoOrderDetailIU;
import com.ugurgiyim.entity.Order;
import com.ugurgiyim.entity.OrderDetail;
import com.ugurgiyim.entity.Product;
import com.ugurgiyim.entity.User;
import com.ugurgiyim.repository.OrderDetailRepository;
import com.ugurgiyim.repository.OrderRepository;
import com.ugurgiyim.repository.ProductRepository;
import com.ugurgiyim.repository.UserRepository;
import com.ugurgiyim.service.ILoyaltyService;
import com.ugurgiyim.service.IOrderService;
import com.ugurgiyim.enums.OrderStatus;

@Service
public class OrderServiceImpl implements IOrderService {

	@Autowired
	private OrderRepository orderRepository;
	@Autowired
	private OrderDetailRepository orderDetailRepository;
	@Autowired
	private ProductRepository productRepository;
	@Autowired
	private UserRepository userRepository;
	@Autowired
	private ILoyaltyService loyaltyService;

	@Transactional(propagation = Propagation.REQUIRES_NEW)
	@Override
	public DtoOrder saveOrder(DtoOrderIU dtoOrderIU) {
		User user = userRepository.findById(dtoOrderIU.getUserId()).orElseThrow(
				() -> new RuntimeException("Sipariş verilecek kullanıcı bulunamadı! ID: " + dtoOrderIU.getUserId()));

		if (user.getIsActive() != null && !user.getIsActive()) {
			throw new RuntimeException("Hesabınız pasif durumdadır. Sipariş oluşturamazsınız!");
		}

		Order order = new Order();
		order.setUser(user);
		order.setOrderNumber("ORD-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
		order.setOrderDate(LocalDateTime.now());
		order.setStatus(dtoOrderIU.getStatus() != null ? dtoOrderIU.getStatus() : OrderStatus.PENDING);
		order.setIsAutomated(dtoOrderIU.getIsAutomated() != null ? dtoOrderIU.getIsAutomated() : false);

		int discountRate = loyaltyService.getLoyaltyInfoByUserId(user.getId()).getDiscountRate();
		//asıl ödenmesi gerekren tutarı hesaplarız
		BigDecimal discountMultiplier = BigDecimal.valueOf(100 - discountRate)
				.divide(BigDecimal.valueOf(100));
		BigDecimal calculatedTotalAmount = BigDecimal.ZERO;
		List<OrderDetail> savedDetails = new ArrayList<>();
		for (DtoOrderDetailIU detailIU : dtoOrderIU.getOrderDetails()) {
			Product product = productRepository.findByIdForUpdate(detailIU.getProductId()).orElseThrow(
					() -> new RuntimeException("Siparişteki ürün bulunamadı! ID: " + detailIU.getProductId()));

			if (product.getIsActive() != null && !product.getIsActive()) {
				throw new RuntimeException("Satışa kapalı ürün! '" + product.getName()
						+ "' isimli ürün şu anda pasiftir ve sipariş verilemez.");
			}

			if (product.getAvailableStock() < detailIU.getQuantity()) {
				throw new RuntimeException("Yetersiz stok! '" + product.getName() + "' ürünü için mevcut stok: "
						+ product.getAvailableStock() + ", istenen miktar" + detailIU.getQuantity());
			}

			//  Minimum Sipariş Miktarı Kontrolü
			if (product.getMinOrderQuantity() != null && detailIU.getQuantity() < product.getMinOrderQuantity()) {
				throw new RuntimeException("Minimum sipariş adedinin altında! '" + product.getName()
						+ "' ürünü için en az " + product.getMinOrderQuantity() + " adet sipariş vermelisiniz.");
			}

			product.setAvailableStock(product.getAvailableStock() - detailIU.getQuantity());

			productRepository.save(product);

			BigDecimal unitPrice = product.getWholeSalePrice()
					.multiply(discountMultiplier)
					.setScale(2, RoundingMode.HALF_UP);
			BigDecimal itemTotal = unitPrice.multiply(BigDecimal.valueOf(detailIU.getQuantity()));
			calculatedTotalAmount = calculatedTotalAmount.add(itemTotal);

			OrderDetail orderDetail = new OrderDetail();
			orderDetail.setProduct(product);
			orderDetail.setQuantity(detailIU.getQuantity());
			orderDetail.setUnitPrice(unitPrice);

			savedDetails.add(orderDetail);

		}
		BigDecimal currentBalance = user.getCurrentBalance() != null ? user.getCurrentBalance() : BigDecimal.ZERO;
		BigDecimal creditLimit = user.getCreditLimit() != null ? user.getCreditLimit() : BigDecimal.ZERO;
		BigDecimal newBalance = currentBalance.add(calculatedTotalAmount);

		if (creditLimit.compareTo(BigDecimal.ZERO) > 0 && newBalance.compareTo(creditLimit) > 0) {
			throw new RuntimeException(
					"Kredi limiti yetersiz! Mevcut Bakiyeniz: " + currentBalance + " TL, Sipariş Tutarı: "
							+ calculatedTotalAmount + " TL, Toplam Kredi Limitiniz: " + creditLimit + " TL");
		}
		// Limiti aşmıyorsa kullanıcının yeni bakiyesini güncelliyoruz
		user.setCurrentBalance(newBalance);
		userRepository.save(user);

		// Hesaplanan gerçek tutarı siparişe set edip kaydediyoruz
		order.setTotalAmount(calculatedTotalAmount);
		Order savedOrder = orderRepository.save(order);

		// Detayları sipariş ID'si ile veritabanına basıyoruz
		for (OrderDetail detail : savedDetails) {
			detail.setOrder(savedOrder);
			orderDetailRepository.save(detail);
		}
		return convertToDtoOrder(savedOrder, savedDetails);
	}

		private DtoOrder convertToDtoOrder(Order order, List<OrderDetail> details) {
			DtoOrder dtoOrder = new DtoOrder();
			BeanUtils.copyProperties(order, dtoOrder);
	
			if (order.getUser() != null) {
				DtoUser dtoUser = new DtoUser();
				BeanUtils.copyProperties(order.getUser(), dtoUser);
				dtoOrder.setUser(dtoUser);
			}
			if (details == null) {
				details = orderDetailRepository.findByOrderId(order.getId());
			}
			List<DtoOrderDetail> dtoList = new ArrayList<>();
			if (details != null) {
				for (OrderDetail detail : details) {
					dtoList.add(mapToDtoOrderDetail(detail));
				}
			}
			dtoOrder.setOrderDetails(dtoList);
			return dtoOrder;
	
		}

	private DtoOrderDetail mapToDtoOrderDetail(OrderDetail detail) {
		DtoOrderDetail dto = new DtoOrderDetail();
		dto.setId(detail.getId());
		dto.setQuantity(detail.getQuantity());
		dto.setUnitPrice(detail.getUnitPrice());

		if (detail.getProduct() != null) {
			DtoProduct dtoProduct = new DtoProduct();
			BeanUtils.copyProperties(detail.getProduct(), dtoProduct);
			dto.setProduct(dtoProduct);
		}
		return dto;
	}

	@Override
	public List<DtoOrder> getAllOrders() {
		List<Order> orderList = orderRepository.findAll();
		List<DtoOrder> dtoList = new ArrayList<>();
		for (Order order : orderList) {
			dtoList.add(convertToDtoOrder(order, null));
		}
		return dtoList;
	}

	@Override
	public DtoOrder getOrderById(Integer id) {
		Order order = orderRepository.findById(id)
				.orElseThrow(() -> new RuntimeException("Sipariş bulunamadı! ID: " + id));
		return convertToDtoOrder(order, null);
	}
	@Override
	public List<DtoOrder> getOrdersByUserId(Integer userId) {
	    // 1. Veritabanından o kullanıcıya ait siparişleri çek
	    List<Order> orderList = orderRepository.findByUserId(userId);
	    
	    // 2. DTO listesine dönüştür
	    List<DtoOrder> dtoList = new ArrayList<>();
	    for (Order order : orderList) {
	        dtoList.add(convertToDtoOrder(order, null));
	    }
	    
	    return dtoList;
	}

	@Transactional
	@Override
	public DtoOrder cancelOrder(Integer orderId) {
		Order order=orderRepository.findById(orderId).orElseThrow(() -> new RuntimeException("İptal edilecek sipariş bulunamadı! ID: " + orderId));
		
		if (order.getStatus() == OrderStatus.CANCELED) {
		    throw new RuntimeException("Bu sipariş zaten daha önce iptal edilmiş!");
		}
		order.setStatus(OrderStatus.CANCELED);
		
		User user=order.getUser();
		if(user !=null && order.getTotalAmount() !=null) {
			BigDecimal currentBalance = user.getCurrentBalance() !=null ? user.getCurrentBalance() : BigDecimal.ZERO;
			BigDecimal newBalance= currentBalance.subtract(order.getTotalAmount());
			
			if(newBalance.compareTo(BigDecimal.ZERO)< 0) {
				newBalance=BigDecimal.ZERO;
				
			}
			user.setCurrentBalance(newBalance);
			userRepository.save(user);
			
		}
		List<OrderDetail> details = orderDetailRepository.findByOrderId(orderId);
        if (details != null) {
            for (OrderDetail detail : details) {
                Product product = detail.getProduct();
                if (product != null) {
                    product.setAvailableStock(product.getAvailableStock() + detail.getQuantity());
                    productRepository.save(product);
                }
            }
        }
		Order updatedOrder= orderRepository.save(order);
		return convertToDtoOrder(updatedOrder, details);
	}

	@Override
	public DtoOrder updateOrderStatus(Integer orderId, String newStatus) {
		Order order=orderRepository.findById(orderId).orElseThrow(() -> new RuntimeException("Sipariş bulunamadı! ID: " + orderId));
		
		OrderStatus statusEnum = OrderStatus.valueOf(newStatus.toUpperCase());
		if (statusEnum == OrderStatus.CANCELED) {
		    return cancelOrder(orderId);
		}
		order.setStatus(statusEnum);
		Order updatedOrder=orderRepository.save(order);
		return convertToDtoOrder(updatedOrder, null);
	}

}
