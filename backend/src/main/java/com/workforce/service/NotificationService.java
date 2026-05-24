package com.workforce.service;

import com.workforce.dto.*;

import java.util.List;

public interface NotificationService {

    NotificationResponse send(NotificationRequest request);
    NotificationResponse markAsRead(Long notificationId);

    void delete(Long notificationId);

	List<NotificationResponse> getByUser(String username);
}