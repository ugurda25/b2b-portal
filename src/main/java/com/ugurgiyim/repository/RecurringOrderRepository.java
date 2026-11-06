package com.ugurgiyim.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ugurgiyim.entity.RecurringOrder;

@Repository
public interface RecurringOrderRepository extends JpaRepository<RecurringOrder, Integer> {
	List<RecurringOrder> findByIsActiveTrue();
	List<RecurringOrder> findByIsActiveTrueAndNextRunDateLessThanEqual(LocalDateTime currentDate);
	List<RecurringOrder> findByUserId(Integer userId);
}
