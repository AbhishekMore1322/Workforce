package com.workforce.service.impl;

import com.workforce.config.CurrentUserUtil;
import com.workforce.dto.NotificationRequest;
import com.workforce.dto.PlacementRequest;
import com.workforce.dto.PlacementResponse;
import com.workforce.entity.Application;
import com.workforce.entity.AuthUser;
import com.workforce.entity.Placement;
import com.workforce.enums.NotificationCategory;
import com.workforce.enums.PlacementStatus;
import com.workforce.enums.Role;
import com.workforce.exception.ApplicationNotFoundException;
import com.workforce.exception.PlacementNotFoundException;
import com.workforce.exception.UnauthorizedOperationException;
import com.workforce.mapper.PlacementMapper;
import com.workforce.repository.ApplicationRepository;
import com.workforce.repository.PlacementRepository;
import com.workforce.service.NotificationService;
import com.workforce.service.PlacementService;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class PlacementServiceImpl implements PlacementService {

    private final PlacementRepository placementRepository;
    private final ApplicationRepository applicationRepository;
    private final NotificationService notificationService;
    private final CurrentUserUtil currentUserUtil;

    @Override
    public PlacementResponse create(PlacementRequest request) {

        Role role = currentUserUtil.getCurrentUserRole();
        AuthUser user = currentUserUtil.getCurrentUser();

        if (role != Role.EMPLOYER && role != Role.OFFICER) {
            throw new UnauthorizedOperationException("Not authorized to create placement");
        }

        Application application = applicationRepository.findById(request.getApplicationID())
                .orElseThrow(() ->
                        new ApplicationNotFoundException("Application not found"));

        // UPDATED: Changed .getUserUsername() to .getUser().getUsername()
        if (role == Role.EMPLOYER &&
            !application.getJob()
                        .getEmployer()
                        .getUser()
                        .getUsername()
                        .equals(user.getUsername())) {
            throw new UnauthorizedOperationException("Not your application");
        }

        Placement placement = new Placement();
        placement.setApplication(application);
        placement.setEmployer(application.getJob().getEmployer());
        placement.setPosition(request.getPosition());
        placement.setStartDate(request.getStartDate());
        placement.setStatus(PlacementStatus.CREATED);

        Placement saved = placementRepository.save(placement);

        notificationService.send(
                new NotificationRequest(
                        application.getSeeker().getUser().getUsername(), // UPDATED
                        "You have been placed successfully. Position: " +
                                saved.getPosition(),
                        NotificationCategory.JOB,
                        saved.getPlacementID()
                )
        );

        return PlacementMapper.toResponse(saved);
    }

    @Override
    public List<PlacementResponse> getAll() {

        Role role = currentUserUtil.getCurrentUserRole();
        if (role != Role.ADMIN && role != Role.	OFFICER&&role!=Role.EMPLOYER) {
            throw new UnauthorizedOperationException("Access denied");
        }

        return placementRepository.findAll()
                .stream()
                .map(PlacementMapper::toResponse)
                .toList();
    }

    @Override
    public PlacementResponse getById(Long id) {

        Placement placement = placementRepository.findById(id)
                .orElseThrow(() ->
                        new PlacementNotFoundException("Placement not found"));

        Role role = currentUserUtil.getCurrentUserRole();
        String username = currentUserUtil.getCurrentUser().getUsername();

        // UPDATED: Changed .getUserUsername() to .getUser().getUsername()
        if (role == Role.EMPLOYER &&
            !placement.getEmployer().getUser().getUsername().equals(username)) {
            throw new UnauthorizedOperationException("Access denied");
        }

        return PlacementMapper.toResponse(placement);
    }

    @Override
    public PlacementResponse updateStatus(Long id, String status) {

        Placement placement = placementRepository.findById(id)
                .orElseThrow(() ->
                        new PlacementNotFoundException("Placement not found"));

        Role role = currentUserUtil.getCurrentUserRole();
        if (role != Role.ADMIN && role != Role.OFFICER && role != Role.EMPLOYER) {
            throw new UnauthorizedOperationException("Not authorized");
        }

        try {
            placement.setStatus(PlacementStatus.valueOf(status.toUpperCase()));
        } catch (IllegalArgumentException ex) {
            throw new UnauthorizedOperationException("Invalid placement status");
        }

        return PlacementMapper.toResponse(
                placementRepository.save(placement));
    }

    @Override
    public void delete(Long id) {

        Role role = currentUserUtil.getCurrentUserRole();
        if (role != Role.ADMIN) {
            throw new UnauthorizedOperationException("Only ADMIN can delete placement");
        }

        Placement placement = placementRepository.findById(id)
                .orElseThrow(() ->
                        new PlacementNotFoundException("Placement not found"));

        placement.setStatus(PlacementStatus.CANCELLED);
        placementRepository.save(placement);
    }
}