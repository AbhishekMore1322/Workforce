package com.workforce.service;

import com.workforce.dto.ForgotPasswordRequest;
import com.workforce.dto.ResetPasswordRequest;
import com.workforce.dto.SignupRequest;

public interface AuthService {

    void signup(SignupRequest request);

    void forgotPassword(ForgotPasswordRequest request);

    void resetPassword(ResetPasswordRequest request);

    void logout();
}
