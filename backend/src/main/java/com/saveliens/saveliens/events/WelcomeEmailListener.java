
package com.saveliens.saveliens.events;

import com.saveliens.saveliens.services.EmailService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

@Slf4j
@Component
@RequiredArgsConstructor
public class WelcomeEmailListener {

    private final EmailService emailService;

    @Async
    @TransactionalEventListener(
            phase = TransactionPhase.AFTER_COMMIT
    )
    public void onAccountCreated(
            AccountCreatedEvent event
    ) {
        try {
            emailService.sendWelcomeEmail(
                    event.email(),
                    event.firstName()
            );

            log.info(
                    "Welcome email submitted for user {}",
                    event.userId()
            );
        } catch (Exception exception) {
            log.error(
                    "Welcome email submission failed for user {}",
                    event.userId(),
                    exception
            );
        }
    }
}
