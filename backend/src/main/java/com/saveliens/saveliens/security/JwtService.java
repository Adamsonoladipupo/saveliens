
package com.saveliens.saveliens.security;

import com.saveliens.saveliens.data.models.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.util.Date;

@Service
public class JwtService {

    private final String secretKey;
    private final long accessTokenExpirationMs;

    public JwtService(
            @Value("${jwt.secret}") String secretKey,
            @Value("${jwt.access-token-expiration-ms:86400000}")
            long accessTokenExpirationMs
    ) {
        if (accessTokenExpirationMs <= 0) {
            throw new IllegalArgumentException(
                    "JWT expiration must be positive"
            );
        }

        this.secretKey = secretKey;
        this.accessTokenExpirationMs = accessTokenExpirationMs;
    }

    private byte[] getSigningKey() {
        return secretKey.getBytes(StandardCharsets.UTF_8);
    }

    public String generateToken(User user) {
        long now = System.currentTimeMillis();


        return Jwts.builder()
                .setSubject(user.getEmail())
                .claim("userId", user.getId())
                .claim("tokenVersion", user.getTokenVersion())
                .setIssuedAt(new Date(now))
                .setExpiration(
                        new Date(now + accessTokenExpirationMs)
                )
                .signWith(
                        Keys.hmacShaKeyFor(getSigningKey()),
                        SignatureAlgorithm.HS256
                )
                .compact();
    }

    public String extractEmail(String token) {
        return extractAllClaims(token).getSubject();
    }

    public int extractTokenVersion(String token) {
        Integer version = extractAllClaims(token)
                .get("tokenVersion", Integer.class);

        if (version == null) {
            throw new IllegalArgumentException(
                    "Token version is missing"
            );
        }

        return version;
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(
                        Keys.hmacShaKeyFor(getSigningKey())
                )
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
}
