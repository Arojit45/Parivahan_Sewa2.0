package com.parivahan.backend.vehicle.livelocation.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class VehicleTwinDto {
    private Double latitude;
    private Double longitude;
    private Double speed;
    private String heading;
    private String address;
    private LocalDateTime lastUpdated;
}
