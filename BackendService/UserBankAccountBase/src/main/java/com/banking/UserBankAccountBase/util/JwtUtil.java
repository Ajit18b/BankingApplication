// src/main/java/com/banking/UserBankAccountBase/util/JwtUtil.java

package com.banking.UserBankAccountBase.util;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.stereotype.Component;

@Component
public class JwtUtil {

    private static final String SECRET_KEY = "IN3R6wCh+LUBaw2r0r0mhJorwFMr5mwLgFGPf47IJuc="; // Use a secure key

    public String extractUserType(String token) {
        try {
            Claims claims = Jwts.parser()
                    .setSigningKey(SECRET_KEY)
                    .parseClaimsJws(token)
                    .getBody();

            return claims.get("userType", String.class);
        } catch (Exception e) {
            // Handle token validation errors
            return null;
        }
    }

    public String extractSubject(String token) {
        return Jwts.parser()
                .setSigningKey(SECRET_KEY)
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }
}
