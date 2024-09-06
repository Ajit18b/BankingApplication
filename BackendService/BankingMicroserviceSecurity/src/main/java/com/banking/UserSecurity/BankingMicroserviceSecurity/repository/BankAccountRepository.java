package com.banking.UserSecurity.BankingMicroserviceSecurity.repository;

import com.banking.UserSecurity.BankingMicroserviceSecurity.model.BankAccount;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface BankAccountRepository extends JpaRepository<BankAccount, Long> {
    boolean existsByAccountNumber(String accountNumber);
    boolean existsByEmail(String email);
    Optional<BankAccount> findByEmail(String email); // Return Optional for email lookups
}
