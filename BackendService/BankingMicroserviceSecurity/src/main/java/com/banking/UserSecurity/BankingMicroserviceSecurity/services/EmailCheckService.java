package com.banking.UserSecurity.BankingMicroserviceSecurity.services;

import com.banking.UserSecurity.BankingMicroserviceSecurity.repository.BankAccountRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class EmailCheckService {

    private final BankAccountRepository bankAccountRepository;

    @Autowired
    public EmailCheckService(BankAccountRepository bankAccountRepository) {
        this.bankAccountRepository = bankAccountRepository;
    }

    public boolean emailExists(String email) {
        return bankAccountRepository.existsByEmail(email);
    }
}
