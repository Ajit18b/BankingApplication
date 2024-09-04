package com.example.OTP.model;

public class OtpResponse {
    private String message;

    public OtpResponse(String message) {
        this.message = message;
    }

    // Getter
    public String getMessage() {
        return message;
    }
}
