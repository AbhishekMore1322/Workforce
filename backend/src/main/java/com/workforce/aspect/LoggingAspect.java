package com.workforce.aspect;

import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.*;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import lombok.extern.slf4j.Slf4j;

@Aspect
@Component
@Order(1)
@Slf4j
public class LoggingAspect {

    @Before("execution(* com.workforce.service..*(..))")
    public void beforeService(JoinPoint jp) {
        log.info("SERVICE STARTED :: {}", jp.getSignature());
    }

    @AfterReturning("execution(* com.workforce.controller..*(..))")
    public void afterController(JoinPoint jp) {
        log.info("CONTROLLER SUCCESS :: {}", jp.getSignature());
    }
}