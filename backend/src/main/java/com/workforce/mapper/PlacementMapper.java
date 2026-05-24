package com.workforce.mapper;

import com.workforce.dto.PlacementResponse;
import com.workforce.entity.Placement;

public class PlacementMapper {

    public static PlacementResponse toResponse(Placement placement) {
        return new PlacementResponse(
                placement.getPlacementID(),
                placement.getApplication().getApplicationID(),
                placement.getEmployer().getEmployerID(),
                placement.getPosition(),
                placement.getStartDate(),
                placement.getStatus()
        );
    }
}
