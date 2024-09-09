package com.banking.AccountTransactions.controller;


import com.banking.AccountTransactions.dto.AccountRequest;
import com.banking.AccountTransactions.entity.BankAccount;
import com.banking.AccountTransactions.service.BankAccountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
@CrossOrigin("http://localhost:3000")
@RestController
@RequestMapping("/api/accounts")
public class AccountController {

    @Autowired
    private BankAccountService accountService;

    @PostMapping("/register")
    public BankAccount registerAccount(@RequestBody AccountRequest accountRequest) {
        return accountService.createBankAccount(accountRequest.getAccountNumber());
    }

    @GetMapping("/{accountNumber}")
    public BankAccount getAccount(@PathVariable String accountNumber) {
        return accountService.getAccountByNumber(accountNumber);
    }
}
