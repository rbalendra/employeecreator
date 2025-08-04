package nology.employeecreator.config;

import java.time.LocalDate;
import java.util.Random;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

import com.github.javafaker.Faker;

import nology.employeecreator.employee.ContractType;
import nology.employeecreator.employee.Employee;
import nology.employeecreator.employee.EmployeeRepository;
import nology.employeecreator.employee.EmployeeRole;
import nology.employeecreator.employee.EmploymentBasis;

@Component
@Profile("dev")
public class DataSeeder implements CommandLineRunner {

    private final EmployeeRepository employeeRepository;
    private final Faker faker;
    private final Random random;

    public DataSeeder(EmployeeRepository employeeRepository) {
        this.employeeRepository = employeeRepository;
        this.faker = new Faker();
        this.random = new Random();
    }

    @Override
    public void run(String... args) {
        // Only seed if database is empty
        if (employeeRepository.count() == 0) {
            System.out.println("🌱 Seeding database with 30 employee records...");
            
            for (int i = 0; i < 30; i++) {
                Employee employee = createFakeEmployee();
                employeeRepository.save(employee);
                System.out.println("✅ Created employee: " + employee.getFirstName() + " " + employee.getLastName() + " (" + employee.getRole() + ")");
            }
            
            System.out.println("🎉 Database seeding completed!");
        } else {
            System.out.println("📊 Database already contains data, skipping seeding.");
        }
    }

    private Employee createFakeEmployee() {
        Employee employee = new Employee();
        
        // Personal Information
        employee.setFirstName(faker.name().firstName());
        // 30% chance of having a middle name
        if (random.nextDouble() < 0.3) {
            employee.setMiddleName(faker.name().firstName());
        }
        employee.setLastName(faker.name().lastName());
        
        // Contact Information
        employee.setEmail(generateUniqueEmail(employee.getFirstName(), employee.getLastName()));
        employee.setMobileNumber(generateAustralianMobile());
        employee.setResidentialAddress(generateAustralianAddress());
        
        // Profile Photo (40% chance of having one)
        if (random.nextDouble() < 0.4) {
            employee.setThumbnailUrl(faker.internet().avatar());
        }
        
        // Employment Details
        employee.setContractType(random.nextBoolean() ? ContractType.PERMANENT : ContractType.CONTRACT);
        employee.setEmploymentBasis(random.nextBoolean() ? EmploymentBasis.FULL_TIME : EmploymentBasis.PART_TIME);
        
        // Generate realistic start date (between 5 years ago and 1 year ago)
        LocalDate startDate = LocalDate.now().minusDays(random.nextInt(365 * 5) + 365);
        employee.setStartDate(startDate);
        
        // Determine if ongoing (85% chance of being ongoing)
        boolean ongoing = random.nextDouble() < 0.85;
        employee.setOngoing(ongoing);
        
        if (!ongoing) {
            // If not ongoing, set finish date between start date and now
            LocalDate finishDate = startDate.plusDays(random.nextInt((int) startDate.until(LocalDate.now()).getDays()));
            employee.setFinishDate(finishDate);
        }
        
        // Hours per week based on employment basis
        if (employee.getEmploymentBasis() == EmploymentBasis.FULL_TIME) {
            employee.setHoursPerWeek(35 + random.nextInt(6)); // 35-40 hours
        } else {
            employee.setHoursPerWeek(15 + random.nextInt(21)); // 15-35 hours
        }
        
         // Role assignment with realistic distribution
        double roleChance = random.nextDouble();
        
        if (roleChance < 0.03) { // 3% Admin (approx 1 out of 30)
            employee.setRole(EmployeeRole.ADMIN);
            System.out.println("🔑 Created ADMIN: " + employee.getFirstName() + " " + employee.getLastName());
        } else if (roleChance < 0.10) { // 7% HR
            employee.setRole(EmployeeRole.HR);
        } else if (roleChance < 0.25) { // 15% Manager
            employee.setRole(EmployeeRole.MANAGER);
        } else if (roleChance < 0.80) { // 55% Employee
            employee.setRole(EmployeeRole.EMPLOYEE);
        } else if (roleChance < 0.93) { // 13% Intern
            employee.setRole(EmployeeRole.INTERN);
        } else { // 7% Contractor
            employee.setRole(EmployeeRole.CONTRACTOR);
        }


        return employee;
    }

    private String generateUniqueEmail(String firstName, String lastName) {
        // Create a unique email to avoid conflicts
        String baseEmail = firstName.toLowerCase() + "." + lastName.toLowerCase();
        String domain = faker.options().option("gmail.com", "yahoo.com", "outlook.com", "company.com.au");
        return baseEmail + random.nextInt(1000) + "@" + domain;
    }

    private String generateAustralianMobile() {
        // Generate Australian mobile format: 04XXXXXXXX
        return "04" + String.format("%08d", random.nextInt(100000000));
    }

    private String generateAustralianAddress() {
        // Generate realistic Australian addresses
        String[] states = {"NSW", "VIC", "QLD", "WA", "SA", "TAS", "ACT", "NT"};
        String[] suburbs = {
            "Sydney", "Melbourne", "Brisbane", "Perth", "Adelaide", "Hobart", "Canberra", "Darwin",
            "Parramatta", "Blacktown", "Newcastle", "Gold Coast", "Townsville", "Cairns", "Toowoomba",
            "Ballarat", "Bendigo", "Albury", "Launceston", "Mackay", "Rockhampton", "Bunbury",
            "Bundaberg", "Coffs Harbour", "Wagga Wagga", "Hervey Bay", "Mildura", "Shepparton"
        };
        
        String streetNumber = String.valueOf(1 + random.nextInt(999));
        String streetName = faker.address().streetName();
        String suburb = suburbs[random.nextInt(suburbs.length)];
        String state = states[random.nextInt(states.length)];
        String postcode = String.valueOf(1000 + random.nextInt(8999));
        
        return streetNumber + " " + streetName + ", " + suburb + " " + state + " " + postcode;
    }
}