
package com.saveliens.saveliens.security;

import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Service;

import java.time.Duration;

@Service
public class RefreshTokenCookieService {

    private static final String COOKIE_NAME = "refresh_token";
    private static final String COOKIE_PATH = "/api/auth";

    public void setCookie(
            HttpHeaders headers,
            String refreshToken
    ) {
        ResponseCookie cookie = ResponseCookie
                .from(COOKIE_NAME, refreshToken)
                .httpOnly(true)
                .secure(true)
                .sameSite("Lax")
                .path(COOKIE_PATH)
                .maxAge(Duration.ofDays(7))
                .build();

        headers.add(HttpHeaders.SET_COOKIE, cookie.toString());
    }

    public void clearCookie(HttpHeaders headers) {
        ResponseCookie cookie = ResponseCookie
                .from(COOKIE_NAME, "")
                .httpOnly(true)
                .secure(true)
                .sameSite("Lax")
                .path(COOKIE_PATH)
                .maxAge(Duration.ZERO)
                .build();

        headers.add(HttpHeaders.SET_COOKIE, cookie.toString());
    }
}
