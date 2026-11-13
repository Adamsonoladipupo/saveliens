
package com.saveliens.saveliens.services;

import com.saveliens.saveliens.data.models.User;
import com.saveliens.saveliens.data.repositories.UserRepository;
import com.saveliens.saveliens.dtos.requests.ChangePasswordRequestDto;
import com.saveliens.saveliens.events.PasswordChangedEvent;
import com.saveliens.saveliens.security.RefreshTokenService;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.server.ResponseStatusException;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PasswordServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private RefreshTokenService refreshTokenService;

    @Mock
    private ApplicationEventPublisher eventPublisher;

    @InjectMocks
    private PasswordService passwordService;

    private User user;

    private static final String EMAIL = "test@example.com";
    private static final String CURRENT_PASSWORD = "OldPassword123!";
    private static final String NEW_PASSWORD = "NewPassword456!";
    private static final String OLD_HASH = "old-bcrypt-hash";
    private static final String NEW_HASH = "new-bcrypt-hash";

    @BeforeEach
    void setUp() {
        user = new User();
        user.setId("test-user-id");
        user.setFirstName("Test");
        user.setLastName("User");
        user.setEmail(EMAIL);
        user.setPassword(OLD_HASH);
        user.setTokenVersion(0);
    }

    @Test
    void changePassword_shouldUpdatePasswordAndRevokeSessions() {
        when(userRepository.findByEmailForUpdate(EMAIL))
                .thenReturn(Optional.of(user));

        when(passwordEncoder.matches(CURRENT_PASSWORD, OLD_HASH))
                .thenReturn(true);

        when(passwordEncoder.matches(NEW_PASSWORD, OLD_HASH))
                .thenReturn(false);

        when(passwordEncoder.encode(NEW_PASSWORD))
                .thenReturn(NEW_HASH);

        ChangePasswordRequestDto request =
                new ChangePasswordRequestDto(
                        CURRENT_PASSWORD,
                        NEW_PASSWORD
                );

        passwordService.changePassword(EMAIL, request);

        assertEquals(NEW_HASH, user.getPassword());
        assertEquals(1, user.getTokenVersion());

        verify(userRepository).save(user);

        verify(refreshTokenService)
                .revokeAllForUser(user.getId());

        ArgumentCaptor<PasswordChangedEvent> eventCaptor =
                ArgumentCaptor.forClass(PasswordChangedEvent.class);

        verify(eventPublisher)
                .publishEvent(eventCaptor.capture());

        PasswordChangedEvent event = eventCaptor.getValue();

        assertEquals(user.getId(), event.userId());
        assertEquals(user.getEmail(), event.email());
    }

    @Test
    void changePassword_shouldRejectIncorrectCurrentPassword() {
        when(userRepository.findByEmailForUpdate(EMAIL))
                .thenReturn(Optional.of(user));

        when(passwordEncoder.matches("WrongPassword123!", OLD_HASH))
                .thenReturn(false);

        ChangePasswordRequestDto request =
                new ChangePasswordRequestDto(
                        "WrongPassword123!",
                        NEW_PASSWORD
                );

        ResponseStatusException exception =
                assertThrows(
                        ResponseStatusException.class,
                        () -> passwordService.changePassword(
                                EMAIL,
                                request
                        )
                );

        assertEquals(
                HttpStatus.BAD_REQUEST,
                exception.getStatusCode()
        );

        assertEquals(OLD_HASH, user.getPassword());
        assertEquals(0, user.getTokenVersion());

        verify(userRepository, never()).save(any());
        verifyNoInteractions(
                refreshTokenService,
                eventPublisher
        );
    }

    @Test
    void changePassword_shouldRejectWeakPassword() {
        ChangePasswordRequestDto request =
                new ChangePasswordRequestDto(
                        CURRENT_PASSWORD,
                        "short"
                );

        ResponseStatusException exception =
                assertThrows(
                        ResponseStatusException.class,
                        () -> passwordService.changePassword(
                                EMAIL,
                                request
                        )
                );

        assertEquals(
                HttpStatus.BAD_REQUEST,
                exception.getStatusCode()
        );

        verifyNoInteractions(
                userRepository,
                refreshTokenService,
                eventPublisher
        );
    }

    @Test
    void changePassword_shouldRejectSamePassword() {
        when(userRepository.findByEmailForUpdate(EMAIL))
                .thenReturn(Optional.of(user));

        when(passwordEncoder.matches(CURRENT_PASSWORD, OLD_HASH))
                .thenReturn(true);

        when(passwordEncoder.matches(NEW_PASSWORD, OLD_HASH))
                .thenReturn(true);

        ChangePasswordRequestDto request =
                new ChangePasswordRequestDto(
                        CURRENT_PASSWORD,
                        NEW_PASSWORD
                );

        assertThrows(
                ResponseStatusException.class,
                () -> passwordService.changePassword(
                        EMAIL,
                        request
                )
        );

        assertEquals(OLD_HASH, user.getPassword());
        assertEquals(0, user.getTokenVersion());

        verify(userRepository, never()).save(any());

        verifyNoInteractions(
                refreshTokenService,
                eventPublisher
        );
    }

    @Test
    void changePassword_shouldRejectPasswordlessAccount() {
        user.setPassword(null);

        when(userRepository.findByEmailForUpdate(EMAIL))
                .thenReturn(Optional.of(user));

        ChangePasswordRequestDto request =
                new ChangePasswordRequestDto(
                        CURRENT_PASSWORD,
                        NEW_PASSWORD
                );

        ResponseStatusException exception =
                assertThrows(
                        ResponseStatusException.class,
                        () -> passwordService.changePassword(
                                EMAIL,
                                request
                        )
                );

        assertEquals(
                HttpStatus.BAD_REQUEST,
                exception.getStatusCode()
        );

        verify(userRepository, never()).save(any());

        verifyNoInteractions(
                refreshTokenService,
                eventPublisher
        );
    }
}
