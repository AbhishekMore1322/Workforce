package com.workforce.entity;

import com.workforce.enums.ComplianceResult;
import com.workforce.enums.EntityType;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ComplianceRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long complianceID;

    private Long entityID;

    @Enumerated(EnumType.STRING)
    private EntityType type;

    @Enumerated(EnumType.STRING)
    private ComplianceResult result;

    private LocalDate date;

    private String notes;
}