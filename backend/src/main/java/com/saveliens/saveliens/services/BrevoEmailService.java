
package com.saveliens.saveliens.services;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.Map;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;

@Service
@ConditionalOnProperty(
        name = "saveliens.email.provider",
        havingValue = "brevo"
)
public class BrevoEmailService implements EmailService {

    private final RestClient client;
    private final String apiKey;
    private final String from;
    private final String frontendUrl;
    private final String senderName;

    public BrevoEmailService(
            @Value("${brevo.api.key:}") String apiKey,
            @Value("${brevo.sender.email:}") String from,
            @Value("${brevo.sender.name:Saveliens}") String senderName,
            @Value("${saveliens.app.frontend-url}") String frontendUrl
    ) {
        this.apiKey = apiKey;
        this.from = from;
        this.senderName = senderName;
        this.frontendUrl = frontendUrl;

        this.client = RestClient.builder()
                .baseUrl("https://api.brevo.com/v3")
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

        sendEmail(
                email,
                "Welcome to Saveliens!",
                html
        );
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


    @Override
    public void sendLoginNotification(
            String email,
            String firstName
    ) {
        String html = """
            <!DOCTYPE html>
            <html lang="en">
            <body style="margin:0;padding:32px;
                background:#f7f7fb;
                font-family:Arial,sans-serif;">
              <div style="max-width:560px;margin:auto;
                  background:white;padding:32px;
                  border-radius:16px;">
                <h2 style="color:#5b5fc7;">
                  New sign-in to Saveliens
                </h2>
                <p>Hi %s,</p>
                <p>
                  Your Saveliens account was
                  successfully signed in to.
                </p>
                <p>
                  If this was you, no action is required.
                </p>
                <p>
                  If you don't recognize this activity,
                  please change your password immediately.
                </p>
                <p style="color:#6b7280;font-size:13px;">
                  Saveliens Security
                </p>
              </div>
            </body>
            </html>
            """.formatted(escapeHtml(firstName));

        sendEmail(
                email,
                "Security alert: New Saveliens login",
                html
        );
    }

    @Override
    public void sendPasswordChangedNotification(
            String email,
            String firstName
    ) {
        String html = """
            <!DOCTYPE html>
            <html lang="en">
            <body style="margin:0;padding:32px;
                background:#f7f7fb;
                font-family:Arial,sans-serif;">
              <div style="max-width:560px;margin:auto;
                  background:white;padding:32px;
                  border-radius:16px;">
                <h2 style="color:#5b5fc7;">
                  Your password was changed
                </h2>
                <p>Hi %s,</p>
                <p>
                  The password for your Saveliens
                  account has been changed successfully.
                </p>
                <p>
                  Existing refresh sessions have been
                  revoked. Please sign in again.
                </p>
                <p>
                  If you didn't make this change,
                  your account may be compromised.
                  Contact Saveliens support immediately.
                </p>
                <p style="color:#6b7280;font-size:13px;">
                  Saveliens Security
                </p>
              </div>
            </body>
            </html>
            """.formatted(escapeHtml(firstName));

        sendEmail(
                email,
                "Security alert: Saveliens password changed",
                html
        );
    }

    private void sendEmail(
            String email,
            String subject,
            String html
    ) {
        if (apiKey.isBlank() || from.isBlank()) {
            throw new IllegalStateException(
                    "Brevo email provider is not configured"
            );
        }

        client.post()
                .uri("/smtp/email")
                .header("api-key", apiKey)
                .contentType(MediaType.APPLICATION_JSON)
                .body(Map.of(
                        "sender", Map.of(
                                "name", senderName,
                                "email", from
                        ),
                        "to", java.util.List.of(
                                Map.of("email", email)
                        ),
                        "subject", subject,
                        "htmlContent", html
                ))
                .retrieve()
                .toBodilessEntity();
    }


    @Override
    public void sendPasswordResetEmail(
            String email,
            String firstName,
            String resetUrl
    ) {
        String html = """
        <!DOCTYPE html>
        <html lang="en">
        <body style="margin:0;padding:32px;
            background:#f7f7fb;
            font-family:Arial,sans-serif;">
          <div style="max-width:560px;margin:auto;
              background:white;padding:32px;
              border-radius:16px;">
            <h2 style="color:#5b5fc7;">
              Reset your Saveliens password
            </h2>
            <p>Hi %s,</p>
            <p>
              We received a request to reset
              your Saveliens account password.
            </p>
            <p>
              Click the button below to choose
              a new password.
            </p>
            <a href="%s"
               style="display:inline-block;
               padding:12px 20px;
               background:#5b5fc7;
               color:white;
               text-decoration:none;
               border-radius:8px;">
              Reset Password
            </a>
            <p>
              This link expires in 15 minutes
              and can only be used once.
            </p>
            <p>
              If you didn't request this,
              you can safely ignore this email.
            </p>
            <p style="color:#6b7280;font-size:13px;">
              Saveliens Security
            </p>
          </div>
        </body>
        </html>
        """.formatted(
                escapeHtml(firstName),
                escapeHtml(resetUrl)
        );

        sendEmail(
                email,
                "Reset your Saveliens password",
                html
        );
    }

    @Override
    public void sendPasswordResetConfirmation(
            String email,
            String firstName
    ) {
        String html = """
        <!DOCTYPE html>
        <html lang="en">
        <body style="margin:0;padding:32px;
            background:#f7f7fb;
            font-family:Arial,sans-serif;">
          <div style="max-width:560px;margin:auto;
              background:white;padding:32px;
              border-radius:16px;">
            <h2 style="color:#5b5fc7;">
              Your password has been reset
            </h2>
            <p>Hi %s,</p>
            <p>
              Your Saveliens account password
              has been reset successfully.
            </p>
            <p>
              Your previous sessions have
              been invalidated. Please sign
              in with your new password.
            </p>
            <p>
              If you didn't perform this action,
              contact Saveliens support immediately.
            </p>
            <p style="color:#6b7280;font-size:13px;">
              Saveliens Security
            </p>
          </div>
        </body>
        </html>
        """.formatted(escapeHtml(firstName));

        sendEmail(
                email,
                "Security alert: Saveliens password reset",
                html
        );
    }


}
