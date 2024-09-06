// src/main/java/com/banking/UserBankAccountBase/repository/AccountRepository.java

package com.banking.UserBankAccountBase.repository;

import com.banking.UserBankAccountBase.model.Account;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AccountRepository extends JpaRepository<Account, Long> {
    Optional<Account> findByEmail(String email);
}
