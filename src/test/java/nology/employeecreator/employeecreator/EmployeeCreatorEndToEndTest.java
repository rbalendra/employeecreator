package nology.employeecreator.employeecreator;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;


import nology.employeecreator.employee.ContractType;
import nology.employeecreator.employee.EmploymentBasis;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.http.HttpStatus;
import org.springframework.test.context.ActiveProfiles;

import io.restassured.RestAssured;
import io.restassured.http.ContentType;
import nology.employeecreator.employee.Employee;
import nology.employeecreator.employee.EmployeeRepository;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
public class EmployeeCreatorEndToEndTest {

        @LocalServerPort
        private int port;

        @Autowired
        private EmployeeRepository employeeRepository;

        private ArrayList<Employee> employee = new ArrayList<>();

        @BeforeEach
        public void setUp() {
            RestAssured.port = port; //sets the port for Rest Assured to use

            this.employeeRepository.deleteAll(); //clear the database before each test
            this.employee.clear(); // clear the list of employees before each test
        
            //set up some data and save it in the database
            Employee employee1 = new Employee();
            employee1.setFirstName("John");
            employee1.setLastName("Doe");
            employee1.setEmail("john.doe@gmail.com");
            employee1.setMobileNumber("0410123456");
            employee1.setResidentialAddress("123 Sydney Road, Sydney NSW 2000");
            employee1.setContractType(ContractType.PERMANENT);
            employee1.setStartDate(LocalDate.of(2023, 1, 15));
            employee1.setOngoing(true);
            employee1.setEmploymentBasis(EmploymentBasis.FULL_TIME);
            employee1.setHoursPerWeek(38);
            employee1.setThumbnailUrl("https://example.com/john-photo.jpg");

            // Employee 2 - Part-time contract
            Employee employee2 = new Employee();
            employee2.setFirstName("Sarah");
            employee2.setMiddleName("Jane");
            employee2.setLastName("Smith");
            employee2.setEmail("sarah.smith@gmail.com");
            employee2.setMobileNumber("0422333444");
            employee2.setResidentialAddress("456 Melbourne Ave, Melbourne VIC 3000");
            employee2.setContractType(ContractType.CONTRACT);
            employee2.setStartDate(LocalDate.of(2024, 2, 1));
            employee2.setFinishDate(LocalDate.of(2025, 2, 1));
            employee2.setOngoing(false);
            employee2.setEmploymentBasis(EmploymentBasis.PART_TIME);
            employee2.setHoursPerWeek(24);

            // Employee 3 - Full-time contract
            Employee employee3 = new Employee();
            employee3.setFirstName("Michael");
            employee3.setLastName("Wong");
            employee3.setEmail("michael.wong@gmail.com");
            employee3.setMobileNumber("0433555666");
            employee3.setContractType(ContractType.CONTRACT);
            employee3.setStartDate(LocalDate.of(2024, 1, 1));
            employee3.setFinishDate(LocalDate.of(2024, 12, 31));
            employee3.setOngoing(false);
            employee3.setEmploymentBasis(EmploymentBasis.FULL_TIME);
            employee3.setHoursPerWeek(40);

            //Save to respository and add to list
            this.employeeRepository.save(employee1);
            this.employeeRepository.save(employee2);
            this.employeeRepository.save(employee3);
            this.employee.add(employee1);
            this.employee.add(employee2);
            this.employee.add(employee3);

        }

        // Test for getting all employees /api/employees endpoint
    @Test
    public void getAllEmployees_EmployeesInDatabase_ResturnsSucesss(){
            RestAssured.given()
                .when()
                .get("/api/employees")
                .then()
                .statusCode(HttpStatus.OK.value())
                .body("size()", org.hamcrest.Matchers.is(employee.size()));
    }


    // Test for getting all employees with empty database
    @Test
    public void getAllEmployees_NoEmployeesInDatabase_ReturnsEmptyList() {
        this.employeeRepository.deleteAll(); // Clear the database
        RestAssured.given()
            .when()
            .get("/api/employees")
            .then()
            .statusCode(200)
            .body("size()", org.hamcrest.Matchers.is(0));
    }

