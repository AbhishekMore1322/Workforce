package com.workforce.service.impl;

import com.workforce.config.CurrentUserUtil;
import com.workforce.dto.EmployerRequest;
import com.workforce.dto.EmployerResponse;
import com.workforce.entity.AuthUser;
import com.workforce.entity.Employer;
import com.workforce.enums.Role;
import com.workforce.enums.Status;
import com.workforce.exception.EmployerNotFoundException;
import com.workforce.exception.UnauthorizedOperationException;
import com.workforce.mapper.EmployerMapper;
import com.workforce.repository.EmployerRepository;
import com.workforce.service.EmployerService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class EmployerServiceImpl implements EmployerService {

    private final EmployerRepository employerRepository;
    private final CurrentUserUtil currentUserUtil;

    @Override
    public EmployerResponse register(EmployerRequest request) {

        AuthUser user = currentUserUtil.getCurrentUser();
        Role role = currentUserUtil.getCurrentUserRole();

        if (role != Role.EMPLOYER) {
            throw new UnauthorizedOperationException("Only EMPLOYER can register profile");
        }

        // UPDATED: Assuming repository updated to check via the User object or nested username
        if (employerRepository.existsByUser(user)) {
            throw new UnauthorizedOperationException("Employer profile already exists");
        }

        Employer employer = EmployerMapper.toEntity(request);
        // UPDATED: Set the AuthUser object instead of the String
        employer.setUser(user); 
        employer.setStatus(Status.PENDING);

        return EmployerMapper.toResponse(employerRepository.save(employer));
    }

    @Override
    public List<EmployerResponse> getAll() {
        Role role = currentUserUtil.getCurrentUserRole();
        if (role != Role.ADMIN && role != Role.OFFICER) {
            throw new UnauthorizedOperationException("Access Denied");
        }

        List<EmployerResponse> list = new ArrayList<>();
        for (Employer employer : employerRepository.findAll()) {
            list.add(EmployerMapper.toResponse(employer));
        }
        return list;
    }

    @Override
    public EmployerResponse getById(Long id) {

        Employer employer = employerRepository.findById(id)
                .orElseThrow(() -> new EmployerNotFoundException("Employer not found"));

        AuthUser user = currentUserUtil.getCurrentUser();
        Role role = currentUserUtil.getCurrentUserRole();

        // UPDATED: Accessed username via the User association
        if (role == Role.EMPLOYER &&
                !employer.getUser().getUsername().equals(user.getUsername())) {
            throw new UnauthorizedOperationException("Access denied");
        }

        return EmployerMapper.toResponse(employer);
    }

    @Override
    public EmployerResponse updateStatus(Long id, String status) {

        Role role = currentUserUtil.getCurrentUserRole();

        if (role != Role.ADMIN && role != Role.OFFICER) {
            throw new UnauthorizedOperationException("Not authorized");
        }

        Employer employer = employerRepository.findById(id)
                .orElseThrow(() -> new EmployerNotFoundException("Employer not found"));

        employer.setStatus(Status.valueOf(status));
        return EmployerMapper.toResponse(employerRepository.save(employer));
    }

    @Override
    public void delete(Long id) {

        Role role = currentUserUtil.getCurrentUserRole();

        if (role != Role.ADMIN) {
            throw new UnauthorizedOperationException("Only ADMIN can delete");
        }

        Employer employer = employerRepository.findById(id)
                .orElseThrow(() -> new EmployerNotFoundException("Employer not found"));

        employer.setStatus(Status.INACTIVE);
        employerRepository.save(employer);
    }
}