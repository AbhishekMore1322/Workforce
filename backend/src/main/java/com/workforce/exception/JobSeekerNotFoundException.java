package com.workforce.exception;

public class JobSeekerNotFoundException extends RuntimeException {
    public JobSeekerNotFoundException(String message) {
        super(message);
    }
}