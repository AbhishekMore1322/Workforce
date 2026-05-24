package com.workforce.service.impl;

import com.workforce.config.CurrentUserUtil;
import com.workforce.dto.TrainingProgramRequest;
import com.workforce.dto.TrainingProgramResponse;
import com.workforce.entity.TrainingProgram;
import com.workforce.enums.Role;
import com.workforce.enums.Status;
import com.workforce.exception.TrainingProgramNotFoundException;
import com.workforce.exception.UnauthorizedOperationException;
import com.workforce.mapper.TrainingProgramMapper;
import com.workforce.repository.TrainingProgramRepository;
import com.workforce.service.TrainingProgramService;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class TrainingProgramServiceImpl implements TrainingProgramService {

    private final TrainingProgramRepository repository;
    private final CurrentUserUtil currentUserUtil;

    @Override
    public TrainingProgramResponse create(TrainingProgramRequest request) {

        Role role = currentUserUtil.getCurrentUserRole();

        if (role != Role.ADMIN && role != Role.PROGRAM_MANAGER) {
            throw new UnauthorizedOperationException(
                    "Not authorized to create training program");
        }

        TrainingProgram program = new TrainingProgram();
        program.setTitle(request.getTitle());
        program.setDescription(request.getDescription());
        program.setStartDate(request.getStartDate());
        program.setEndDate(request.getEndDate());
        program.setStatus(Status.ACTIVE);

        return TrainingProgramMapper.toResponse(repository.save(program));
    }

    @Override
    public List<TrainingProgramResponse> getAll() {

        List<TrainingProgramResponse> responses = new ArrayList<>();
        for (TrainingProgram program : repository.findAll()) {
            responses.add(TrainingProgramMapper.toResponse(program));
        }
        return responses;
    }

    @Override
    public TrainingProgramResponse getById(Long id) {

        TrainingProgram program = repository.findById(id)
                .orElseThrow(() ->
                        new TrainingProgramNotFoundException(
                                "Training program not found"));

        return TrainingProgramMapper.toResponse(program);
    }

    @Override
    public TrainingProgramResponse update(Long id) {


    	Role role = currentUserUtil.getCurrentUserRole();

    	if (role != Role.ADMIN && role != Role.PROGRAM_MANAGER) {
        throw new UnauthorizedOperationException(
                "Not authorized to deactivate training program");
    	}

    	TrainingProgram program = repository.findById(id)
    		.orElseThrow(() ->
                    new TrainingProgramNotFoundException("Program not found"));

    	if (program.getStatus() == Status.INACTIVE) {
        return TrainingProgramMapper.toResponse(program); // already deactivated
    	}

    	program.setStatus(Status.INACTIVE);

    	return TrainingProgramMapper.toResponse(repository.save(program));


    }

    @Override
    public void delete(Long id) {

        Role role = currentUserUtil.getCurrentUserRole();

        if (role != Role.ADMIN) {
            throw new UnauthorizedOperationException(
                    "Only ADMIN can delete training programs");
        }

        TrainingProgram program = repository.findById(id)
                .orElseThrow(() ->
                        new TrainingProgramNotFoundException(
                                "Training program not found"));

        program.setStatus(Status.INACTIVE);
        repository.save(program);
    }
}