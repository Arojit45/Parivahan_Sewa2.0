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
 * Checks per-email so it can safely run on a non-empty database
 * and still add new test users if they are missing.
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
        log.info("=== Running MockDataSeeder ===");
        seedJohnDoe();
        seedSinha();
        seedPaula();
        seedRcRegistry();
        log.info("=== MockDataSeeder complete ===");
    }

    // johndoe@example.com — original dev user
    private void seedJohnDoe() {
        if (userRepository.findByEmail("johndoe@example.com").isPresent()) return;

        User john = userRepository.save(User.builder()
                .fullName("John Doe")
                .email("johndoe@example.com")
                .mobileNumber("9876543210")
                .password(passwordEncoder.encode("password123"))
                .preferredLanguage("English")
                .role(Role.CITIZEN)
                .build());
        log.info("Seeded: johndoe@example.com / password123");

        Vehicle nexon = vehicleRepository.save(Vehicle.builder()
                .registrationNumber("MH12AB1234").nickname("My Nexon")
                .manufacturer("Tata Motors").model("Nexon").vehicleClass("SUV").fuelType("PETROL")
                .registrationDate("2021-08-15").rto("PUNE RTO")
                .insuranceProvider("HDFC ERGO")
                .vehicleImageUrl("https://imgd.aeplcdn.com/664x374/n/cw/ec/141867/nexon-exterior-right-front-three-quarter-6.jpeg")
                .insuranceValidTill(LocalDate.now().plusMonths(5))
                .pucValidTill(LocalDate.now().plusDays(17))
                .taxValidTill(LocalDate.now().plusMonths(8))
                .vehicleStatus(VehicleStatus.ACTIVE).user(john).build());

        vehicleRepository.save(Vehicle.builder()
                .registrationNumber("DL01CA5678").nickname("Delhi Creta")
                .manufacturer("Hyundai").model("Creta").vehicleClass("SUV").fuelType("DIESEL")
                .registrationDate("2022-01-10").rto("DELHI RTO")
                .insuranceProvider("Bajaj Allianz")
                .vehicleImageUrl("https://imgd.aeplcdn.com/664x374/n/cw/ec/19009/hyundai-creta-right-front-three-quarter.jpeg")
                .insuranceValidTill(LocalDate.now().plusMonths(10))
                .pucValidTill(LocalDate.now().plusMonths(6))
                .taxValidTill(LocalDate.now().plusMonths(14))
                .vehicleStatus(VehicleStatus.ACTIVE).user(john).build());

        challanRepository.save(Challan.builder()
                .vehicle(nexon).offence("Signal Jump")
                .amount(new BigDecimal("1000.00"))
                .challanDate(LocalDate.now().minusDays(30))
                .status(ChallanStatus.PENDING).build());

        vehicleLocationRepository.save(VehicleLocation.builder()
                .vehicle(nexon).latitude(18.5204).longitude(73.8567)
                .speed(46.0).heading("North").address("MG Road, Pune, Maharashtra")
                .lastUpdated(LocalDateTime.now().minusMinutes(2)).build());
    }

    // sinhaarijit368@gmail.com — full dashboard test user WITH vehicles
    private void seedSinha() {
        if (userRepository.findByEmail("sinhaarijit368@gmail.com").isPresent()) return;

        User sinha = userRepository.save(User.builder()
                .fullName("Arijit Sinha")
                .email("sinhaarijit368@gmail.com")
                .mobileNumber("9812345678")
                .password(passwordEncoder.encode("password123"))
                .preferredLanguage("English")
                .role(Role.CITIZEN)
                .build());
        log.info("Seeded: sinhaarijit368@gmail.com / password123");

        Vehicle creta = vehicleRepository.save(Vehicle.builder()
                .registrationNumber("WB12AB1234").nickname("My Creta")
                .manufacturer("Hyundai").model("Creta").vehicleClass("SUV").fuelType("PETROL")
                .registrationDate("2022-09-11").rto("KOLKATA (WB-12)")
                .insuranceProvider("HDFC ERGO")
                .vehicleImageUrl("https://imgd.aeplcdn.com/664x374/n/cw/ec/19009/hyundai-creta-right-front-three-quarter.jpeg")
                .insuranceValidTill(LocalDate.now().plusMonths(7))
                .pucValidTill(LocalDate.now().plusDays(17))
                .taxValidTill(LocalDate.now().plusMonths(9))
                .vehicleStatus(VehicleStatus.ACTIVE).user(sinha).build());

        challanRepository.save(Challan.builder()
                .vehicle(creta).offence("Signal Jump")
                .amount(new BigDecimal("1000.00"))
                .challanDate(LocalDate.now().minusDays(30))
                .status(ChallanStatus.PENDING).build());

        vehicleLocationRepository.save(VehicleLocation.builder()
                .vehicle(creta).latitude(22.5726).longitude(88.3639)
                .speed(46.0).heading("North").address("Park Street, Kolkata, West Bengal")
                .lastUpdated(LocalDateTime.now().minusMinutes(2)).build());

        Vehicle nexon = vehicleRepository.save(Vehicle.builder()
                .registrationNumber("WB02ZA5678").nickname("Nexon EV")
                .manufacturer("Tata Motors").model("Nexon EV").vehicleClass("SUV").fuelType("ELECTRIC")
                .registrationDate("2023-03-15").rto("KOLKATA (WB-02)")
                .insuranceProvider("Bajaj Allianz")
                .vehicleImageUrl("https://imgd.aeplcdn.com/664x374/n/cw/ec/141867/nexon-exterior-right-front-three-quarter-6.jpeg")
                .insuranceValidTill(LocalDate.now().plusMonths(14))
                .pucValidTill(LocalDate.now().plusMonths(10))
                .taxValidTill(LocalDate.now().plusMonths(18))
                .vehicleStatus(VehicleStatus.ACTIVE).user(sinha).build());

        vehicleLocationRepository.save(VehicleLocation.builder()
                .vehicle(nexon).latitude(22.5958).longitude(88.4028)
                .speed(0.0).heading("Parked").address("Salt Lake Sector V, Kolkata, West Bengal")
                .lastUpdated(LocalDateTime.now().minusHours(3)).build());
    }

    // paularijit368@gmail.com — primary test user with full mock data
    private void seedPaula() {
        User paula = userRepository.findByEmail("paularijit368@gmail.com").orElseGet(() -> {
            User newUser = userRepository.save(User.builder()
                    .fullName("Arijit Paul")
                    .email("paularijit368@gmail.com")
                    .mobileNumber("9000012345")
                    .password(passwordEncoder.encode("password123"))
                    .preferredLanguage("English")
                    .role(Role.CITIZEN)
                    .build());
            log.info("Seeded: paularijit368@gmail.com / password123");
            return newUser;
        });

        // --- Vehicle 1: Tata Nexon — insurance expiring soon, diverse challans ---
        Vehicle nexon = vehicleRepository.findByRegistrationNumber("KA03MN4567").orElseGet(() -> {
            Vehicle v = vehicleRepository.save(Vehicle.builder()
                    .registrationNumber("KA03MN4567").nickname("My Nexon")
                    .manufacturer("Tata Motors").model("Nexon").vehicleClass("SUV").fuelType("PETROL")
                    .registrationDate("2020-05-20").rto("BENGALURU (KA-03)")
                    .insuranceProvider("HDFC ERGO")
                    .vehicleImageUrl("https://imgd.aeplcdn.com/664x374/n/cw/ec/141867/nexon-exterior-right-front-three-quarter-6.jpeg")
                    .insuranceValidTill(LocalDate.now().plusDays(20))
                    .pucValidTill(LocalDate.now().plusMonths(4))
                    .taxValidTill(LocalDate.now().plusMonths(11))
                    .vehicleStatus(VehicleStatus.ACTIVE).user(paula).build());
                    
            vehicleLocationRepository.save(VehicleLocation.builder()
                    .vehicle(v).latitude(12.9352).longitude(77.6245)
                    .speed(55.0).heading("East").address("Koramangala, Bengaluru, Karnataka")
                    .lastUpdated(LocalDateTime.now().minusMinutes(8)).build());
            log.info("Seeded Nexon for paularijit368@gmail.com");
            return v;
        });

        if (challanRepository.findPendingByVehicleId(nexon.getId()).isEmpty() && 
            challanRepository.findAllByUserId(paula.getId()).stream().noneMatch(c -> c.getVehicle().getId().equals(nexon.getId()))) {
            // Pending challan
            challanRepository.save(Challan.builder()
                    .vehicle(nexon).offence("Over Speeding")
                    .amount(new BigDecimal("2000.00"))
                    .challanDate(LocalDate.now().minusDays(15))
                    .status(ChallanStatus.PENDING).build());

            // Overdue challan (challanDate > 30 days ago, never paid)
            challanRepository.save(Challan.builder()
                    .vehicle(nexon).offence("Signal Jumping")
                    .amount(new BigDecimal("1500.00"))
                    .challanDate(LocalDate.now().minusDays(45))
                    .status(ChallanStatus.PENDING).build());

            // Paid challan
            challanRepository.save(Challan.builder()
                    .vehicle(nexon).offence("No Parking")
                    .amount(new BigDecimal("500.00"))
                    .challanDate(LocalDate.now().minusDays(60))
                    .status(ChallanStatus.PAID)
                    .paymentDate(LocalDate.now().minusDays(55))
                    .transactionId("TXN-NEXON001").build());

            // Disputed challan
            challanRepository.save(Challan.builder()
                    .vehicle(nexon).offence("Wrong Parking")
                    .amount(new BigDecimal("1000.00"))
                    .challanDate(LocalDate.now().minusDays(20))
                    .status(ChallanStatus.DISPUTED).build());

            log.info("Seeded diverse challans for Nexon");
        }

        // --- Vehicle 2: Honda City — all docs healthy, mix of challans ---
        Vehicle city = vehicleRepository.findByRegistrationNumber("KA01PQ7890").orElseGet(() -> {
            Vehicle v = vehicleRepository.save(Vehicle.builder()
                    .registrationNumber("KA01PQ7890").nickname("City Cruiser")
                    .manufacturer("Honda").model("City").vehicleClass("SEDAN").fuelType("PETROL")
                    .registrationDate("2021-11-10").rto("BENGALURU (KA-01)")
                    .insuranceProvider("Bajaj Allianz")
                    .vehicleImageUrl("https://imgd.aeplcdn.com/664x374/n/cw/ec/27074/city-exterior-right-front-three-quarter-2.jpeg")
                    .insuranceValidTill(LocalDate.now().plusMonths(11))
                    .pucValidTill(LocalDate.now().plusMonths(8))
                    .taxValidTill(LocalDate.now().plusMonths(16))
                    .vehicleStatus(VehicleStatus.ACTIVE).user(paula).build());
                    
            vehicleLocationRepository.save(VehicleLocation.builder()
                    .vehicle(v).latitude(12.9767).longitude(77.5713)
                    .speed(0.0).heading("Parked").address("Indiranagar, Bengaluru, Karnataka")
                    .lastUpdated(LocalDateTime.now().minusHours(2)).build());
            log.info("Seeded City for paularijit368@gmail.com");
            return v;
        });

        if (challanRepository.findPendingByVehicleId(city.getId()).isEmpty() && 
            challanRepository.findAllByUserId(paula.getId()).stream().noneMatch(c -> c.getVehicle().getId().equals(city.getId()))) {
            // Pending challan
            challanRepository.save(Challan.builder()
                    .vehicle(city).offence("No Helmet")
                    .amount(new BigDecimal("500.00"))
                    .challanDate(LocalDate.now().minusDays(5))
                    .status(ChallanStatus.PENDING).build());

            // Paid challan
            challanRepository.save(Challan.builder()
                    .vehicle(city).offence("Triple Riding")
                    .amount(new BigDecimal("1000.00"))
                    .challanDate(LocalDate.now().minusDays(90))
                    .status(ChallanStatus.PAID)
                    .paymentDate(LocalDate.now().minusDays(85))
                    .transactionId("TXN-CITY001").build());

            log.info("Seeded diverse challans for City");
        }
    }

    // RC Registry entries for vehicle registration flow
    private void seedRcRegistry() {
        saveRcIfAbsent("MH12AB1234", "John Doe",     "9876543210", "Tata Motors",   "Nexon",    "SUV",       "PETROL",   "2021-08-15", "PUNE RTO");
        saveRcIfAbsent("DL01CA5678", "John Doe",     "9876543210", "Hyundai",       "Creta",    "SUV",       "DIESEL",   "2022-01-10", "DELHI RTO");
        saveRcIfAbsent("WB12AB1234", "Arijit Sinha", "9812345678", "Hyundai",       "Creta",    "SUV",       "PETROL",   "2022-09-11", "KOLKATA (WB-12)");
        saveRcIfAbsent("WB02ZA5678", "Arijit Sinha", "9812345678", "Tata Motors",   "Nexon EV", "SUV",       "ELECTRIC", "2023-03-15", "KOLKATA (WB-02)");
        saveRcIfAbsent("KA03MN4567", "Arijit Paul",  "9000012345", "Tata Motors",   "Nexon",    "SUV",       "PETROL",   "2020-05-20", "BENGALURU (KA-03)");
        saveRcIfAbsent("KA01PQ7890", "Arijit Paul",  "9000012345", "Honda",         "City",     "SEDAN",     "PETROL",   "2021-11-10", "BENGALURU (KA-01)");
        saveRcIfAbsent("KA01XY9999", "John Doe",     "9876543210", "Maruti Suzuki", "Swift",    "HATCHBACK", "PETROL",   "2023-03-20", "BENGALURU RTO");
        saveRcIfAbsent("MH02ZZ1111", "John Doe",     "9876543210", "Honda",         "City",     "SEDAN",     "PETROL",   "2020-11-05", "MUMBAI RTO");
    }

    private void saveRcIfAbsent(String regNum, String ownerName, String ownerMobile,
                                 String manufacturer, String model, String vehicleClass,
                                 String fuelType, String regDate, String rto) {
        if (rcRegistryRepository.findByRegistrationNumber(regNum).isPresent()) return;
        rcRegistryRepository.save(RcRegistry.builder()
                .registrationNumber(regNum).ownerName(ownerName).ownerMobile(ownerMobile)
                .manufacturer(manufacturer).model(model).vehicleClass(vehicleClass)
                .fuelType(fuelType).registrationDate(regDate).rto(rto).build());
    }
}
