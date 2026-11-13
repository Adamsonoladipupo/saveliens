package com.saveliens.saveliens.services;

public interface EmailService {
    void sendWelcomeEmail( String email, String firstName );
    void sendLoginNotification(String email, String firstName);
    void sendPasswordChangedNotification( String email, String firstName);
}
