package com.grh.backend.dto;

import com.grh.backend.entity.Role;
import lombok.Data;

@Data
public class RegisterRequest {
    private String username;
    private String email;
    private String password;
    private Role role;
    private Long employeeId;
}