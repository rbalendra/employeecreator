package nology.employeecreator.employee;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

public interface EmployeeRepository extends JpaRepository<Employee, Long> {
    // This interface will automatically inherit methods for CRUD operations
    // from JpaRepository, such as save, findById, findAll, deleteById, etc.
    Optional<Employee> findById(Long id);
    Optional<Employee> findByEmail(String email);
    
}
