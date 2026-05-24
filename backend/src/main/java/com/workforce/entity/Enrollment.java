package com.workforce.entity;

import com.workforce.enums.EnrollmentStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Enrollment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long enrollmentID;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ProgramID")
    private TrainingProgram program;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "SeekerID")
    private JobSeeker seeker;

    private LocalDate completionDate;

    @Enumerated(EnumType.STRING)
    private EnrollmentStatus status;
}