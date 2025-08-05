package nology.employeecreator.employee;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
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
    // Database-level search with pagination and sorting
    public Page<EmployeeResponseDTO> advancedSearchWithPagination(
            String firstName,           // Search term for name
            String contractType,        // Filter: contract type
            String employmentBasis,     // Filter: employment basis  
            Boolean ongoing,            // Filter: ongoing status
            int page,                   // Page number (0-based)
            int size,                   // Number of items per page
            String sortBy,              // Field to sort by
            String sortDirection        // Sort direction: asc or desc
    ) {
        // Step 1: Convert string parameters to enums (with validation)
        ContractType contractTypeEnum = null;
        if (contractType != null && !"ALL".equals(contractType)) {
            try {
                contractTypeEnum = ContractType.valueOf(contractType);
            } catch (IllegalArgumentException e) {
                System.out.println("Invalid contract type: " + contractType);
            }
        }

        EmploymentBasis employmentBasisEnum = null;
        if (employmentBasis != null && !"ALL".equals(employmentBasis)) {
            try {
                employmentBasisEnum = EmploymentBasis.valueOf(employmentBasis);
            } catch (IllegalArgumentException e) {
                System.out.println("Invalid employment basis: " + employmentBasis);
            }
        }

            // Convert ongoing boolean to isActive for repository
        Boolean isActive = null;
        if (ongoing != null) {
            isActive = ongoing; // true = active, false = inactive
            System.out.println("Converting ongoing=" + ongoing + " to isActive=" + isActive);
        }
        

        // Step 2: Create Sort object for database-level sorting
        Sort sort = createSort(sortBy, sortDirection);

        // Step 3: Create Pageable object (combines pagination + sorting)
        Pageable pageable = PageRequest.of(page, size, sort);

        // Step 4: Execute database query with all filters, sorting, and pagination
        Page<Employee> employeePage = employeeRepository.findWithFilters(pageable);

        // Step 5: Convert Page<Employee> to Page<EmployeeResponseDTO>
        // map() transforms each Employee entity to EmployeeResponseDTO
        return employeePage.map(this::convertToResponseDTO);
    }

/* ----------------------------- SORTING HELPERS ---------------------------- */
private Sort createSort(String sortBy, String sortDirection) {
        // Default sorting if no parameters provided
    if (sortBy == null || sortBy.trim().isEmpty()) {
            return Sort.by(Sort.Direction.ASC, "firstName");
             // Default: sort by firstName ascending
        }
        
        
        // Validate sortBy field to prevent SQL injection
        // Only allow specific database column names
        String validatedSortBy;
        switch (sortBy.toLowerCase()) {
            case "firstname":
            case "first_name":
                validatedSortBy = "firstName";
                break;
            case "lastname": 
            case "last_name":
                validatedSortBy = "lastName";
                break;
            case "email":
                validatedSortBy = "email";
                break;
            case "startdate":
            case "start_date":
                validatedSortBy = "startDate";
                break;
            case "contracttype":
            case "contract_type":
                validatedSortBy = "contractType";
                break;
            default:
                validatedSortBy = "firstName"; // Fallback to safe default
                System.out.println("Invalid sort field: " + sortBy + ", using firstName");
        }

        
        // Determine sort direction (default to ascending)
        Sort.Direction direction = Sort.Direction.ASC;
        if ("desc".equalsIgnoreCase(sortDirection)) {
            direction = Sort.Direction.DESC;
        }

        // Create and return Sort object that will be used in the SQL ORDER BY clause
        return Sort.by(direction, validatedSortBy);
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
        employee.setRole(data.getRole());

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

    /* -------------------------- READ ALL WITH PAGINATION ----------------------- */
    // NEW: Get all employees with pagination support for better UI experience
    // This method enables "10 per page" functionality on the frontend
    public Page<EmployeeResponseDTO> getAllEmployeesPaginated(int page, int size, String sortBy, String sortDirection) {
        // Step 1: Create Sort object based on direction parameter
        Sort.Direction direction = sortDirection.equalsIgnoreCase("desc") ? Sort.Direction.DESC : Sort.Direction.ASC;
        Sort sort = Sort.by(direction, sortBy);
        
        // Step 2: Create Pageable object with page, size, and sort parameters
        Pageable pageable = PageRequest.of(page, size, sort);
        
        // Step 3: Query database with pagination - returns Page<Employee>
        Page<Employee> employeePage = employeeRepository.findAll(pageable);
        
        // Step 4: Convert Page<Employee> to Page<EmployeeResponseDTO>
        // The map() method preserves pagination metadata (totalPages, totalElements, etc.)
        return employeePage.map(this::convertToResponseDTO);
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
        // Only set finish date if employee is NOT ongoing
        if (data.getFinishDate() != null && !employeeToUpdate.isOngoing()) {
        employeeToUpdate.setFinishDate(data.getFinishDate());
        System.out.println("📅 Setting finish date: " + data.getFinishDate());
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
        if (data.getOngoing()) {
            employeeToUpdate.setFinishDate(null);
            System.out.println("🔄 Employee marked as ongoing - clearing finish date");
        }

        if (data.getRole() != null) {
            employeeToUpdate.setRole(data.getRole());
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
        response.setCreatedAt(employee.getCreatedAt());
        response.setUpdatedAt(employee.getUpdatedAt());
        response.setRole(employee.getRole());
        
        return response;
    }






}



