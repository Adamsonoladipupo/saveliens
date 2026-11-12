
package com.saveliens.saveliens.security;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class RefreshTokenUtilsTest {

    @Test
    void generatedTokensShouldBeUnique() {
        String first = RefreshTokenUtils.generateToken();
        String second = RefreshTokenUtils.generateToken();

        assertNotEquals(first, second);
    }

    @Test
    void generatedTokensShouldHaveExpectedLength() {
        String token = RefreshTokenUtils.generateToken();

        assertEquals(43, token.length());
    }

    @Test
    void hashingShouldBeDeterministic() {
        String token = RefreshTokenUtils.generateToken();

        assertEquals(
                RefreshTokenUtils.hashToken(token),
                RefreshTokenUtils.hashToken(token)
        );
    }

    @Test
    void hashShouldNotExposeRawToken() {
        String token = RefreshTokenUtils.generateToken();
        String hash = RefreshTokenUtils.hashToken(token);

        assertNotEquals(token, hash);
        assertEquals(64, hash.length());
    }

    @Test
    void emptyTokenShouldBeRejected() {
        assertThrows(
                IllegalArgumentException.class,
                () -> RefreshTokenUtils.hashToken("")
        );
    }
}
