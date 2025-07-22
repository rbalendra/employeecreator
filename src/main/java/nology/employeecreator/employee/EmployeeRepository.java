package nology.employeecreator.employee;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Long> {
    

    Optional<Employee> findById(Long id);
    Employee save(Employee employee);
    void deleteById(Long id);
 
    
}
