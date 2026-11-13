
package com.saveliens.saveliens.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class ClientIpDiagnosticFilter
        extends OncePerRequestFilter {

    private static final Logger log =
            LoggerFactory.getLogger(
                    ClientIpDiagnosticFilter.class
            );

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        if ("/api/auth/forgot-password"
                .equals(request.getRequestURI())
                && "POST".equalsIgnoreCase(
                request.getMethod())) {

            log.info(
                    "IP diagnostics: remotePresent={}, " +
                            "cloudflareHeaderPresent={}, " +
                            "forwardedHeaderPresent={}",
                    request.getRemoteAddr() != null,
                    request.getHeader("CF-Connecting-IP") != null,
                    request.getHeader("X-Forwarded-For") != null
            );
        }

        filterChain.doFilter(request, response);
    }
}
