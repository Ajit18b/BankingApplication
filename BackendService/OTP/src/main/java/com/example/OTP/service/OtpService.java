package com.example.OTP.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;

@Service
public class OtpService {

    @Autowired
    private JavaMailSender mailSender;

    private static final SecureRandom random = new SecureRandom();

    public String generateOtp() {
        int otp = 100000 + random.nextInt(900000); // Generates a 6-digit OTP
        return String.valueOf(otp);
    }

    public void sendOtpEmail(String toEmail, String otp, String customMessage, String subject) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        // Use provided subject or a default subject
        message.setSubject(subject != null ? subject : "OTP For User Verification");
        message.setText(customMessage + "\n\nYour OTP is: " + otp);
        mailSender.send(message);
    }

}
