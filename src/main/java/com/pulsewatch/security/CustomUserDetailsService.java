package com.pulsewatch.security;

import com.pulsewatch.entity.User;
import com.pulsewatch.repository.UserRepository;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    public CustomUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) {
        return userRepository.findByEmail(username)
            .map(this::buildUserDetails)
            .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + username));
    }

    private UserDetails buildUserDetails(User user) {
        var authorities = user.getRole() != null
            ? java.util.List.of(new SimpleGrantedAuthority("ROLE_" + user.getRole()))
            : java.util.List.of(new SimpleGrantedAuthority("ROLE_USER"));

        return new org.springframework.security.core.userdetails.User(
            user.getEmail(),
            user.getPassword(),
            user.getEnabled(),
            true, true, true,
            authorities
        );
    }
}