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
public class Application {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long applicationID;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "SeekerID")
    private JobSeeker seeker;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "JobID")
    private JobPosting job;

    private LocalDate submittedDate;

    @Enumerated(EnumType.STRING)
    private ApplicationStatus status;
}