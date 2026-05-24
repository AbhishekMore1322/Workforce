package com.workforce.entity;

import com.workforce.enums.*;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SeekerDocument {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long documentID;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "SeekerID")
    private JobSeeker seeker;

    @Enumerated(EnumType.STRING)
    private DocumentType docType;

    private String fileURI;
    private LocalDate uploadedDate;

}