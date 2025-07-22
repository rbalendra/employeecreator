package nology.employeecreator.employee;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;


import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;



@Service
public class EmployeeService {
    
    // inject the EmployeeRepository to interact with the database
     // Repository for CRUD operations on Employee entities
    private EmployeeRepository employeeRepository;

    // Constructor injection for EmployeeRepository
    public EmployeeService(EmployeeRepository employeeRepository) {
        this.employeeRepository = employeeRepository;
    }
    
    /* -------------------------- SEARCH FUNCTIONALITY -------------------------- */
    //Performs an “advanced” in‑memory search over all employees,applying optional filters and sorting.
public List<EmployeeResponseDTO> advancedSearch(
            String firstName,
            String lastName,
            String email,
            String contractType,
            String employmentBasis,
            Boolean ongoing,
            String sortBy,
            String sortDirection
) {
    




    // Fetch everything from the database
    List<Employee> allEmployees = employeeRepository.findAll();
    List<Employee> filteredEmployees = allEmployees;

          // Apply ongoing filter
    if (ongoing != null) {
        
        filteredEmployees = filteredEmployees.stream()
                .filter(emp -> emp.isOngoing() == ongoing)
                .collect(Collectors.toList());

    }


    // Apply search filter first (search by firstname or last name)
    if (firstName != null && !firstName.trim().isEmpty()) {
        String searchTerm = firstName.trim().toLowerCase();
        
        filteredEmployees = filteredEmployees.stream()
                .filter(emp -> 
                    emp.getFirstName().toLowerCase().contains(searchTerm) ||
                    emp.getLastName().toLowerCase().contains(searchTerm)
                )
                .collect(Collectors.toList());
        
    }

    // Contract type filter: skip if ALL, otherwise parse to enum and filter
    if (contractType != null && !"ALL".equals(contractType)) {
        try {
            ContractType filterType = ContractType.valueOf(contractType);
            
            filteredEmployees = filteredEmployees.stream()
                    .filter(emp -> emp.getContractType() == filterType)
                    .collect(Collectors.toList());
            
            
        } catch (IllegalArgumentException e) {
            System.out.println("Invalid contract type: " + contractType);
        }
    }
    
    // Apply employment basis filter
    if (employmentBasis != null && !"ALL".equals(employmentBasis)) {
        try {
            EmploymentBasis filterBasis = EmploymentBasis.valueOf(employmentBasis);
            
            filteredEmployees = filteredEmployees.stream()
                    .filter(emp -> emp.getEmploymentBasis() == filterBasis)
                    .collect(Collectors.toList());
            
        } catch (IllegalArgumentException e) {
            System.out.println("Invalid employment basis: " + employmentBasis);
        }
    }
 

    
    
    // Perform the actual list sorting based on sortBy & sortDirection
    if ("firstName".equals(sortBy)) {
        filteredEmployees.sort((a, b) -> {
            int result = a.getFirstName().compareToIgnoreCase(b.getFirstName());
            return "desc".equalsIgnoreCase(sortDirection) ? -result : result;
        });
    } else if ("email".equals(sortBy)) {
        filteredEmployees.sort((a, b) -> {
            int result = a.getEmail().compareToIgnoreCase(b.getEmail());
            return "desc".equalsIgnoreCase(sortDirection) ? -result : result;
        });
    } else if ("startDate".equals(sortBy)) {
        filteredEmployees.sort((a, b) -> {
            int result = a.getStartDate().compareTo(b.getStartDate());
            return "desc".equalsIgnoreCase(sortDirection) ? -result : result;
        });
    }

    // Map each Employee entity to a response DTO for the client
    return filteredEmployees.stream()
            .map(this::convertToResponseDTO)
            .collect(Collectors.toList());
}

/* --------------------------------- CREATE --------------------------------- */
    //Creates a new Employee record from the given DTO saves it to the database, and returns the saved data as a DTO.
    public EmployeeResponseDTO createEmployee(CreateEmployeeDTO data) {
        //create new emp entity
        Employee employee = new Employee();

        //copy data from DTO to entity because DTO is what comes from frontend, Entity is what goes to the db
        employee.setFirstName(data.getFirstName().trim());
        if (data.getMiddleName() != null) {
            employee.setMiddleName(data.getMiddleName().trim());
        }
        employee.setLastName(data.getLastName().trim());
        employee.setEmail(data.getEmail().trim());
        employee.setMobileNumber(data.getMobileNumber().trim());
        employee.setResidentialAddress(data.getResidentialAddress().trim());
        employee.setContractType(data.getContractType());
        employee.setStartDate(data.getStartDate());
        employee.setFinishDate(data.getFinishDate());
        employee.setOngoing(data.isOngoing());
        employee.setEmploymentBasis(data.getEmploymentBasis());
        employee.setHoursPerWeek(data.getHoursPerWeek());
        employee.setThumbnailUrl(data.getThumbnailUrl());

        //save employee to db
        Employee savedEmployee = this.employeeRepository.save(employee);

        //convert saved entity back to response DTO so we can return it to the client
        return convertToResponseDTO(savedEmployee);
    }

