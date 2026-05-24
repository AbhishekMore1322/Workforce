package com.workforce.repository;

import com.workforce.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NotificationRepository
        extends JpaRepository<Notification, Long> {

	List<Notification> findByUserUsername(String username);
}