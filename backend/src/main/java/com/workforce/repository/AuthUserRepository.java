package com.workforce.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.workforce.entity.AuthUser;

@Repository
public interface AuthUserRepository
        extends JpaRepository<AuthUser, String> {
	Optional<AuthUser> findByUsername(String username);
	 boolean existsByEmail(String email);
	 Optional<AuthUser> findByEmail(String email);
}