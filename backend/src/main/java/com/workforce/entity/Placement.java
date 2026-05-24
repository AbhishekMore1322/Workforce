package com.workforce.entity;

import com.workforce.enums.PlacementStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Placement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long placementID;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ApplicationID")
    private Application application;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "EmployerID")
    private Employer employer;

    private String position;
    private LocalDate startDate;

    @Enumerated(EnumType.STRING)
    private PlacementStatus status;
}