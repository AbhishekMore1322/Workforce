package com.workforce.exception;

public class JobPostingNotFoundException extends RuntimeException {
    public JobPostingNotFoundException(String message) {
        super(message);
    }
}