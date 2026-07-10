package com.grh.backend.service;

import com.grh.backend.entity.Role;
import com.grh.backend.entity.User;
import com.grh.backend.repository.UserRepository;
import com.grh.backend.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.grh.backend.repository.EmployeeRepository;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final EmployeeRepository employeeRepository;

    public String register(String username, String email, String password, Role role, Long employeeId) {
        if (userRepository.existsByUsername(username)) {
            throw new RuntimeException("Ce nom d'utilisateur existe déjà");
        }
        if (userRepository.existsByEmail(email)) {
            throw new RuntimeException("Cet email existe déjà");
        }

        User user = User.builder()
                .username(username)
                .email(email)
                .password(passwordEncoder.encode(password))
                .role(role)
                .build();

        if (employeeId != null) {
            employeeRepository.findById(employeeId).ifPresent(user::setEmployee);
        }

        userRepository.save(user);
        return jwtService.generateToken(user);
    }
    public String login(String username, String password) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(username, password)
        );
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
        return jwtService.generateToken(user);
    }
}