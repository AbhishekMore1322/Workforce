package com.workforce.service;

import com.workforce.dto.*;
import java.util.List;

public interface TrainingProgramService {

    TrainingProgramResponse create(TrainingProgramRequest request);
    List<TrainingProgramResponse> getAll();
    TrainingProgramResponse getById(Long id);
    TrainingProgramResponse update(Long id);
    void delete(Long id);
}