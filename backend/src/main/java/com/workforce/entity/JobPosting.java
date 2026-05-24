package com.workforce.entity;

import com.workforce.enums.JobStatus;
import com.workforce.enums.Status;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class JobPosting {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long jobID;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "EmployerID")
    private Employer employer;

    private String title;
    private String description;
    private String requirementsJSON;
    private String location;
    private LocalDate postedDate;

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private JobStatus status;
}