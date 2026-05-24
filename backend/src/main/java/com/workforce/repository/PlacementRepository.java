package com.workforce.repository;

import com.workforce.entity.Placement;
import com.workforce.enums.PlacementStatus;


import org.springframework.data.jpa.repository.JpaRepository;

public interface PlacementRepository extends JpaRepository<Placement, Long> {

	 long countByStatus(PlacementStatus status);
}