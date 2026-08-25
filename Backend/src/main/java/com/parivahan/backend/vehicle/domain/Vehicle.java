package com.parivahan.backend.vehicle.domain;

import com.parivahan.backend.common.entity.BaseEntity;
import com.parivahan.backend.user.domain.User;
import com.parivahan.backend.vehicle.enums.VehicleStatus;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "vehicles")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class Vehicle extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String registrationNumber;

    private String manufacturer;
    private String model;
    private String vehicleClass;
    private String fuelType;
    private String registrationDate;
    private String rto;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private VehicleStatus vehicleStatus;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
}
