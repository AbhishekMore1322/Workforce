package com.workforce.dto;

import com.workforce.enums.DocumentType;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.NotBlank;
import lombok.*;
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SeekerDocumentRequest {

    @NotNull(message = "Document type is required")
    private DocumentType docType;

    @NotBlank(message = "File URI must not be blank")
    private String fileURI;
}