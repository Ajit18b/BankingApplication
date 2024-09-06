// src/main/java/com/banking/UserBankAccountBase/service/AdminService.java

package com.banking.UserBankAccountBase.service;

import com.banking.UserBankAccountBase.model.Account;
import com.banking.UserBankAccountBase.repository.AccountRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.Random;

@Service
public class AdminService {

    private final AccountRepository accountRepository;

    public AdminService(AccountRepository accountRepository) {
        this.accountRepository = accountRepository;
    }

    public Account registerAccount(Account accountRequest) {
        Optional<Account> existingAccount = accountRepository.findByEmail(accountRequest.getEmail());
        if (existingAccount.isPresent()) {
            throw new IllegalStateException("Email is already registered.");
        }

        String accountNumber = generateUniqueAccountNumber();
        accountRequest.setAccountNumber(accountNumber);

        return accountRepository.save(accountRequest);
    }

    private String generateUniqueAccountNumber() {
        String prefix = "123456";  // The first six digits
        String uniquePart;
        do {
            uniquePart = String.format("%04d", new Random().nextInt(10000));
        } while (accountRepository.findByEmail(prefix + uniquePart).isPresent());

        return prefix + uniquePart;
    }
}
