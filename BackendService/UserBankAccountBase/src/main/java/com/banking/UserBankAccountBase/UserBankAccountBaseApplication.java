package com.banking.UserBankAccountBase;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@ComponentScan(basePackages = "com.banking.UserBankAccountBase")
public class UserBankAccountBaseApplication {

	public static void main(String[] args) {
		SpringApplication.run(UserBankAccountBaseApplication.class, args);
	}

}
