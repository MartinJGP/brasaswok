package com.brasaswok.security.jwt;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

class JwtUtilsTest {

    private JwtUtils jwtUtils;

    @BeforeEach
    void setUp() {
        jwtUtils = new JwtUtils();
        ReflectionTestUtils.setField(jwtUtils, "jwtSecret", "404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970");
        ReflectionTestUtils.setField(jwtUtils, "jwtExpirationMs", 3600000L);
    }

    @Test
    void shouldGenerateAndValidateToken() {
        String token = jwtUtils.generateTokenFromUsername("chef_martin", "ROLE_ADMIN");

        assertNotNull(token);
        assertTrue(jwtUtils.validateJwtToken(token));
        assertEquals("chef_martin", jwtUtils.getUsernameFromToken(token));
    }

    @Test
    void shouldRejectInvalidToken() {
        assertFalse(jwtUtils.validateJwtToken("invalid.token.here"));
    }
}
