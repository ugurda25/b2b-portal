package com.ugurgiyim.controller.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ugurgiyim.dto.DtoAdminDashboard;
import com.ugurgiyim.service.IAdminDashboardService;

@RestController
@RequestMapping("/api/admin/dashboard")
@CrossOrigin(origins = "*")
public class AdminDashboardControllerImpl {

    @Autowired
    private IAdminDashboardService adminDashboardService;

    @GetMapping("/summary")
    public ResponseEntity<DtoAdminDashboard> getDashboardSummary() {
        return ResponseEntity.ok(adminDashboardService.getDashboardSummary());
    }
}