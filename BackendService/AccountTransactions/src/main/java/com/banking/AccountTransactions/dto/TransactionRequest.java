package com.banking.AccountTransactions.dto;

import lombok.Data;

@Data
public class TransactionRequest {
    private String accountNumber;
    private Double amount;
    private String type; // "CREDIT" or "DEBIT"
    private String description;
}
