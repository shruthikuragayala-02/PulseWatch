package com.pulsewatch.security;

import io.jsonwebtoken.Jwts;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.DisplayName;

import java.lang.reflect.Field;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Regression tests for JwtTokenProvider secret handling.
 *
 * Verifies that the provider works with both Base64-encoded secrets and raw
 * alphanumeric secrets (e.g. Render's generateValue), and that short secrets
 * are rejected.
 */
class JwtTokenProviderTest {

    private JwtTokenProvider createProvider(String secret, long expiration) throws Exception {
        JwtTokenProvider provider = new JwtTokenProvider();
        Field secretField = JwtTokenProvider.class.getDeclaredField("secretKey");
        secretField.setAccessible(true);
        secretField.set(provider, secret);

        Field expField = JwtTokenProvider.class.getDeclaredField("expiration");
        expField.setAccessible(true);
        expField.setLong(provider, expiration);

        provider.validateSecret();
        return provider;
    }

    @Test
    @DisplayName("Valid Base64 secret (>= 32 bytes decoded) is accepted")
    void validBase64Secret() throws Exception {
        // 32 zero bytes encoded as Base64
        String base64 = java.util.Base64.getEncoder().encodeToString(new byte[32]);
        JwtTokenProvider provider = createProvider(base64, 86400000L);

        String token = provider.generateToken("user@example.com", List.of("ROLE_USER"));
        assertNotNull(token);
        assertTrue(provider.validateToken(token));
        assertEquals("user@example.com", provider.extractUsername(token));
    }

    @Test
    @DisplayName("Raw alphanumeric secret (non-Base64) falls back to UTF-8 bytes")
    void rawAlphanumericSecret() throws Exception {
        // Render generateValue produces a 56-char alphanumeric string which is
        // not valid Base64. The provider must still accept it.
        String rawSecret = "0zUou2NybuButKZrvqZCexeT3wT78OGo3hQYYRT0yMNDJvWIERnv91dF6Z1HJ5Jf";
        JwtTokenProvider provider = createProvider(rawSecret, 86400000L);

        String token = provider.generateToken("user@example.com", List.of("ROLE_USER"));
        assertNotNull(token);
        assertTrue(provider.validateToken(token));
        assertEquals("user@example.com", provider.extractUsername(token));
    }

    @Test
    @DisplayName("Token signed with raw secret is rejected when validated with a different raw secret")
    void differentRawSecretFailsValidation() throws Exception {
        JwtTokenProvider provider = createProvider("0zUou2NybuButKZrvqZCexeT3wT78OGo3hQYYRT0yMNDJvWIERnv91dF6Z1HJ5Jf", 86400000L);
        String token = provider.generateToken("user@example.com", List.of("ROLE_USER"));

        JwtTokenProvider other = createProvider("1zUou2NybuButKZrvqZCexeT3wT78OGo3hQYYRT0yMNDJvWIERnv91dF6Z1HJ5Jf", 86400000L);
        assertFalse(other.validateToken(token));
    }

    @Test
    @DisplayName("Secret shorter than 32 bytes is rejected")
    void shortSecretRejected() {
        IllegalStateException ex = assertThrows(IllegalStateException.class,
            () -> createProvider("short", 86400000L));
        assertTrue(ex.getMessage().contains("256 bits"));
    }

    @Test
    @DisplayName("Blank secret is rejected")
    void blankSecretRejected() {
        assertThrows(IllegalStateException.class, () -> createProvider("", 86400000L));
    }
}