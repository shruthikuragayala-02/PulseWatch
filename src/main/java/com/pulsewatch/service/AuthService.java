package com.pulsewatch.service;

import com.pulsewatch.dto.AuthDTOs;
import com.pulsewatch.entity.User;
import com.pulsewatch.repository.UserRepository;
import com.pulsewatch.security.JwtTokenProvider;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder,
                       AuthenticationManager authenticationManager, JwtTokenProvider tokenProvider) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.tokenProvider = tokenProvider;
    }

    @Transactional
    public AuthDTOs.AuthResponse register(AuthDTOs.RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered");
        }

        User user = new User();
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setFullName(request.getFullName());
        user.setRole("USER");

        User savedUser = userRepository.save(user);

        List<String> roles = List.of("ROLE_" + savedUser.getRole());
        String token = tokenProvider.generateToken(savedUser.getEmail(), roles);

        return new AuthDTOs.AuthResponse(token, savedUser.getEmail(), savedUser.getFullName(), savedUser.getRole());
    }

    public AuthDTOs.AuthResponse login(AuthDTOs.LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        User user = userRepository.findByEmail(request.getEmail())
            .orElseThrow(() -> new RuntimeException("User not found"));

        List<String> roles = user.getRole() != null
            ? List.of("ROLE_" + user.getRole())
            : List.of("ROLE_USER");
        String token = tokenProvider.generateToken(user.getEmail(), roles);

        return new AuthDTOs.AuthResponse(token, user.getEmail(), user.getFullName(), user.getRole());
    }
}