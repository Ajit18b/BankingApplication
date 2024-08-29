package com.banking.UserSecurity.BankingMicroserviceSecurity.services;

import org.springframework.security.core.userdetails.UserDetailsService;

public interface UserService {
    UserDetailsService userDetailsService();
}
