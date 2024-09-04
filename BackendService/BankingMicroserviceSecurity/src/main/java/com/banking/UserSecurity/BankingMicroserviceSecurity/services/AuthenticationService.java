package com.banking.UserSecurity.BankingMicroserviceSecurity.services;

import com.banking.UserSecurity.BankingMicroserviceSecurity.dto.*;
import com.banking.UserSecurity.BankingMicroserviceSecurity.entities.User;

public interface AuthenticationService {
    User signup(SignUpRequest signUpRequest);
    boolean emailCheck(EmailCheckRequest emailCheckRequest);
    JwtAuthenticationResponse signin(SigninRequest signinRequest);
    JwtAuthenticationResponse refreshToken (RefreshTokenRequest refreshTokenRequest);

}