    //Test for invalid ID for getting an employee

    @Test
    public void getEmployee_InvalidId_ReturnsNotFound() {
            Long largeId = 9999L; // Assuming this ID does not exist in the database
        RestAssured.given()
            .when()
            .get("/api/employees/" + largeId) // Assuming 9999 is an ID that doesn't exist
            .then()
            .statusCode(HttpStatus.NOT_FOUND.value()); // Not Found
    }


    // Post test for creating an employee

    @Test
    public void createEmployee_WhenPassedValidData_ReturnsCreated() {
        HashMap<String, String> newEmployee = new HashMap<String, String>();
        newEmployee.put("firstName", "John");
        newEmployee.put("lastName", "Johnson");
        newEmployee.put("email", "john.johnson@gmail.com");
        newEmployee.put("mobileNumber", "0456789012");
        newEmployee.put("residentialAddress", "789 Brisbane St, Brisbane QLD 4000");
        newEmployee.put("contractType", "PERMANENT");
        newEmployee.put("startDate", "2023-03-01");
        newEmployee.put("ongoing", "true");
        newEmployee.put("employmentBasis", "FULL_TIME");
        newEmployee.put("hoursPerWeek", "38");
        // Post request to create a new employee
        RestAssured.given().contentType(ContentType.JSON)
                .body(newEmployee)
                .when()
                .post("/api/employees")
                .then()
                .statusCode(HttpStatus.CREATED.value())
                .body("firstName", org.hamcrest.Matchers.is("John"))
                .body("lastName", org.hamcrest.Matchers.is("Johnson"))
                .body("email", org.hamcrest.Matchers.is("john.johnson@gmail.com"))
                .body("mobileNumber", org.hamcrest.Matchers.is("0456789012"))
                .body("residentialAddress", org.hamcrest.Matchers.is("789 Brisbane St, Brisbane QLD 4000"))
                .body("contractType", org.hamcrest.Matchers.is("PERMANENT"))
                .body("startDate", org.hamcrest.Matchers.is("2023-03-01"))
                .body("ongoing", org.hamcrest.Matchers.is(true))
                .body("employmentBasis", org.hamcrest.Matchers.is("FULL_TIME"))
                .body("hoursPerWeek", org.hamcrest.Matchers.is(38));
    }

    // Test for creating an employee with invalid data
    @Test
    public void createEmployee_WhenPassedInvalidData_ReturnsBadRequest() {
        HashMap<String, String> newEmployee = new HashMap<String, String>();
        newEmployee.put("firstName", ""); // Invalid first name (empty)
        newEmployee.put("lastName", "Doe");
        newEmployee.put("email", "Doe@gmail.com");
        newEmployee.put("mobileNumber", "0412345678");
        newEmployee.put("residentialAddress", "123 Sydney Road, Sydney NSW 2000");
        newEmployee.put("contractType", "PERMANENT");
        newEmployee.put("startDate", "2023-01-15");
        newEmployee.put("ongoing", "true");
        newEmployee.put("employmentBasis", "FULL_TIME");
        newEmployee.put("hoursPerWeek", "38");
        // Post request to create a new employee with invalid data
        RestAssured.given().contentType(ContentType.JSON)
                .body(newEmployee)
                .when()
                .post("/api/employees")
                .then()
                .statusCode(HttpStatus.BAD_REQUEST.value()); // Bad Request

    }

    // Test for DELETE /api/employees/{id} endpoint
    @Test
    public void deleteEmployee_ValidId_ReturnsNoContent() {
        Long employeeId = this.employee.get(0).getId(); // Get the ID of the first employee in the list
        RestAssured.given()
                .when()
                .delete("/api/employees/" + employeeId)
                .then()
                .statusCode(HttpStatus.NO_CONTENT.value()); // No Content
    }



}
