package com.banking.UserSecurity.BankingMicroserviceSecurity;

import com.banking.UserSecurity.BankingMicroserviceSecurity.entities.Role;
import com.banking.UserSecurity.BankingMicroserviceSecurity.entities.User;
import com.banking.UserSecurity.BankingMicroserviceSecurity.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@SpringBootApplication
public class BankingMicroserviceSecurityApplication{
	public static void main(String[] args) {
		SpringApplication.run(BankingMicroserviceSecurityApplication.class, args);
	}
}
