package com.workforce.entity;

import com.workforce.enums.Gender;
import com.workforce.enums.Status;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class JobSeeker {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long seekerID;

    private String name;

    private LocalDate dob;

    @Enumerated(EnumType.STRING)
    private Gender gender;

    private String address;

    private String contactInfo;

    private String skillsJSON;

    @OneToOne
    @JoinColumn(name = "user_username", referencedColumnName = "username")
    private AuthUser user;

    @Enumerated(EnumType.STRING)
    private Status status;
}