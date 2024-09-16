package com.banking.UserSecurity.BankingMicroserviceSecurity.entities;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NonNull;

@Data
@Entity
@Table(name = "kyc_details")
public class KYC {
    private String accountNumber;
    private String firstName;
    private String middleName;
    private String lastName;
    private String adhaarDetails;

}
