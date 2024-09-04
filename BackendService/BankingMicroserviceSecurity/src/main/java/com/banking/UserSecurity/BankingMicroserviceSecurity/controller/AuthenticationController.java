package com.banking.UserSecurity.BankingMicroserviceSecurity.controller;

import com.banking.UserSecurity.BankingMicroserviceSecurity.dto.*;
import com.banking.UserSecurity.BankingMicroserviceSecurity.entities.User;
import com.banking.UserSecurity.BankingMicroserviceSecurity.services.AuthenticationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthenticationController {

    private final AuthenticationService authenticationService;

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody SignUpRequest signUpRequest) {
        try {
            authenticationService.signup(signUpRequest);

            // Return a success message
            return ResponseEntity.ok("User registered successfully");
        } catch (IllegalArgumentException ex) {
            // Handle the exception and return a conflict response
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        }
    }

    @PostMapping("/check-email")
    public ResponseEntity<?> emailCheck(@RequestBody EmailCheckRequest emailCheckRequest) {
        try {
            boolean emailExists = authenticationService.emailCheck(emailCheckRequest);

            if (emailExists) {
                return ResponseEntity.ok(Collections.singletonMap("message", "Email exists"));
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Collections.singletonMap("message", "Email does not exist"));
            }
        } catch (Exception ex) {
            // Handle unexpected exceptions
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Collections.singletonMap("message", "An error occurred: " + ex.getMessage()));
        }
    }


    @PostMapping("/signin")
    public ResponseEntity<?> signin(@RequestBody SigninRequest signinRequest) {
        try {
            JwtAuthenticationResponse response = authenticationService.signin(signinRequest);
            return ResponseEntity.ok(response);
        } catch (AuthenticationException ex) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Invalid email or password. Access denied.");
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.getMessage());
        }
    }


    @PostMapping("/refresh")
    public ResponseEntity<JwtAuthenticationResponse> refresh(@RequestBody RefreshTokenRequest refreshTokenRequest) {
        return ResponseEntity.ok(authenticationService.refreshToken(refreshTokenRequest));
    }


}
