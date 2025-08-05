package nology.employeecreator.employee;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Long> {
    
    // Custom query method that handles filtering AND pagination/sorting at the database level
     @Query("SELECT e FROM Employee e WHERE " +
           // Use COALESCE to handle null parameters - if parameter is null, condition becomes '1=1' (always true)
           "(:firstName IS NULL OR LOWER(e.firstName) LIKE LOWER(CONCAT('%', :firstName, '%')) OR LOWER(e.lastName) LIKE LOWER(CONCAT('%', :firstName, '%'))) AND " +
           "(:contractType IS NULL OR e.contractType = :contractType) AND " +
             "(:employmentBasis IS NULL OR e.employmentBasis = :employmentBasis) AND " +
           "(:isActive IS NULL OR " +
           // Active employees: no finish date OR finish date >= today (regardless of ongoing status)
       "  (:isActive = true AND (e.finishDate IS NULL OR e.finishDate >= CURRENT_DATE)) OR " +
           // Inactive employees: finish date < today
       "  (:isActive = false AND (e.finishDate IS NOT NULL AND e.finishDate < CURRENT_DATE)))")


    Page<Employee> findWithFilters(
            // Search term (searches both first and last name)
            // Filter by contract type
            // Filter by employment basis
            Pageable pageable                           // This handles sorting + pagination automatically
    );
    
}
