package com.example.pasir_marchanski_sebastian.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class DebtDTO {
    private Long debtorId;
    private Long creditorId;
    private Long groupId;
    private Double amount;
    private String title;

}
