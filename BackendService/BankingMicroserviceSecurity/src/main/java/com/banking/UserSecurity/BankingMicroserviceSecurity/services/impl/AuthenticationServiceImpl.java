package com.banking.UserSecurity.BankingMicroserviceSecurity.services.impl;

import com.banking.UserSecurity.BankingMicroserviceSecurity.dto.*;
import com.banking.UserSecurity.BankingMicroserviceSecurity.entities.Role;
import com.banking.UserSecurity.BankingMicroserviceSecurity.entities.User;
import com.banking.UserSecurity.BankingMicroserviceSecurity.repository.UserRepository;
import com.banking.UserSecurity.BankingMicroserviceSecurity.services.AuthenticationService;
import com.banking.UserSecurity.BankingMicroserviceSecurity.services.JWTService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;

@Service
@RequiredArgsConstructor
public class AuthenticationServiceImpl implements AuthenticationService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JWTService jwtService;

    public User signup(SignUpRequest signUpRequest) {
        // Check if the user email already exists
        if (userRepository.findByEmail(signUpRequest.getEmail()).isPresent()) {
            throw new IllegalArgumentException("User with this email already exists");
        }

        // Determine the role based on the userType field in the request body
        Role role = Role.USER; // default role
        if ("admin".equalsIgnoreCase(signUpRequest.getUserType())) {
            role = Role.ADMIN;
        }

        // Proceed with creating a new user
        User user = new User();
        user.setEmail(signUpRequest.getEmail());
        user.setFirstname(signUpRequest.getFirstname());
        user.setLastname(signUpRequest.getLastname());
        user.setRole(role);
        user.setPassword(passwordEncoder.encode(signUpRequest.getPassword()));
        return userRepository.save(user);
    }

    public boolean emailCheck(EmailCheckRequest emailCheckRequest) {
        return userRepository.findByEmail(emailCheckRequest.getEmail()).isPresent();
    }



    public JwtAuthenticationResponse signin(SigninRequest signinRequest) {
        // Authenticate the user with the provided email and password
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(signinRequest.getEmail(), signinRequest.getPassword())
        );

        // Retrieve the user details from the repository
        var user = userRepository.findByEmail(signinRequest.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("Invalid email or password"));

        // Generate the JWT token, including the user's role as the user type
        var jwt = jwtService.generateToken(user, user.getRole().name());

        // Generate the refresh token, also including the user's role if needed
        var refreshToken = jwtService.generateRefreshToken(new HashMap<>(), user, user.getRole().name());

        // Create the response object with the tokens
        JwtAuthenticationResponse jwtAuthenticationResponse = new JwtAuthenticationResponse();
        jwtAuthenticationResponse.setToken(jwt);
        jwtAuthenticationResponse.setRefreshToken(refreshToken);

        return jwtAuthenticationResponse;
    }


    public JwtAuthenticationResponse refreshToken(RefreshTokenRequest refreshTokenRequest) {
        // Extract the email from the provided refresh token
        String userEmail = jwtService.extractUserName(refreshTokenRequest.getToken());

        // Retrieve the user from the repository based on the email
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        // Validate the provided refresh token
        if (jwtService.isTokenValid(refreshTokenRequest.getToken(), user)) {
            // Generate a new JWT token, including the user's role as the user type
            var jwt = jwtService.generateToken(user, user.getRole().name());

            // Create the response object with the new JWT token and the provided refresh token
            JwtAuthenticationResponse jwtAuthenticationResponse = new JwtAuthenticationResponse();
            jwtAuthenticationResponse.setToken(jwt);
            jwtAuthenticationResponse.setRefreshToken(refreshTokenRequest.getToken());

            return jwtAuthenticationResponse;
        }

        // If the token is invalid, return null or handle accordingly
        return null;
    }
}
