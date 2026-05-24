package com.workforce.entity;

import com.workforce.enums.AuditStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Audit {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long auditID;


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "username", referencedColumnName = "username")
    private AuthUser officer;


    private String scope;

    private String findings;

    private LocalDate date;

    @Enumerated(EnumType.STRING)
    private AuditStatus status;
}