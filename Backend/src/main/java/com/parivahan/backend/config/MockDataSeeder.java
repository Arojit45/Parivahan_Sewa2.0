package com.parivahan.backend.config;

import com.parivahan.backend.user.domain.Role;
import com.parivahan.backend.user.domain.User;
import com.parivahan.backend.user.repository.UserRepository;
import com.parivahan.backend.vehicle.domain.RcRegistry;
import com.parivahan.backend.vehicle.domain.Vehicle;
import com.parivahan.backend.vehicle.enums.VehicleStatus;
import com.parivahan.backend.vehicle.repository.RcRegistryRepository;
import com.parivahan.backend.vehicle.repository.VehicleRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@RequiredArgsConstructor
@Slf4j
public class MockDataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final VehicleRepository vehicleRepository;
    private final RcRegistryRepository rcRegistryRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        seedMockData();
    }

    private void seedMockData() {
        if (userRepository.count() == 0) {
            log.info("Seeding initial mock user data...");
            User mockUser = User.builder()
                    .fullName("John Doe")
                    .email("johndoe@example.com")
                    .mobileNumber("9876543210")
                    .password(passwordEncoder.encode("password123"))
                    .preferredLanguage("English")
                    .role(Role.CITIZEN)
                    .build();
            userRepository.save(mockUser);
            log.info("Mock user created: johndoe@example.com / password123");
        }

        if (rcRegistryRepository.count() == 0) {
            log.info("Seeding authoritative RC registry data...");
            RcRegistry rc1 = RcRegistry.builder()
                    .registrationNumber("MH12AB1234")
                    .ownerName("John Doe")
                    .ownerMobile("9876543210")
                    .manufacturer("Tata Motors")
                    .model("Nexon")
                    .vehicleClass("SUV")
                    .fuelType("PETROL")
                    .registrationDate("2021-08-15")
                    .rto("PUNE RTO")
                    .build();

            RcRegistry rc2 = RcRegistry.builder()
                    .registrationNumber("DL01CA5678")
                    .ownerName("John Doe")
                    .ownerMobile("9876543210")
                    .manufacturer("Hyundai")
                    .model("Creta")
                    .vehicleClass("SUV")
                    .fuelType("DIESEL")
                    .registrationDate("2022-01-10")
                    .rto("DELHI RTO")
                    .build();

            rcRegistryRepository.save(rc1);
            rcRegistryRepository.save(rc2);
            log.info("Mock RC registry populated.");
        }
    }
}
