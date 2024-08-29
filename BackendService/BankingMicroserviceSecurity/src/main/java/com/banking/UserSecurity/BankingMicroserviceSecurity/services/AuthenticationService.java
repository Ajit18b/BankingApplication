package com.banking.UserSecurity.BankingMicroserviceSecurity.services;

import com.banking.UserSecurity.BankingMicroserviceSecurity.dto.JwtAuthenticationResponse;
import com.banking.UserSecurity.BankingMicroserviceSecurity.dto.RefreshTokenRequest;
import com.banking.UserSecurity.BankingMicroserviceSecurity.dto.SignUpRequest;
import com.banking.UserSecurity.BankingMicroserviceSecurity.dto.SigninRequest;
import com.banking.UserSecurity.BankingMicroserviceSecurity.entities.User;

public interface AuthenticationService {
    User signup(SignUpRequest signUpRequest);
    JwtAuthenticationResponse signin(SigninRequest signinRequest);
    JwtAuthenticationResponse refreshToken (RefreshTokenRequest refreshTokenRequest);
}
