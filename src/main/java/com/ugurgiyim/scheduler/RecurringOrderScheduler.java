package com.ugurgiyim.scheduler;

import java.time.DayOfWeek;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.ugurgiyim.dto.DtoOrderDetailIU;
import com.ugurgiyim.dto.DtoOrderIU;
import com.ugurgiyim.entity.RecurringOrder;
import com.ugurgiyim.enums.OrderStatus;
import com.ugurgiyim.repository.RecurringOrderRepository;
import com.ugurgiyim.service.IOrderService;

import lombok.extern.slf4j.Slf4j;
@Component
@Slf4j
public class RecurringOrderScheduler {
	@Autowired
	private RecurringOrderRepository recurringOrderRepository;
	@Autowired
	 private IOrderService orderService;
	@Value("${recurring-order.demo-mode:false}")
	private boolean demoMode;
	
	@Scheduled(cron = "*/30 * * * * *")
	
	public void processRecurringOrders() {
		LocalDateTime currentDate = LocalDateTime.now();
		if (!demoMode && currentDate.getDayOfWeek() != DayOfWeek.MONDAY) {
			return;
		}

		log.info("Otomatik sipariş talimatları taranıyor. Mod: {}", demoMode ? "SUNUM" : "HAFTALIK");
		List<RecurringOrder> activeOrders = demoMode
				? recurringOrderRepository.findByIsActiveTrue()
				: recurringOrderRepository.findByIsActiveTrueAndNextRunDateLessThanEqual(currentDate);
		log.info("İşlenecek otomatik sipariş talimatı sayısı: {}", activeOrders.size());
		if(activeOrders.isEmpty()) {
			log.info("Aktif otomatik sipariş talimatı bulunamadı.");
			return;
		}
		for (RecurringOrder recurring : activeOrders) {
			try {
				log.info("Talimat işleniyor. Talimat ID: {} - Kullanıcı ID: {} - Sonraki tarih: {}",
						recurring.getId(), recurring.getUser().getId(), recurring.getNextRunDate());

				DtoOrderIU dtoOrderIU=new DtoOrderIU();
				dtoOrderIU.setUserId(recurring.getUser().getId());
				dtoOrderIU.setStatus(OrderStatus.PENDING);
				dtoOrderIU.setIsAutomated(true);
				
				List<DtoOrderDetailIU> details =new ArrayList<>();
				DtoOrderDetailIU detailIU= new DtoOrderDetailIU();
				detailIU.setProductId(recurring.getProduct().getId());
				detailIU.setQuantity(recurring.getQuantity());
				details.add(detailIU);
				
				dtoOrderIU.setOrderDetails(details);
				
				orderService.saveOrder(dtoOrderIU);
				setNextRunDate(recurring, currentDate);
				recurringOrderRepository.save(recurring);
				
				log.info("Otomatik sipariş başarıyla oluşturuldu! Kullanıcı ID: {} - Ürün ID: {}", recurring.getUser().getId(), recurring.getProduct().getId());
			} catch (Exception e) {
				setNextRunDate(recurring, currentDate);
		        recurringOrderRepository.save(recurring);

		        log.error("Otomatik sipariş oluşturulamadı. Talimat ID: {} - Kullanıcı ID: {} - Hata: {}",
		        		recurring.getId(), recurring.getUser().getId(), e.getMessage(), e);
			}
			
		}
	}

	private void setNextRunDate(RecurringOrder recurring, LocalDateTime currentDate) {
		if (demoMode) {
			recurring.setNextRunDate(currentDate.plusSeconds(30));
		} else {
			recurring.setNextRunDate(currentDate.plusWeeks(recurring.getPeriodInWeeks()));
		}
	}
 	

}
