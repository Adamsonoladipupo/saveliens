package com.saveliens.saveliens.security;

import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.Instant;
import java.util.Base64;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class OAuthExchangeService {

    private record PendingExchange(
            String userId,
            Instant expiresAt
    ) {}

    private final Map<String, PendingExchange> pending =
            new ConcurrentHashMap<>();

    private final SecureRandom random = new SecureRandom();

    public String create(String userId) {
        byte[] bytes = new byte[32];
        random.nextBytes(bytes);

        String code = Base64.getUrlEncoder()
                .withoutPadding()
                .encodeToString(bytes);

        pending.put(
                code,
                new PendingExchange(
                        userId,
                        Instant.now().plusSeconds(60)
                )
        );

        return code;
    }

    public String consume(String code) {
        if (code == null) {
            throw new IllegalArgumentException("Invalid OAuth code");
        }

        PendingExchange exchange = pending.remove(code);

        if (exchange == null ||
                Instant.now().isAfter(exchange.expiresAt())) {
            throw new IllegalArgumentException(
                    "Invalid or expired OAuth code"
            );
        }

        return exchange.userId();
    }
}