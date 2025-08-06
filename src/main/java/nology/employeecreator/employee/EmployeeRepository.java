package nology.employeecreator.employee;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Long> {
    
    // Custom query method that handles filtering AND pagination/sorting at the database level
     @Query("SELECT e FROM Employee e WHERE " +
           // If firstName is null, skip this clause; otherwise match first or last name
             "(:firstName IS NULL OR LOWER(e.firstName) LIKE LOWER(CONCAT('%', :firstName, '%')) OR LOWER(e.lastName) LIKE LOWER(CONCAT('%', :firstName, '%'))) AND "
             +
            // If contractType is null, skip; otherwise match exact
             "(:contractType IS NULL OR e.contractType = :contractType) AND "
             +
            // If employmentBasis is null, skip; otherwise match exact
             "(:employmentBasis IS NULL OR e.employmentBasis = :employmentBasis) AND "
             +
            // If isActive is null, skip; otherwise evaluate active vs inactive
             "(:isActive IS NULL OR "
             +
             // Active: finishDate is null (ongoing) OR finishDate >= today
             "(:isActive = true AND (e.finishDate IS NULL OR e.finishDate >= CURRENT_DATE)) OR "
             +
           // Inactive employees: finish date < today
            "(:isActive = false AND (e.finishDate IS NOT NULL AND e.finishDate < CURRENT_DATE)))")


    Page<Employee> findWithFilters(
            @Param("firstName") String firstName,
            @Param("firstName") String lastName,
            @Param("contractType") ContractType contractType,
            @Param("employmentBasis") EmploymentBasis employmentBasis,
            @Param("isActive") Boolean isActive,
            Pageable pageable                           // This handles sorting + pagination automatically
    );
    
}
