
package com.saveliens.saveliens.services;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.Map;

@Service
public class ResendEmailService implements EmailService {

    private final RestClient client;
    private final String apiKey;
    private final String from;
    private final String frontendUrl;

    public ResendEmailService(
            @Value("${saveliens.email.api-key:}") String apiKey,
            @Value("${saveliens.email.from:}") String from,
            @Value("${saveliens.app.frontend-url}") String frontendUrl
    ) {
        this.apiKey = apiKey;
        this.from = from;
        this.frontendUrl = frontendUrl;

        this.client = RestClient.builder()
                .baseUrl("https://api.resend.com")
                .build();
    }

    @Override
    public void sendWelcomeEmail(
            String email,
            String firstName
    ) {
        if (apiKey.isBlank() || from.isBlank()) {
            throw new IllegalStateException(
                    "Email provider is not configured"
            );
        }

        String safeName = escapeHtml(firstName);
        String dashboardUrl =
                frontendUrl.replaceAll("/+$", "")
                        + "/dashboard";

        String html = """
                <!DOCTYPE html>
                <html lang="en">
                <body style="margin:0;padding:32px;
                    background:#f7f7fb;
                    font-family:Arial,sans-serif;">
                  <div style="max-width:560px;margin:auto;
                      background:white;padding:32px;
                      border-radius:16px;">
                    <h1 style="color:#5b5fc7;">
                      Welcome to Saveliens!
                    </h1>
                    <p>Hi %s,</p>
                    <p>
                      Your account is ready. Saveliens
                      helps you save, organize, and
                      rediscover useful links.
                    </p>
                    <p>
                      Create your first topic and start
                      building your personal resource
                      library.
                    </p>
                    <a href="%s"
                       style="display:inline-block;
                       padding:12px 20px;
                       background:#5b5fc7;
                       color:white;
                       text-decoration:none;
                       border-radius:8px;">
                      Go to Dashboard
                    </a>
                    <p style="margin-top:32px;
                        color:#6b7280;font-size:13px;">
                      Thanks for joining Saveliens.
                    </p>
                  </div>
                </body>
                </html>
                """.formatted(
                safeName,
                dashboardUrl
        );

        client.post()
                .uri("/emails")
                .header(
                        HttpHeaders.AUTHORIZATION,
                        "Bearer " + apiKey
                )
                .contentType(MediaType.APPLICATION_JSON)
                .body(Map.of(
                        "from", from,
                        "to", email,
                        "subject", "Welcome to Saveliens!",
                        "html", html
                ))
                .retrieve()
                .toBodilessEntity();
    }

    private String escapeHtml(String value) {
        if (value == null || value.isBlank()) {
            return "there";
        }

        return value
                .replace("&", "&amp;")
                .replace("<", "&lt;")
                .replace(">", "&gt;")
                .replace("\"", "&quot;")
                .replace("'", "&#39;");
    }
}
