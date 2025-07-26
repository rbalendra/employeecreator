package nology.employeecreator.employeecreator;

import java.util.ArrayList;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.test.context.ActiveProfiles;

import io.restassured.RestAssured;
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

        public void setUp() {
            RestAssured.port = port; //sets the port for Rest Assured to use

            this.employeeRepository.deleteAll(); //clear the database before each test
            this.employee.clear(); // clear the list of employees before each test
        
            //set up some data and save it in the database
            Employee employee1 = new Employee();
         
        
        
        }

    
}
