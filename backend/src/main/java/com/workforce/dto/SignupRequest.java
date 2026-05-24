package com.workforce.dto;

import com.workforce.enums.Role;
import lombok.Data;

@Data
public class SignupRequest {

    private String name;
    private String email;
    private String username;
    private String password;
    private Role role;
}
