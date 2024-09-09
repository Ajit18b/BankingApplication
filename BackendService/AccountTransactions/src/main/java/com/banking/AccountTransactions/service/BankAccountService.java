package com.banking.AccountTransactions.service;


import com.banking.AccountTransactions.entity.BankAccount;
import com.banking.AccountTransactions.repository.BankAccountRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class BankAccountService {

    @Autowired
    private BankAccountRepository bankAccountRepository;

    public BankAccount createBankAccount(String accountNumber) {
        BankAccount account = new BankAccount();
        account.setAccountNumber(accountNumber);
        return bankAccountRepository.save(account);
    }

    public BankAccount getAccountByNumber(String accountNumber) {
        Optional<BankAccount> account = bankAccountRepository.findByAccountNumber(accountNumber);
        return account.orElseThrow(() -> new RuntimeException("Account not found"));
    }

    public BankAccount updateAccount(BankAccount account) {
        return bankAccountRepository.save(account);
    }
}
