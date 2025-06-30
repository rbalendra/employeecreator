package nology.employeecreator.employee;

import org.springframework.stereotype.Service;

@Service
public class EmployeeService {
    
    // inject the EmployeeRepository to interact with the database
    private final EmployeeRepository employeeRepository;

    // Constructor injection for EmployeeRepository
    public EmployeeService(EmployeeRepository employeeRepository) {
        this.employeeRepository = employeeRepository;
    }
    
    /* --------------------------------- CREATE --------------------------------- */






    /* -------------------------------- READ ALL -------------------------------- */
        


    /* -------------------------------- READ ONE -------------------------------- */




    /* ------------------------------- UPDATE ONE ------------------------------- */






    /* --------------------------------- DELETE --------------------------------- */
}
