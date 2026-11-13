
package com.saveliens.saveliens.events;

import com.saveliens.saveliens.services.EmailService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionalEventListener;
import org.springframework.transaction.event.TransactionPhase;

@Slf4j
@Component
@RequiredArgsConstructor
public class PasswordResetNotificationListener {

    private final EmailService emailService;

    @Async
    @TransactionalEventListener(
            phase = TransactionPhase.AFTER_COMMIT
    )
    public void onPasswordResetRequested(
            PasswordResetRequestedEvent event
    ) {
        try {
            emailService.sendPasswordResetEmail(
                    event.email(),
                    event.firstName(),
                    event.resetUrl()
            );

            log.info(
                    "Password reset email submitted for user {}",
                    event.userId()
            );
        } catch (Exception exception) {
            log.error(
                    "Password reset email failed for user {}",
                    event.userId(),
                    exception
            );
        }
    }

    @Async
    @TransactionalEventListener(
            phase = TransactionPhase.AFTER_COMMIT
    )
    public void onPasswordResetCompleted(
            PasswordResetCompletedEvent event
    ) {
        try {
            emailService.sendPasswordResetConfirmation(
                    event.email(),
                    event.firstName()
            );

            log.info(
                    "Password reset confirmation submitted for user {}",
                    event.userId()
            );
        } catch (Exception exception) {
            log.error(
                    "Password reset confirmation failed for user {}",
                    event.userId(),
                    exception
            );
        }
    }
}
