package com.workforce.service;

import com.workforce.dto.*;
import java.util.List;

public interface PlacementService {

    PlacementResponse create(PlacementRequest request);
    List<PlacementResponse> getAll();
    PlacementResponse getById(Long id);
    PlacementResponse updateStatus(Long id, String status);
    void delete(Long id);
}