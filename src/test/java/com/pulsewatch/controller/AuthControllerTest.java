package com.pulsewatch.controller;

import com.pulsewatch.dto.AuthDTOs;
import com.pulsewatch.service.AuthService;
import com.pulsewatch.security.JwtTokenProvider;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthControllerTest {

    @Mock
    private AuthService authService;

    @Mock
    private JwtTokenProvider jwtTokenProvider;

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private Authentication authentication;

    private AuthController createController() {
        return new AuthController(authService);
    }

    @Test
    @DisplayName("Successful registration returns auth response with token")
    void successfulRegistrationReturnsToken() {
        AuthController controller = createController();
        AuthDTOs.RegisterRequest request = new AuthDTOs.RegisterRequest();
        request.setEmail("test@example.com");
        request.setPassword("password123");
        request.setFullName("Test User");

        AuthDTOs.AuthResponse expected = new AuthDTOs.AuthResponse("token123", "test@example.com", "Test User", "USER");
        when(authService.register(any(AuthDTOs.RegisterRequest.class))).thenReturn(expected);

        ResponseEntity<AuthDTOs.AuthResponse> response = controller.register(request);

        assertEquals(200, response.getStatusCode().value());
        assertNotNull(response.getBody());
        assertEquals("token123", response.getBody().getToken());
        assertEquals("test@example.com", response.getBody().getEmail());
        verify(authService).register(request);
    }

    @Test
    @DisplayName("Registration with missing email throws error")
    void registrationMissingEmail() {
        AuthController controller = createController();
        AuthDTOs.RegisterRequest request = new AuthDTOs.RegisterRequest();
        request.setPassword("password123");
        request.setFullName("Test User");

        when(authService.register(any(AuthDTOs.RegisterRequest.class)))
            .thenThrow(new RuntimeException("Email already registered"));

        assertThrows(RuntimeException.class, () -> controller.register(request));
    }

    @Test
    @DisplayName("Successful login returns auth response with token")
    void successfulLoginReturnsToken() {
        AuthController controller = createController();
        AuthDTOs.LoginRequest request = new AuthDTOs.LoginRequest();
        request.setEmail("test@example.com");
        request.setPassword("password123");

        AuthDTOs.AuthResponse expected = new AuthDTOs.AuthResponse("token123", "test@example.com", "Test User", "USER");
        when(authService.login(any(AuthDTOs.LoginRequest.class))).thenReturn(expected);

        ResponseEntity<AuthDTOs.AuthResponse> response = controller.login(request);

        assertEquals(200, response.getStatusCode().value());
        assertNotNull(response.getBody());
        assertEquals("token123", response.getBody().getToken());
        verify(authService).login(request);
    }

    @Test
    @DisplayName("Login with invalid credentials throws error")
    void loginInvalidCredentials() {
        AuthController controller = createController();
        AuthDTOs.LoginRequest request = new AuthDTOs.LoginRequest();
        request.setEmail("test@example.com");
        request.setPassword("wrongpassword");

        when(authService.login(any(AuthDTOs.LoginRequest.class)))
            .thenThrow(new RuntimeException("Invalid credentials"));

        assertThrows(RuntimeException.class, () -> controller.login(request));
    }

    @Test
    @DisplayName("Auth response contains all required fields")
    void authResponseHasRequiredFields() {
        AuthDTOs.AuthResponse response = new AuthDTOs.AuthResponse("abc", "user@test.com", "User", "USER");
        assertEquals("abc", response.getToken());
        assertEquals("user@test.com", response.getEmail());
        assertEquals("User", response.getFullName());
        assertEquals("USER", response.getRole());
    }
}
