package com.workforce.aspect;

import com.workforce.config.CurrentUserUtil;
import com.workforce.entity.AuditLog;
import com.workforce.entity.AuthUser;
import com.workforce.repository.AuditLogRepository;
import lombok.RequiredArgsConstructor;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.After;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Aspect
@Component
@Order(2)
@RequiredArgsConstructor
public class AuditLogAspect {

    private final AuditLogRepository auditLogRepository;
    private final CurrentUserUtil currentUserUtil;

    @After("execution(* com.workforce.service..*(..))")
    public void logAfterServiceExecution(JoinPoint joinPoint) {

        AuthUser authUser = currentUserUtil.getCurrentUser();
        if (authUser == null) {
            return;
        }

        AuditLog log = new AuditLog();
        log.setUser(authUser); 
        log.setAction(joinPoint.getSignature().getName());
        log.setResource(joinPoint.getTarget()
                .getClass()
                .getSimpleName());
        log.setTimestamp(LocalDateTime.now());

        auditLogRepository.save(log);
    }
}