package com.workforce.service.impl;

import com.workforce.dto.NotificationRequest;
import com.workforce.dto.NotificationResponse;
import com.workforce.entity.AuthUser;
import com.workforce.entity.Notification;
import com.workforce.enums.Status;
import com.workforce.exception.NotificationNotFoundException;
import com.workforce.mapper.NotificationMapper;
import com.workforce.notification.EmailSender;
import com.workforce.repository.AuthUserRepository;
import com.workforce.repository.NotificationRepository;
import com.workforce.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository repository;
    private final AuthUserRepository authUserRepository;
    private final EmailSender emailSender;

    @Override
    public NotificationResponse send(NotificationRequest request) {

        AuthUser user = authUserRepository.findById(request.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Notification notification = new Notification();
        notification.setUser(user);
        notification.setEntityID(request.getEntityID());
        notification.setMessage(request.getMessage());
        notification.setCategory(request.getCategory());
        notification.setStatus(Status.ACTIVE);
        notification.setCreatedDate(LocalDate.now());

        Notification saved = repository.save(notification);

        // Send email
        emailSender.send(user.getEmail(), request.getMessage());

        return NotificationMapper.toResponse(saved);
    }

    @Override
    public List<NotificationResponse> getByUser(String username) {

        List<Notification> notifications =
                repository.findByUserUsername(username);

        List<NotificationResponse> responses = new ArrayList<>();

        for (Notification notification : notifications) {
            responses.add(NotificationMapper.toResponse(notification));
        }

        return responses;
    }

    @Override
    public NotificationResponse markAsRead(Long notificationId) {

        Notification notification = repository.findById(notificationId)
                .orElseThrow(() ->
                        new NotificationNotFoundException("Notification not found"));

        notification.setStatus(Status.COMPLETED);
        return NotificationMapper.toResponse(repository.save(notification));
    }

    @Override
    public void delete(Long notificationId) {

        Notification notification = repository.findById(notificationId)
                .orElseThrow(() ->
                        new NotificationNotFoundException("Notification not found"));

        // Soft delete
        notification.setStatus(Status.INACTIVE);
        repository.save(notification);
    }

	
}