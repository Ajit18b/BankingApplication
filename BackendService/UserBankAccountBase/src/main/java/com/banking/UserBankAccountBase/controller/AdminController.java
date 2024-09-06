// src/main/java/com/banking/UserBankAccountBase/controller/AdminController.java

package com.banking.UserBankAccountBase.controller;

import com.banking.UserBankAccountBase.model.Account;
import com.banking.UserBankAccountBase.service.AdminService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @PostMapping("/register-account")
    public ResponseEntity<Account> registerAccount(@RequestBody Account accountRequest) {
        Account newAccount = adminService.registerAccount(accountRequest);
        return ResponseEntity.ok(newAccount);
    }
}
