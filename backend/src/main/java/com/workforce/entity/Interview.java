package com.workforce.entity;

import com.workforce.enums.InterviewResult;
import com.workforce.enums.InterviewStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Interview {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long interviewID;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ApplicationID")
    private Application application;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "EmployerID")
    private Employer employer;

    private LocalDate date;
    private LocalTime time;

    @Enumerated(EnumType.STRING)
    private InterviewStatus status;

    @Enumerated(EnumType.STRING)
    private InterviewResult result;
}
