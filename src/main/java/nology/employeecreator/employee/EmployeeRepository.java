package nology.employeecreator.employee;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Long> {
    
    // CHANGE: Added explicit method declarations for better IDE support
    // These methods are inherited from JpaRepository but declaring them explicitly helps with compilation
    Optional<Employee> findById(Long id);
    Employee save(Employee employee);
    void deleteById(Long id);
 
    
}