    /* -------------------------------- READ ALL -------------------------------- */
    public List<EmployeeResponseDTO> getAllEmployees() {
        // get all employees from db as a List<Employee>
        List<Employee> employees = employeeRepository.findAll();
        // convert list to stream then map each employee to EmployeeResponseDTO
        return employees.stream().map(this::convertToResponseDTO).collect(Collectors.toList());
        }


    /* -------------------------------- READ ONE -------------------------------- */
    public EmployeeResponseDTO findById(Long id) {
        // Try to find employee by ID - returns Optional<Employee>
        Optional<Employee> employee = this.employeeRepository.findById(id);
        // Check if employee was found
        if (employee.isEmpty()) {
            throw new RuntimeException("Employee with id " + id + " not found");
        }
        
       
        // Convert found employee to response DTO
        return convertToResponseDTO(employee.get());
    }



    /* ------------------------------- UPDATE ONE ------------------------------- */
    public EmployeeResponseDTO update(Long id, UpdateEmployeeDTO data) {
        // Find existing employee
        Employee employeeToUpdate = employeeRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Employee with id " + id + " not found"));
        
        
       
        
        // Update fields if they are provided
        if (data.getFirstName() != null) {
            employeeToUpdate.setFirstName(data.getFirstName().trim());
        }
        if (data.getMiddleName() != null) {
            employeeToUpdate.setMiddleName(data.getMiddleName().trim());
        }
        if (data.getLastName() != null) {
            employeeToUpdate.setLastName(data.getLastName().trim());
        }
        if (data.getEmail() != null) {
            employeeToUpdate.setEmail(data.getEmail().trim());
        }
        if (data.getMobileNumber() != null) {
            employeeToUpdate.setMobileNumber(data.getMobileNumber().trim());
        }
        if (data.getResidentialAddress() != null) {
            employeeToUpdate.setResidentialAddress(data.getResidentialAddress().trim());
        }
        if (data.getContractType() != null) {
            employeeToUpdate.setContractType(data.getContractType());
        }
        if (data.getStartDate() != null) {
            employeeToUpdate.setStartDate(data.getStartDate());
        }
        if (data.getFinishDate() != null) {
            employeeToUpdate.setFinishDate(data.getFinishDate());
        }
        if (data.getEmploymentBasis() != null) {
            employeeToUpdate.setEmploymentBasis(data.getEmploymentBasis());
        }
        if (data.getHoursPerWeek() != null) {
            employeeToUpdate.setHoursPerWeek(data.getHoursPerWeek());
        }
        if (data.getOngoing() != null) {
            employeeToUpdate.setOngoing(data.getOngoing());
        }
         if (data.getThumbnailUrl() != null) { // Add this block
            employeeToUpdate.setThumbnailUrl(data.getThumbnailUrl());
        }
        
        // Save updated employee
        Employee updatedEmployee = employeeRepository.save(employeeToUpdate);
        return convertToResponseDTO(updatedEmployee);
    }

    /* --------------------------------- DELETE --------------------------------- */
    public void delete(Long id) {
        // Check if employee exists
        Optional<Employee> employee = employeeRepository.findById(id);

        if (employee.isEmpty()) {
            throw new RuntimeException("Employee with id " + id + " not found");
        }

        // Delete the employee
        employeeRepository.deleteById(id);
    }

    /* ----------------------------- SORTING HELPERS ---------------------------- */
        private Sort createSort(String sortBy, String sortDirection) {
        // Default sorting if no parameters provided
        if (sortBy == null || sortBy.trim().isEmpty()) {
            return Sort.by(Sort.Direction.ASC, "firstName"); // Default: sort by firstName ascending
        }

        // Determine sort direction
        Sort.Direction direction = Sort.Direction.ASC; // Default to ascending
        if ("desc".equalsIgnoreCase(sortDirection)) {
            direction = Sort.Direction.DESC;
        }

        // Create and return Sort object
        return Sort.by(direction, sortBy);
    }




    /* ------------------------------ HELPER METHOD ----------------------------- */
    // this is a helper method to convert an Employee entity to EmployeeResponseDTO
    private EmployeeResponseDTO convertToResponseDTO(Employee employee) {
        
        EmployeeResponseDTO response = new EmployeeResponseDTO();

        response.setId(employee.getId());
        response.setFirstName(employee.getFirstName());
        response.setMiddleName(employee.getMiddleName());
        response.setLastName(employee.getLastName());
        response.setEmail(employee.getEmail());
        response.setMobileNumber(employee.getMobileNumber());
        response.setResidentialAddress(employee.getResidentialAddress());
        response.setContractType(employee.getContractType());
        response.setStartDate(employee.getStartDate());
        response.setFinishDate(employee.getFinishDate());
        response.setOngoing(employee.isOngoing());
        response.setEmploymentBasis(employee.getEmploymentBasis());
        response.setHoursPerWeek(employee.getHoursPerWeek());
        response.setThumbnailUrl(employee.getThumbnailUrl());
        
        return response;
    }






}



