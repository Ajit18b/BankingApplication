package com.banking.UserSecurity.BankingMicroserviceSecurity.services;

import com.banking.UserSecurity.BankingMicroserviceSecurity.model.BankAccount;
import com.banking.UserSecurity.BankingMicroserviceSecurity.repository.BankAccountRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.Random;

@Service
public class BankAccountService {

    private final BankAccountRepository repository;

    @Autowired
    public BankAccountService(BankAccountRepository repository) {
        this.repository = repository;
    }

    // Create bank account with name and email
    public BankAccount createBankAccount(String name, String email) {
        if (repository.existsByEmail(email)) {
            throw new IllegalArgumentException("Email already registered");
        }

        String accountNumber;
        do {
            accountNumber = generateAccountNumber();
        } while (repository.existsByAccountNumber(accountNumber));

        BankAccount bankAccount = new BankAccount();
        bankAccount.setName(name);  // Set name
        bankAccount.setEmail(email);
        bankAccount.setAccountNumber(accountNumber);

        return repository.save(bankAccount);
    }

    private String generateAccountNumber() {
        Random random = new Random();
        int number = random.nextInt(9000) + 1000; // Ensure 4 digits
        return "603800" + number; // Prefix and random 4 digits
    }

    public List<BankAccount> getAllBankAccounts() {
        return repository.findAll();
    }

    public Optional<BankAccount> findBankAccountByEmail(String email) {
        return repository.findByEmail(email);
    }
}
