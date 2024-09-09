package com.banking.AccountTransactions.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "bank_accounts")
public class BankAccount {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String accountNumber;

    @Column(nullable = false)
    private Double totalAmount = 0.0;
}
