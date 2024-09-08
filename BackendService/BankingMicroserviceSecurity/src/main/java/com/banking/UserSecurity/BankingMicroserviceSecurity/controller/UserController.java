package com.banking.UserSecurity.BankingMicroserviceSecurity.controller;

import com.banking.UserSecurity.BankingMicroserviceSecurity.model.BankAccount;
import com.banking.UserSecurity.BankingMicroserviceSecurity.services.BankAccountService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/v1/user")
@RequiredArgsConstructor
public class UserController {

    private final BankAccountService bankAccountService;

    @GetMapping
    public ResponseEntity<String> sayHello() {
        return ResponseEntity.ok("Hi user");
    }

    /**
     * Retrieves the bank account for the authenticated user.
     * @param request JSON object containing the email.
     * @return BankAccountResponse object if found, else 404 Not Found.
     */
    @PostMapping("/account")
    public ResponseEntity<BankAccountResponse> getBankAccountByEmail(@RequestBody EmailRequest request) {
        Optional<BankAccount> bankAccount = bankAccountService.findBankAccountByEmail(request.getEmail());
        if (bankAccount.isPresent()) {
            BankAccount account = bankAccount.get();
            BankAccountResponse response = new BankAccountResponse(account.getAccountNumber(), account.getName());
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // Inner class for email request
    public static class EmailRequest {
        private String email;

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }
    }

    // Inner class for bank account response
    public static class BankAccountResponse {
        private String accountNumber;
        private String name;

        public BankAccountResponse(String accountNumber, String name) {
            this.accountNumber = accountNumber;
            this.name = name;
        }

        public String getAccountNumber() {
            return accountNumber;
        }

        public void setAccountNumber(String accountNumber) {
            this.accountNumber = accountNumber;
        }

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }
    }
}
