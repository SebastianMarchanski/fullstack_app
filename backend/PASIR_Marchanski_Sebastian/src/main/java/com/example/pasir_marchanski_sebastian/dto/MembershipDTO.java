package com.example.pasir_marchanski_sebastian.dto;


import lombok.Getter;
import lombok.Setter;
import jakarta.validation.constraints.NotNull;

@Getter
@Setter
public class MembershipDTO {

    @NotNull(message = "Email użytkownika nie może być pusty")
    private String userEmail;

    @NotNull(message = "ID grupy nie może być puste")
    private Long groupId;

}
