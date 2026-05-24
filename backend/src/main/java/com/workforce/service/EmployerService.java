package com.workforce.service;

import com.workforce.dto.*;
import java.util.List;

public interface EmployerService {

    EmployerResponse register(EmployerRequest request);
    List<EmployerResponse> getAll();
    EmployerResponse getById(Long id);
    EmployerResponse updateStatus(Long id, String status);
    void delete(Long id);
}