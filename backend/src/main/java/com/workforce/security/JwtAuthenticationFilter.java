package com.workforce.security;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import org.springframework.security.authentication.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.workforce.dto.LoginRequest;
import com.workforce.entity.Employer;
import com.workforce.entity.JobSeeker;
import com.workforce.repository.EmployerRepository;
import com.workforce.repository.JobSeekerRepository;
import com.fasterxml.jackson.databind.ObjectMapper;

import jakarta.servlet.FilterChain;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

public class JwtAuthenticationFilter
        extends UsernamePasswordAuthenticationFilter {

    private final AuthenticationManager authManager;
    private final JwtUtil jwtUtil;
    private final EmployerRepository employerRepository;
    private final JobSeekerRepository jobSeekerRepository;

    public JwtAuthenticationFilter(
            AuthenticationManager authManager,
            JwtUtil jwtUtil,
            EmployerRepository employerRepository,
            JobSeekerRepository jobSeekerRepository) {

        this.authManager = authManager;
        this.jwtUtil = jwtUtil;
        this.employerRepository = employerRepository;
        this.jobSeekerRepository = jobSeekerRepository;
    }

    @Override
    public Authentication attemptAuthentication(
            HttpServletRequest request,
            HttpServletResponse response) {

        try {
            LoginRequest creds =
                    new ObjectMapper().readValue(
                            request.getInputStream(),
                            LoginRequest.class
                    );

            return authManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            creds.getUsername(),
                            creds.getPassword()
                    )
            );
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
    @Override
    protected void successfulAuthentication(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain chain,
            Authentication authResult) throws IOException {

        String username = authResult.getName();
        String token = jwtUtil.generateToken(username);

        String role = authResult.getAuthorities()
                .iterator()
                .next()
                .getAuthority();

        Map<String, Object> responseBody = new HashMap<>();
        responseBody.put("token", token);
        responseBody.put("role", role);
        responseBody.put("username", username);

        // ✅ Attach domain context ONLY if profile exists
        if ("EMPLOYER".equals(role)) {
            Employer employer = employerRepository.findByUser_Username(username);
            if (employer != null) {
                responseBody.put("employerId", employer.getEmployerID());
            }
        }

        if ("JOB_SEEKER".equals(role)) {
            JobSeeker seeker = jobSeekerRepository.findByUser_Username(username);
            if (seeker != null) {
                responseBody.put("jobSeekerId", seeker.getSeekerID());
            }
        }

        response.setContentType("application/json");
        new ObjectMapper().writeValue(response.getWriter(), responseBody);
    }
}
