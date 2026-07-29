package com.streamflix.modules.profiles.dto;

import jakarta.validation.constraints.NotBlank;

public class VerifyPinRequest {

    @NotBlank(message = "PIN code is required")
    private String pinCode;

    public VerifyPinRequest() {}

    public VerifyPinRequest(String pinCode) {
        this.pinCode = pinCode;
    }

    public String getPinCode() { return pinCode; }
    public void setPinCode(String pinCode) { this.pinCode = pinCode; }
}
