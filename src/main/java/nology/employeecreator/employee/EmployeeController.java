package nology.employeecreator.employee;

import java.net.URI;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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

@RestController
@RequestMapping("/api/employees")
@Validated
public class EmployeeController {

    private final EmployeeService employeeService; //delegates business logic to service layer

    public EmployeeController(EmployeeService employeeService) {
        this.employeeService = employeeService;
    }

    /* ------------------------------- END POINTS ------------------------------- */

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
        // Get all employees from service layer
        return this.employeeService.getAllEmployees();
    }



    /* --------------------------- GET /api/employees --------------------------- */
    @GetMapping("/{id}")
    public EmployeeResponseDTO getEmployee(@PathVariable Long id) {
        // get employee by ID, convert to DTO, return response
        return this.employeeService.findById(id);
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



}
