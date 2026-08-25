package com.parivahan.backend.vehicle.service;

import com.parivahan.backend.common.exception.ExternalApiException;
import com.parivahan.backend.common.exception.ResourceNotFoundException;
import com.parivahan.backend.user.domain.User;
import com.parivahan.backend.user.repository.UserRepository;
import com.parivahan.backend.vehicle.domain.Vehicle;
import com.parivahan.backend.vehicle.dto.CashfreeRcResponse;
import com.parivahan.backend.vehicle.dto.VehiclePublicResponse;
import com.parivahan.backend.vehicle.dto.VehicleOwnerResponse;
import com.parivahan.backend.vehicle.domain.RcRegistry;
import com.parivahan.backend.vehicle.dto.InitRegisterRequest;
import com.parivahan.backend.vehicle.dto.VerifyRegisterRequest;
import com.parivahan.backend.vehicle.repository.RcRegistryRepository;
import com.parivahan.backend.vehicle.enums.VehicleStatus;
import com.parivahan.backend.vehicle.repository.VehicleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class VehicleService {

    private final VehicleRepository vehicleRepository;
    private final UserRepository userRepository;
    private final RcRegistryRepository rcRegistryRepository;
    private final OtpService otpService;

    @Value("${cashfree.api.url}")
    private String cashfreeApiUrl;

    @Value("${cashfree.client.id}")
    private String clientId;

    @Value("${cashfree.client.secret}")
    private String clientSecret;

    @Transactional
    public String initRegistration(InitRegisterRequest request) {
        String regNum = request.getRegistrationNumber();

        // 1. Check if vehicle is already registered
        if (vehicleRepository.findByRegistrationNumber(regNum).isPresent()) {
            throw new IllegalArgumentException("Vehicle already registered in the system.");
        }

        // 2. Fetch authoritative mock data
        RcRegistry rcData = rcRegistryRepository.findByRegistrationNumber(regNum)
                .orElseThrow(() -> new ResourceNotFoundException("Registration number not found in authoritative database."));

        // 3. Get current user
        User currentUser = getCurrentUser();

        // 4. Verify ownership
        if (!rcData.getOwnerMobile().equals(currentUser.getMobileNumber())) {
            throw new IllegalArgumentException("Ownership verification failed. Mobile number mismatch.");
        }

        // 5. Generate and send OTP
        otpService.generateOtp(regNum);

        return "Ownership verified. OTP sent to registered mobile number.";
    }

    @Transactional
    public VehicleOwnerResponse verifyRegistration(VerifyRegisterRequest request) {
        String regNum = request.getRegistrationNumber();
        
        // 1. Verify OTP
        if (!otpService.verifyOtp(regNum, request.getOtp())) {
            throw new IllegalArgumentException("Invalid or expired OTP.");
        }

        // 2. Fetch authoritative mock data
        RcRegistry rcData = rcRegistryRepository.findByRegistrationNumber(regNum)
                .orElseThrow(() -> new ResourceNotFoundException("Registration number not found."));

        // 3. Get current user
        User currentUser = getCurrentUser();

        // 4. Map and Save Vehicle
        Vehicle vehicle = Vehicle.builder()
                .registrationNumber(rcData.getRegistrationNumber())
                .manufacturer(rcData.getManufacturer())
                .model(rcData.getModel())
                .vehicleClass(rcData.getVehicleClass())
                .fuelType(rcData.getFuelType())
                .registrationDate(rcData.getRegistrationDate())
                .rto(rcData.getRto())
                .vehicleStatus(VehicleStatus.ACTIVE)
                .user(currentUser)
                .build();

        Vehicle savedVehicle = vehicleRepository.save(vehicle);
        return mapToOwnerResponse(savedVehicle);
    }

    private User getCurrentUser() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String username;
        if (principal instanceof UserDetails) {
            username = ((UserDetails) principal).getUsername();
        } else {
            username = principal.toString();
        }
        return userRepository.findByEmail(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    @Transactional(readOnly = true)
    public VehiclePublicResponse getVehicleInfo(String registrationNumber) {
        Vehicle vehicle = vehicleRepository.findByRegistrationNumber(registrationNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle not found with registration number: " + registrationNumber));
        
        // Get current user
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String username = "";
        if (principal instanceof UserDetails) {
            username = ((UserDetails) principal).getUsername();
        } else if (principal != null) {
            username = principal.toString();
        }

        if (vehicle.getUser().getEmail().equals(username)) {
            return mapToOwnerResponse(vehicle);
        } else {
            return mapToPublicResponse(vehicle);
        }
    }


    private VehicleOwnerResponse mapToOwnerResponse(Vehicle vehicle) {
        return VehicleOwnerResponse.builder()
                .id(vehicle.getId())
                .registrationNumber(vehicle.getRegistrationNumber())
                .manufacturer(vehicle.getManufacturer())
                .model(vehicle.getModel())
                .vehicleClass(vehicle.getVehicleClass())
                .fuelType(vehicle.getFuelType())
                .registrationDate(vehicle.getRegistrationDate())
                .rto(vehicle.getRto())
                .vehicleStatus(vehicle.getVehicleStatus())
                .build();
    }

    private VehiclePublicResponse mapToPublicResponse(Vehicle vehicle) {
        return VehiclePublicResponse.builder()
                .registrationNumber(vehicle.getRegistrationNumber())
                .manufacturer(vehicle.getManufacturer())
                .model(vehicle.getModel())
                .vehicleClass(vehicle.getVehicleClass())
                .fuelType(vehicle.getFuelType())
                .rto(vehicle.getRto())
                .build();
    }
}
