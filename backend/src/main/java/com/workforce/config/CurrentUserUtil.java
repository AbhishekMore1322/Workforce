package com.workforce.config;

import com.workforce.entity.AuthUser;
import com.workforce.enums.Role;
import com.workforce.repository.AuthUserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
@Component
public class CurrentUserUtil {

    @Autowired
    private AuthUserRepository repository;

    public AuthUser getCurrentUser() {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null ||
            authentication instanceof AnonymousAuthenticationToken) {
            return null;
        }
        return repository.findById(authentication.getName())
                .orElseThrow(() ->
                        new IllegalStateException("Authenticated user not found"));
    }

    public Role getCurrentUserRole() {

        AuthUser user = getCurrentUser();

        if (user.getAuthorities() == null || user.getAuthorities().isEmpty()) {
            throw new IllegalStateException("Authenticated user has no roles");
        }

        return user.getAuthorities()
                   .iterator()
                   .next()
                   .getAuthority();
    }
}
