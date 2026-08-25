package com.parivahan.backend.vehicle.repository;

import com.parivahan.backend.vehicle.domain.Challan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChallanRepository extends JpaRepository<Challan, Long> {
    List<Challan> findByVehicleIdAndPaidFalse(Long vehicleId);
}
