package com.banking.UserSecurity.BankingMicroserviceSecurity.controller;

import com.banking.UserSecurity.BankingMicroserviceSecurity.dto.JwtAuthenticationResponse;
import com.banking.UserSecurity.BankingMicroserviceSecurity.dto.RefreshTokenRequest;
import com.banking.UserSecurity.BankingMicroserviceSecurity.dto.SignUpRequest;
import com.banking.UserSecurity.BankingMicroserviceSecurity.dto.SigninRequest;
import com.banking.UserSecurity.BankingMicroserviceSecurity.entities.User;
import com.banking.UserSecurity.BankingMicroserviceSecurity.services.AuthenticationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
