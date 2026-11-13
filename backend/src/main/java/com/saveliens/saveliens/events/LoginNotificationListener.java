
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
public class LoginNotificationListener {

    private final EmailService emailService;

    @Async
    @TransactionalEventListener(
            phase = TransactionPhase.AFTER_COMMIT
    )
    public void onLoginSucceeded(LoginSucceededEvent event) {
        try {
            emailService.sendLoginNotification(
                    event.email(),
                    event.firstName()
            );

            log.info(
                    "Login notification submitted for user {}",
                    event.userId()
            );
        } catch (Exception exception) {
            log.error(
                    "Login notification failed for user {}",
                    event.userId(),
                    exception
            );
        }
    }
}
