package com.banking.UserSecurity.BankingMicroserviceSecurity.dto;

import lombok.Data;

@Data
public class BankAccountRequest {
    private String name;
    private String email;
}
