package com.banking.UserSecurity.BankingMicroserviceSecurity.controller;

import com.banking.UserSecurity.BankingMicroserviceSecurity.dto.BankAccountRequest;
import com.banking.UserSecurity.BankingMicroserviceSecurity.model.BankAccount;
import com.banking.UserSecurity.BankingMicroserviceSecurity.services.BankAccountService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class AdminController {

    private final BankAccountService bankAccountService;

    @GetMapping
    public ResponseEntity<String> sayHello() {
        return ResponseEntity.ok("Hi Admin");
    }

    // Register bank account with name and email
    @PostMapping("/register-bank-account")
    public ResponseEntity<?> registerBankAccount(@RequestBody BankAccountRequest request) {
        try {
            BankAccount bankAccount = bankAccountService.createBankAccount(request.getName(), request.getEmail());
            return ResponseEntity.ok(bankAccount);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @GetMapping("/bank-accounts")
    public ResponseEntity<List<BankAccount>> getAllBankAccounts() {
        List<BankAccount> bankAccounts = bankAccountService.getAllBankAccounts();
        return ResponseEntity.ok(bankAccounts);
    }
}
