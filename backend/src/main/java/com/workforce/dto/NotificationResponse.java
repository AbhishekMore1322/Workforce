package com.workforce.dto;

import com.workforce.enums.NotificationCategory;
import com.workforce.enums.Status;
import lombok.*;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class NotificationResponse {

    private Long notificationID;
    private String username;
    private Long entityID;
    private String message;
    private NotificationCategory category;
    private Status status;
    private LocalDate createdDate;
}