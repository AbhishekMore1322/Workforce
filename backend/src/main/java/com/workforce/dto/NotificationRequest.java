package com.workforce.dto;

import com.workforce.enums.NotificationCategory;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class NotificationRequest {

    @NotNull(message = "User name is required")
    private String username;
    

    @NotBlank(message = "Message must not be blank")
    private String message;

    @NotNull(message = "Notification category is required")
    private NotificationCategory category;

    private Long entityID;
} 	