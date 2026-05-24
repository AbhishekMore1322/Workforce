package com.workforce.mapper;

import com.workforce.dto.SeekerDocumentRequest;
import com.workforce.dto.SeekerDocumentResponse;
import com.workforce.entity.SeekerDocument;

public class SeekerDocumentMapper {

    public static SeekerDocument toEntity(SeekerDocumentRequest request) {
        SeekerDocument doc = new SeekerDocument();
        doc.setDocType(request.getDocType());
        doc.setFileURI(request.getFileURI());
        return doc;
    }

    public static SeekerDocumentResponse toResponse(SeekerDocument doc) {
        return new SeekerDocumentResponse(
                doc.getDocumentID(),
                doc.getSeeker().getSeekerID(),
                doc.getDocType(),
                doc.getFileURI(),
                doc.getUploadedDate()
        );
    }
}
