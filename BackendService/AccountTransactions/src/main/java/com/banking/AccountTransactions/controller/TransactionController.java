package com.banking.AccountTransactions.controller;

import com.banking.AccountTransactions.dto.TransactionRequest;
import com.banking.AccountTransactions.entity.Transaction;
import com.banking.AccountTransactions.service.TransactionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@CrossOrigin({"http://localhost:3000","http://192.168.4.170:3000","http://192.168.29.30:3000"})
@RestController
@RequestMapping("/api/transactions")
public class TransactionController {

    @Autowired
    private TransactionService transactionService;

    @PostMapping("/new")
    public Transaction createTransaction(@RequestBody TransactionRequest transactionRequest) {
        return transactionService.createTransaction(transactionRequest.getAccountNumber(),
                transactionRequest.getAmount(),
                transactionRequest.getType(),
                transactionRequest.getDescription());
    }

    @GetMapping("/byAccountNumber/{accountNumber}")
    public List<Transaction> getTransactionsByAccountNumber(@PathVariable String accountNumber) {
        return transactionService.getTransactionsByAccountNumber(accountNumber);
    }
}
