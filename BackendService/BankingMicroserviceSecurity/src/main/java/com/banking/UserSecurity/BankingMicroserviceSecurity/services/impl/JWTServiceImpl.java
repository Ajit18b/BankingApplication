package com.banking.UserSecurity.BankingMicroserviceSecurity.services.impl;

import com.banking.UserSecurity.BankingMicroserviceSecurity.entities.User;
import com.banking.UserSecurity.BankingMicroserviceSecurity.services.JWTService;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Base64;
import java.util.Date;
import java.util.Map;
import java.util.function.Function;

@Service
public class JWTServiceImpl implements JWTService {
    public String generateToken(UserDetails userDetails, String userType) {
        // Cast userDetails to User to access the first name and last name
        User user = (User) userDetails;
        String fullName = user.getFirstname() + " " + user.getLastname();

        return Jwts.builder()
                .setSubject(userDetails.getUsername())
                .claim("userType", userType)  // Add user type as a custom claim
                .claim("fullName", fullName)  // Add full name as a custom claim
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 *30))
                .signWith(getSiginKey(), SignatureAlgorithm.HS256)
                .compact();
    }


    public String generateRefreshToken(Map<String, Object> extraClaims, UserDetails userDetails, String userType) {
        // Cast userDetails to User to access the first name and last name
        User user = (User) userDetails;
        String fullName = user.getFirstname() + " " + user.getLastname();

        extraClaims.put("userType", userType);  // Add user type to extra claims
        extraClaims.put("fullName", fullName);  // Add full name to extra claims

        return Jwts.builder()
                .setClaims(extraClaims)
                .setSubject(userDetails.getUsername())
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + 604800000)) // 7 days
                .signWith(getSiginKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    public String extractUserName(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public String extractUserType(String token) {
        return extractClaim(token, claims -> claims.get("userType", String.class));
    }

    private <T> T extractClaim(String token, Function<Claims, T> claimsResolvers) {
        final Claims claims = extractAllClaims(token);
        return claimsResolvers.apply(claims);
    }

    private Key getSiginKey() {
        byte[] key = Decoders.BASE64.decode("IN3R6wCh+LUBaw2r0r0mhJorwFMr5mwLgFGPf47IJuc=");
        return Keys.hmacShaKeyFor(key);
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parserBuilder().setSigningKey(getSiginKey()).build().parseClaimsJws(token).getBody();
    }

    public boolean isTokenValid(String token, UserDetails userDetails) {
        final String username = extractUserName(token);
        return (username.equals(userDetails.getUsername()) && !isTokenExpired(token));
    }

    private boolean isTokenExpired(String token) {
        return extractClaim(token, Claims::getExpiration).before(new Date());
    }
}
