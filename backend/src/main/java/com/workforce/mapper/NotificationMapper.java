package com.workforce.mapper;

import com.workforce.dto.NotificationResponse;
import com.workforce.entity.Notification;

public class NotificationMapper {

    public static NotificationResponse toResponse(Notification notification) {
        return new NotificationResponse(
                notification.getNotificationID(),
                notification.getUser().getUsername(),
                notification.getEntityID(),
                notification.getMessage(),
                notification.getCategory(),
                notification.getStatus(),
                notification.getCreatedDate()
        );
    }
}