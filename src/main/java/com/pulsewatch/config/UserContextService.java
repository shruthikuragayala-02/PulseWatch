package com.pulsewatch.config;

import com.pulsewatch.entity.User;
import com.pulsewatch.repository.UserRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import jakarta.servlet.http.HttpServletRequest;

@Service
public class UserContextService {

    private final UserRepository userRepository;

    public UserContextService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public Long getCurrentUserId() {
        var request = ((ServletRequestAttributes) RequestContextHolder.currentRequestAttributes()).getRequest();
        String email = (String) request.getAttribute("userEmail");
        if (email == null) {
            return null;
        }
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));
        return user.getId();
    }

    public String getCurrentUserRole() {
        var request = ((ServletRequestAttributes) RequestContextHolder.currentRequestAttributes()).getRequest();
        String email = (String) request.getAttribute("userEmail");
        if (email == null) {
            return "USER";
        }
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));
        return user.getRole();
    }

    public boolean isCurrentUserAdmin() {
        return "ADMIN".equals(getCurrentUserRole());
    }
}