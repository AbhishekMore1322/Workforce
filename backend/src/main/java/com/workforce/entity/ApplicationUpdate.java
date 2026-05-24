package com.workforce.entity;

import com.workforce.enums.ApplicationStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ApplicationUpdate {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long updateID;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ApplicationID")
    private Application application;

    private String notes;

    private LocalDate date;

    @Enumerated(EnumType.STRING)
    private ApplicationStatus status;
}