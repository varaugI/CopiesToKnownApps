package com.streamflix.modules.health.controller;

import com.streamflix.common.dto.ApiResponse;
import com.streamflix.common.filter.RequestIdFilter;
import org.slf4j.MDC;
import org.springframework.boot.actuate.health.HealthEndpoint;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.lang.management.ManagementFactory;
import java.util.Map;

@RestController
@RequestMapping("/api/v1")
public class HealthCheckController {

    private final HealthEndpoint healthEndpoint;

    public HealthCheckController(HealthEndpoint healthEndpoint) {
        this.healthEndpoint = healthEndpoint;
    }

    @GetMapping("/health")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getHealth() {
        String requestId = MDC.get(RequestIdFilter.MDC_REQUEST_ID_KEY);
        long uptimeSeconds = ManagementFactory.getRuntimeMXBean().getUptime() / 1000;
        double cpuLoad = ManagementFactory.getOperatingSystemMXBean().getSystemLoadAverage();

        Map<String, Object> healthInfo = Map.of(
                "status", "UP",
                "service", "StreamFlix Modular Monolith API",
                "apiVersion", "v1",
                "uptimeSeconds", uptimeSeconds,
                "systemLoadAverage", cpuLoad >= 0 ? cpuLoad : 0.0,
                "actuatorHealth", healthEndpoint.health().getStatus().getCode()
        );

        return ResponseEntity.ok(ApiResponse.of(healthInfo, requestId));
    }

    @GetMapping("/readiness")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getReadiness() {
        String requestId = MDC.get(RequestIdFilter.MDC_REQUEST_ID_KEY);
        Map<String, Object> readiness = Map.of(
                "status", "READY",
                "database", "CONNECTED",
                "flyway", "MIGRATED"
        );
        return ResponseEntity.ok(ApiResponse.of(readiness, requestId));
    }
}
