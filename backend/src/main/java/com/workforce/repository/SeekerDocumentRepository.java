package com.workforce.repository;

import com.workforce.entity.SeekerDocument;
import com.workforce.enums.DocumentType;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface SeekerDocumentRepository extends JpaRepository<SeekerDocument, Long> {

    List<SeekerDocument> findBySeekerSeekerID(Long seekerID);
    
 Optional<SeekerDocument> findTopBySeekerSeekerIDAndDocTypeOrderByUploadedDateDesc(
            Long seekerID,
            DocumentType docType
    );

}
