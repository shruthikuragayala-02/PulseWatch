package com.pulsewatch.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.Authentication;
import jakarta.annotation.PostConstruct;

import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class JwtTokenProvider {

    @Value("${jwt.secret}")
    private String secretKey;

    @Value("${jwt.expiration}")
    private long expiration;

    private byte[] signingKeyBytes;

    @PostConstruct
    public void validateSecret() {
        if (secretKey == null || secretKey.isBlank()) {
            throw new IllegalStateException("JWT secret must be configured");
        }
        byte[] key;
        try {
            key = Decoders.BASE64.decode(secretKey);
        } catch (Exception e) {
            // Some environments (e.g. Render generateValue) produce a raw
            // alphanumeric secret that is not valid Base64. Fall back to the
            // raw UTF-8 bytes so the secret still works.
            key = secretKey.getBytes(StandardCharsets.UTF_8);
        }
        if (key.length < 32) {
            throw new IllegalStateException("JWT secret must be at least 256 bits");
        }
        this.signingKeyBytes = key;
    }

    private byte[] getSigningKey() {
        return signingKeyBytes;
    }

    public String generateToken(String username, List<String> roles) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + expiration);

        return Jwts.builder()
            .subject(username)
            .claim("roles", roles)
            .issuedAt(now)
            .expiration(expiryDate)
            .signWith(Keys.hmacShaKeyFor(getSigningKey()))
            .compact();
    }

    public String extractUsername(String token) {
        return extractClaims(token).getSubject();
    }

    public List<SimpleGrantedAuthority> extractAuthorities(String token) {
        List<String> roles = extractClaims(token).get("roles", List.class);
        return roles.stream()
            .map(SimpleGrantedAuthority::new)
            .collect(Collectors.toList());
    }

    public boolean validateToken(String token) {
        try {
            extractClaims(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    private Claims extractClaims(String token) {
        return Jwts.parser()
            .verifyWith(Keys.hmacShaKeyFor(getSigningKey()))
            .build()
            .parseSignedClaims(token)
            .getPayload();
    }
}