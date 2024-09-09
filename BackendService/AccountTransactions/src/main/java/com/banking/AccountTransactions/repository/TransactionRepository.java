package com.banking.AccountTransactions.repository;

import com.banking.AccountTransactions.entity.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    List<Transaction> findByBankAccountId(Long bankAccountId);
}
