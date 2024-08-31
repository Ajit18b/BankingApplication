package com.banking.UserSecurity.BankingMicroserviceSecurity.services;

import org.springframework.security.core.userdetails.UserDetails;

import java.util.Map;

public interface JWTService {
    String extractUserName(String token);
    String generateToken(UserDetails userDetails, String userType); // Updated method to include userType
    boolean isTokenValid(String token, UserDetails userDetails);
    String generateRefreshToken(Map<String, Object> extraClaims, UserDetails userDetails, String userType); // Updated method to include userType
    String extractUserType(String token); // New method to extract userType from token
}
