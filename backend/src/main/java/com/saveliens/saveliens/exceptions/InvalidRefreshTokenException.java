
package com.saveliens.saveliens.exceptions;

public class InvalidRefreshTokenException
        extends RuntimeException {

    public InvalidRefreshTokenException(String message) {
        super(message);
    }
}
