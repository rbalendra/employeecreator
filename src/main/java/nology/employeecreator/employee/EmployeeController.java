package nology.employeecreator.employee;

import java.net.URI;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.data.domain.Page; 
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.RequestParam;


@RestController
@RequestMapping("/api/employees")
@Validated
public class EmployeeController {

    private final EmployeeService employeeService; //delegates business logic to service layer

    public EmployeeController(EmployeeService employeeService) {
        this.employeeService = employeeService;
    }

    /* ------------------------------- END POINTS ------------------------------- */

   /* ------------------------ SEARCH / FILTER ENDPOINT ------------------------ */
@GetMapping("/search")
public Page<EmployeeResponseDTO> searchEmployees(
    @RequestParam(required=false) String firstName,
    @RequestParam(required=false) String contractType,
    @RequestParam(required=false) String employmentBasis,
    @RequestParam(required=false) Boolean ongoing,
        
    // Sorting parameters
    @RequestParam(required = false, defaultValue = "firstName") String sortBy,
    @RequestParam(required = false, defaultValue = "asc") String sortDirection,
                    
    // NEW: Pagination parameters
    @RequestParam(required = false, defaultValue = "0") int page,      // Page number (0-based)
    @RequestParam(required = false, defaultValue = "10") int size      // Items per page
        
) {
     System.out.println("GET /api/employees/search called with pagination");
        System.out.println("Page: " + page + ", Size: " + size + ", Sort: " + sortBy + " " + sortDirection);
        System.out.println("Filters - firstName: " + firstName + ", contractType: " + contractType + 
                          ", employmentBasis: " + employmentBasis + ", ongoing: " + ongoing);
    
    return employeeService.advancedSearchWithPagination(
           firstName,          // Search term (works for both first and last name)
            contractType,       // Contract type filter
            employmentBasis,    // Employment basis filter
            ongoing,            // Ongoing status filter
            page,               // Page number
            size,               // Page size
            sortBy,             // Sort field
            sortDirection       // Sort direction
    );
}
  



    /* --------------------------- POST /api/employees -------------------------- */
    @PostMapping
    public ResponseEntity<EmployeeResponseDTO> createEmployee(@Valid @RequestBody CreateEmployeeDTO data) {

        // convert DTO to entity, validate, save to database, return response
        EmployeeResponseDTO saved = this.employeeService.createEmployee(data);

        // Location header → /api/employees/{id}
        URI location = URI.create("/api/employees/" + saved.getId());
        return ResponseEntity.created(location).body(saved);
    }
    
       /* --------------------------- GET /api/employees (ALL) --------------------- */
   @GetMapping
public List<EmployeeResponseDTO> getAllEmployees() {
    System.out.println("📋 GET /api/employees called");
    List<EmployeeResponseDTO> employees = employeeService.getAllEmployees();
    System.out.println("✅ Returning " + employees.size() + " employees");
    return employees;
}




    /* --------------------------- GET /api/employees --------------------------- */
    @GetMapping("/{id}")
    public ResponseEntity<EmployeeResponseDTO> getEmployee(@PathVariable Long id) {
        try{
            EmployeeResponseDTO employee = this.employeeService.findById(id);
            return ResponseEntity.ok(employee); // return 200 OK with employee data
        }catch (RuntimeException e) {
            // If employee not found, service throws RuntimeException
            // We catch it and return 404 Not Found instead of letting it become 500
            return ResponseEntity.notFound().build();
        }
    }
    
    /* --------------------------- PUT /api/employees/{id} ----------------------- */
    @PutMapping("/{id}")
    public EmployeeResponseDTO updateEmployee(
        @PathVariable Long id,
        @Valid @RequestBody UpdateEmployeeDTO data) {

        return employeeService.update(id, data);

    }
    
    /* --------------------------- DELETE /api/employees/{id} -------------------- */
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT) // 204 No Content
    // No response body, just status code
    public void deleteEmployee(@PathVariable Long id) {
        employeeService.delete(id);

    }

//     /* ----------------------------- Dashboard stats ---------------------------- */
//     @GetMapping("/dashboard-stats")
//     public ResponseEntity<Map<String, Long>> getDashboardStats() {
//     Map<String, Long> stats = employeeService.getDashboardStats();
//     return ResponseEntity.ok(stats);
// }


}
