package com.brasaswok.dto.user;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class UpdateProfileRequest {

    @NotBlank(message = "El nombre completo es requerido")
    @Size(max = 100, message = "El nombre no puede exceder 100 caracteres")
    private String fullName;

    @Size(max = 20, message = "El teléfono no puede exceder 20 caracteres")
    private String phone;

    @Size(max = 255, message = "La dirección no puede exceder 255 caracteres")
    private String address;

    public UpdateProfileRequest() {
    }

    public UpdateProfileRequest(String fullName, String phone, String address) {
        this.fullName = fullName;
        this.phone = phone;
        this.address = address;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }
}
