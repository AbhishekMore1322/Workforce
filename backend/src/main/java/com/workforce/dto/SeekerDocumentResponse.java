package com.workforce.dto;

import com.workforce.enums.*;
import java.time.LocalDate;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SeekerDocumentResponse {

    private Long documentID;
    private Long seekerID;
    private DocumentType docType;
    private String fileURI;
    private LocalDate uploadedDate;
}
