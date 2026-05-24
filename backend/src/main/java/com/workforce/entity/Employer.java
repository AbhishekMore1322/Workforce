package com.workforce.entity;

import com.workforce.enums.Status;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Employer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long employerID;

    private String name;

    private String industry;

    private String contactInfo;

    @OneToOne
    @JoinColumn(name = "user_username", referencedColumnName = "username")
    private AuthUser user;

    @Enumerated(EnumType.STRING)
    private Status status;
}