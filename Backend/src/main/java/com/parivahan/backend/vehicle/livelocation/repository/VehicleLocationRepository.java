package com.parivahan.backend.vehicle.livelocation.repository;

import com.parivahan.backend.vehicle.livelocation.domain.VehicleLocation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface VehicleLocationRepository extends JpaRepository<VehicleLocation, Long> {
    Optional<VehicleLocation> findByVehicleId(Long vehicleId);
}
