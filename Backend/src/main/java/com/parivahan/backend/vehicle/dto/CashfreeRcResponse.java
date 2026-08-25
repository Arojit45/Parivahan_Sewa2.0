package com.parivahan.backend.vehicle.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class CashfreeRcResponse {

    @JsonProperty("rc_number")
    private String rcNumber;

    @JsonProperty("registration_date")
    private String registrationDate;

    @JsonProperty("maker_model")
    private String makerModel;

    @JsonProperty("maker_description")
    private String makerDescription;

    @JsonProperty("vehicle_class")
    private String vehicleClass;

    @JsonProperty("fuel_type")
    private String fuelType;

    @JsonProperty("registered_at")
    private String registeredAt;
}
