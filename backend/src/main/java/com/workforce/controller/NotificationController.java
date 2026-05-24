package com.workforce.controller;

import com.workforce.api.APIResponse;
import com.workforce.dto.*;
import com.workforce.service.NotificationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService service;

    @PostMapping("/send")
    public APIResponse<NotificationResponse> send(
            @Valid @RequestBody NotificationRequest request) {

        return APIResponse.<NotificationResponse>builder()
                .status("SUCCESS")
                .message("Notification sent successfully")
                .data(service.send(request))
                .build();
    }

    @GetMapping("/{username}")
    public APIResponse<List<NotificationResponse>> byUser(
            @PathVariable String username) {

        return APIResponse.<List<NotificationResponse>>builder()
                .status("SUCCESS")
                .message("Notifications fetched")
                .data(service.getByUser(username))
                .build();
    }

   
    @PutMapping("/{id}/read")
    public APIResponse<NotificationResponse> read(
            @PathVariable Long id) {

        return APIResponse.<NotificationResponse>builder()
                .status("SUCCESS")
                .message("Notification marked as read")
                .data(service.markAsRead(id))
                .build();
    }

    @DeleteMapping("/{id}")
    public APIResponse<Void> delete(@PathVariable Long id) {

        service.delete(id);
        return APIResponse.<Void>builder()
                .status("SUCCESS")
                .message("Notification deleted")
                .data(null)
                .build();
    }
}