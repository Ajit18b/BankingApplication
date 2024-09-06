package com.banking.UserSecurity.BankingMicroserviceSecurity.controller;


import com.banking.UserSecurity.BankingMicroserviceSecurity.services.EmailCheckService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/public")
@RequiredArgsConstructor
public class PublicEmailController {

    private final EmailCheckService emailCheckService;

    @PostMapping("/unregistered-portal-email")
    public ResponseEntity<EmailCheckResponse> checkEmail(@RequestBody EmailCheckRequest request) {
        boolean emailExists = emailCheckService.emailExists(request.getEmail());
        return ResponseEntity.ok(new EmailCheckResponse(emailExists));
    }

    // Inner class for email check request
    public static class EmailCheckRequest {
        private String email;

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }
    }

    // Inner class for email check response
    public static class EmailCheckResponse {
        private boolean emailExistsWithBankAccount;

        public EmailCheckResponse(boolean emailExists) {
            this.emailExistsWithBankAccount = emailExists;
        }

        public boolean isEmailExistsWithBankAccount() {
            return emailExistsWithBankAccount;
        }

        public void setEmailExistsWithBankAccount(boolean emailExistsWithBankAccount) {
            this.emailExistsWithBankAccount = emailExistsWithBankAccount;
        }
    }
}
