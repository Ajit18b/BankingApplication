package com.banking.AccountTransactions.service;

import com.banking.AccountTransactions.entity.BankAccount;
import com.banking.AccountTransactions.entity.Transaction;
import com.banking.AccountTransactions.repository.BankAccountRepository;
import com.banking.AccountTransactions.repository.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class TransactionService {

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private BankAccountRepository bankAccountRepository;

    public Transaction createTransaction(String accountNumber, Double amount, String type, String description) {
        BankAccount account = bankAccountRepository.findByAccountNumber(accountNumber)
                .orElseThrow(() -> new RuntimeException("Account not found"));

        if (type.equalsIgnoreCase("DEBIT") && account.getTotalAmount() < amount) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Insufficient balance for this transaction");
        }

        Transaction transaction = new Transaction();
        transaction.setAmount(amount);
        transaction.setType(type);
        transaction.setDescription(description);
        transaction.setBankAccount(account);

        if (type.equalsIgnoreCase("CREDIT")) {
            account.setTotalAmount(account.getTotalAmount() + amount);
        } else if (type.equalsIgnoreCase("DEBIT")) {
            account.setTotalAmount(account.getTotalAmount() - amount);
        } else {
            throw new RuntimeException("Invalid transaction type");
        }

        bankAccountRepository.save(account);
        return transactionRepository.save(transaction);
    }

    public List<Transaction> getTransactionsByAccountNumber(String accountNumber) {
        BankAccount account = bankAccountRepository.findByAccountNumber(accountNumber)
                .orElseThrow(() -> new RuntimeException("Account not found"));
        return transactionRepository.findByBankAccountId(account.getId());
    }
}
