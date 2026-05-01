package com.saveliens.saveliens.exceptions;

public class NonExistingUserException extends RuntimeException {
    public NonExistingUserException(String message) {
        super(message);
    }
}
