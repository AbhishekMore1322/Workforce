package com.workforce.service.impl;

import com.workforce.dto.ForgotPasswordRequest;
import com.workforce.dto.NotificationRequest;
import com.workforce.dto.ResetPasswordRequest;
import com.workforce.dto.SignupRequest;
import com.workforce.entity.AuthUser;
import com.workforce.entity.Authority;
import com.workforce.enums.NotificationCategory;
import com.workforce.exception.DuplicateUserException;
import com.workforce.repository.AuthUserRepository;
import com.workforce.service.AuthService;
import com.workforce.service.NotificationService;

import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Random;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final AuthUserRepository authUserRepository;
    private final PasswordEncoder passwordEncoder;
    private final NotificationService notificationService;

    private static class OtpEntry {
        private final String otp;
        private final long expiresAt;

        OtpEntry(String otp, long expiresAt) {
            this.otp = otp;
            this.expiresAt = expiresAt;
        }
    }

    private final ConcurrentHashMap<String, OtpEntry> resetOtps =
            new ConcurrentHashMap<>();


    @Override
    public void signup(SignupRequest request) {

        if (authUserRepository.existsById(request.getUsername())) {
            throw new DuplicateUserException("Username already exists");
        }

        if (authUserRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateUserException("Email already registered");
        }

        AuthUser user = new AuthUser();
        user.setUsername(request.getUsername());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setEnabled(true);
        user.setProvider("JDBC");
        user.setName(request.getName());
        user.setEmail(request.getEmail());

        Authority authority = new Authority();
        authority.setAuthority(request.getRole());
        authority.setAuthUser(user);

        user.setAuthorities(Set.of(authority));
        authUserRepository.save(user);
    }

    @Override
    public void forgotPassword(ForgotPasswordRequest request) {

        AuthUser user = authUserRepository
                .findByEmail(request.getEmail())
                .orElseThrow(() ->
                    new IllegalArgumentException(
                        "Email is not registered. Please create a new account."
                    )
                );

        
        String otp = String.valueOf(
            100000 + new Random().nextInt(900000)
        );

        
        long expiresAt = System.currentTimeMillis() + (5 * 60 * 1000);

        resetOtps.put(
            user.getUsername(),
            new OtpEntry(otp, expiresAt)
        );

        String message =
            "Password Reset\n\n" +
            "Your OTP is: " + otp + "\n\n" +
            "Valid for 5 minutes.\n" +
            "Do NOT share this OTP.";

        NotificationRequest notificationRequest =
            new NotificationRequest(
                user.getUsername(),
                message,
                NotificationCategory.COMPLIANCE,
                null
            );

        notificationService.send(notificationRequest);
    }


    @Override
    public void resetPassword(ResetPasswordRequest request) {

        // token field is now OTP
        String otp = request.getToken();
        String username = request.getUsername();

        OtpEntry entry = resetOtps.get(username);

        if (entry == null) {
            throw new IllegalArgumentException("OTP not found or already used");
        }

        if (System.currentTimeMillis() > entry.expiresAt) {
            resetOtps.remove(username);
            throw new IllegalArgumentException("OTP has expired");
        }

        if (!entry.otp.equals(otp)) {
            throw new IllegalArgumentException("Invalid OTP");
        }

        // ✅ One‑time use
        resetOtps.remove(username);

        AuthUser user = authUserRepository.findById(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        authUserRepository.save(user);
    }

    @Override
    public void logout() {
        // no-op
    }
}