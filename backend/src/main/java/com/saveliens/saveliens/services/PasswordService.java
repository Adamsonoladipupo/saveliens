
package com.saveliens.saveliens.services;

import com.saveliens.saveliens.data.models.User;
import com.saveliens.saveliens.data.repositories.UserRepository;
import com.saveliens.saveliens.dtos.requests.ChangePasswordRequestDto;
import com.saveliens.saveliens.events.PasswordChangedEvent;
import com.saveliens.saveliens.security.RefreshTokenService;

import org.springframework.context.ApplicationEventPublisher;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;



@Service
public class PasswordService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final RefreshTokenService refreshTokenService;
    private final ApplicationEventPublisher eventPublisher;

    public PasswordService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            RefreshTokenService refreshTokenService,
            ApplicationEventPublisher eventPublisher
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.refreshTokenService = refreshTokenService;
        this.eventPublisher = eventPublisher;
    }

    @Transactional
    public void changePassword(
            String email,
            ChangePasswordRequestDto request
    ) {
        if (request == null ||
                request.currentPassword() == null ||
                request.newPassword() == null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Current and new passwords are required"
            );
        }

        String newPassword = request.newPassword();

        if (newPassword.length() < 12 ||
                newPassword.length() > 128) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "New password must contain 12 to 128 characters"
            );
        }

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.UNAUTHORIZED,
                                "Authentication required"
                        )
                );

        if (user.getPassword() == null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Password changes are unavailable for this account"
            );
        }

        if (!passwordEncoder.matches(
                request.currentPassword(),
                user.getPassword()
        )) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Current password is incorrect"
            );
        }

        if (passwordEncoder.matches(
                newPassword,
                user.getPassword()
        )) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "New password must differ from current password"
            );
        }

        user.setPassword(
                passwordEncoder.encode(newPassword)
        );

        user.setTokenVersion(
                user.getTokenVersion() + 1
        );

        userRepository.save(user);

        refreshTokenService.revokeAllForUser(
                user.getId()
        );
        eventPublisher.publishEvent(
                new PasswordChangedEvent(
                        user.getId(),
                        user.getFirstName(),
                        user.getEmail()
                )
        );
    }
}
