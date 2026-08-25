package com.parivahan.backend.seeder;

import com.parivahan.backend.challan.entity.Challan;
import com.parivahan.backend.challan.enums.ChallanStatus;
import com.parivahan.backend.challan.repository.ChallanRepository;
import com.parivahan.backend.livelocation.entity.VehicleLocation;
import com.parivahan.backend.livelocation.repository.VehicleLocationRepository;
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

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * Seeds the database with mock data for development/testing.
 * Only runs when the database is empty.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class MockDataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final VehicleRepository vehicleRepository;
    private final RcRegistryRepository rcRegistryRepository;
    private final ChallanRepository challanRepository;
    private final VehicleLocationRepository vehicleLocationRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) {
        if (userRepository.count() > 0) {
            log.info("Database already seeded — skipping.");
            return;
        }
        log.info("=== Seeding mock data ===");
        seedUsers();
        seedRcRegistry();
        seedVehicles();
        log.info("=== Mock data seeding complete ===");
    }

    private void seedUsers() {
        User john = User.builder()
                .fullName("John Doe")
                .email("johndoe@example.com")
                .mobileNumber("9876543210")
                .password(passwordEncoder.encode("password123"))
                .preferredLanguage("English")
                .role(Role.CITIZEN)
                .build();
        userRepository.save(john);
        log.info("User seeded: johndoe@example.com / password123");
    }

    private void seedRcRegistry() {
        RcRegistry rc1 = RcRegistry.builder()
                .registrationNumber("MH12AB1234").ownerName("John Doe").ownerMobile("9876543210")
                .manufacturer("Tata Motors").model("Nexon").vehicleClass("SUV").fuelType("PETROL")
                .registrationDate("2021-08-15").rto("PUNE RTO").build();

        RcRegistry rc2 = RcRegistry.builder()
                .registrationNumber("DL01CA5678").ownerName("John Doe").ownerMobile("9876543210")
                .manufacturer("Hyundai").model("Creta").vehicleClass("SUV").fuelType("DIESEL")
                .registrationDate("2022-01-10").rto("DELHI RTO").build();

        rcRegistryRepository.save(rc1);
        rcRegistryRepository.save(rc2);
        log.info("RC registry seeded.");
    }

    private void seedVehicles() {
        User john = userRepository.findByEmail("johndoe@example.com").orElseThrow();

        // Nexon — PUC expiring soon, 1 pending challan
        Vehicle nexon = Vehicle.builder()
                .registrationNumber("MH12AB1234").nickname("My Nexon")
                .manufacturer("Tata Motors").model("Nexon").vehicleClass("SUV").fuelType("PETROL")
                .registrationDate("2021-08-15").rto("PUNE RTO")
                .insuranceProvider("HDFC ERGO")
                .vehicleImageUrl("https://imgd.aeplcdn.com/664x374/n/cw/ec/141867/nexon-exterior-right-front-three-quarter-6.jpeg")
                .insuranceValidTill(LocalDate.now().plusMonths(5))
                .pucValidTill(LocalDate.now().plusDays(17))
                .taxValidTill(LocalDate.now().plusMonths(8))
                .vehicleStatus(VehicleStatus.ACTIVE).user(john).build();
        nexon = vehicleRepository.save(nexon);

        // Creta — all documents valid
        Vehicle creta = Vehicle.builder()
                .registrationNumber("DL01CA5678").nickname("Delhi Creta")
                .manufacturer("Hyundai").model("Creta").vehicleClass("SUV").fuelType("DIESEL")
                .registrationDate("2022-01-10").rto("DELHI RTO")
                .insuranceProvider("Bajaj Allianz")
                .vehicleImageUrl("https://imgd.aeplcdn.com/664x374/n/cw/ec/19009/hyundai-creta-right-front-three-quarter.jpeg")
                .insuranceValidTill(LocalDate.now().plusMonths(10))
                .pucValidTill(LocalDate.now().plusMonths(6))
                .taxValidTill(LocalDate.now().plusMonths(14))
                .vehicleStatus(VehicleStatus.ACTIVE).user(john).build();
        creta = vehicleRepository.save(creta);
        log.info("Vehicles seeded.");

        // Pending challan for Nexon
        challanRepository.save(Challan.builder()
                .vehicle(nexon).offence("Signal Jump")
                .amount(new BigDecimal("1000.00"))
                .challanDate(LocalDate.now().minusDays(30))
                .status(ChallanStatus.PENDING).build());
        log.info("Challans seeded.");

        // Live locations
        vehicleLocationRepository.save(VehicleLocation.builder()
                .vehicle(nexon).latitude(18.5204).longitude(73.8567)
                .speed(46.0).heading("North").address("MG Road, Pune, Maharashtra")
                .lastUpdated(LocalDateTime.now().minusMinutes(2)).build());

        vehicleLocationRepository.save(VehicleLocation.builder()
                .vehicle(creta).latitude(28.6139).longitude(77.2090)
                .speed(0.0).heading("Parked").address("Connaught Place, New Delhi")
                .lastUpdated(LocalDateTime.now().minusHours(1)).build());
        log.info("Vehicle locations seeded.");
    }
}
