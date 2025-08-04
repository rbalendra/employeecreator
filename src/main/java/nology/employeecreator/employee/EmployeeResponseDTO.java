package nology.employeecreator.employee;

import java.time.LocalDate;
import java.time.LocalDateTime;


/* this DTO is created to control output format (what API sends back to clients) so intead of sending all details from Employee Entity. For example GET/employees may return a summary of few (id/name/contract). GET/employees/{id} we can return full details. POST/employees can return just the ID and status not the full record etc */

public class EmployeeResponseDTO {
    
  
        private Long id;
        private String firstName;
        private String middleName;
        private String lastName;
        private String email;
        private String mobileNumber;
        private String residentialAddress;
        private ContractType contractType;
        private LocalDate startDate;
        private LocalDate finishDate;
        private boolean ongoing;
        private EmploymentBasis employmentBasis;
        private Integer hoursPerWeek;
        private String thumbnailUrl;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;
        private EmployeeRole role;

    /* --------------------------- CONSTRUCTORS --------------------------- */
    public EmployeeResponseDTO() {
        // Default constructor
    }


    /* --------------------------------- GETTERS -------------------------------- */

    public EmployeeRole getRole() {
        return role;
    }

    public void setRole(EmployeeRole role) {
        this.role = role;
    }

    public Long getId() {
        return id;
    }

    public String getFirstName() {
        return firstName;
    }

    public String getMiddleName() {
        return middleName;
    }

    public String getLastName() {
        return lastName;
    }

    public String getEmail() {
        return email;
    }

    public String getMobileNumber() {
        return mobileNumber;
    }

    public String getResidentialAddress() {
        return residentialAddress;
    }

    public ContractType getContractType() {
        return contractType;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public LocalDate getFinishDate() {
        return finishDate;
    }

    public boolean isOngoing() {
        return ongoing;
    }

    public EmploymentBasis getEmploymentBasis() {
        return employmentBasis;
    }

    public Integer getHoursPerWeek() {
        return hoursPerWeek;
    }


    public String getThumbnailUrl() {
        return thumbnailUrl;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
      public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    /* --------------------------------- SETTERS -------------------------------- */
    public void setId(Long id) {
        this.id = id;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public void setMiddleName(String middleName) {
        this.middleName = middleName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setMobileNumber(String mobileNumber) {
        this.mobileNumber = mobileNumber;
    }

    public void setResidentialAddress(String residentialAddress) {
        this.residentialAddress = residentialAddress;
    }
    public void setContractType(ContractType contractType) {
        this.contractType = contractType;
    }
    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public void setFinishDate(LocalDate finishDate) {
        this.finishDate = finishDate;
    }

    public void setOngoing(boolean ongoing) {
        this.ongoing = ongoing;
    }

    public void setEmploymentBasis(EmploymentBasis employmentBasis) {
        this.employmentBasis = employmentBasis;
    }

    public void setHoursPerWeek(Integer hoursPerWeek) {
        this.hoursPerWeek = hoursPerWeek;
    }

    public void setThumbnailUrl(String thumbnailUrl) {
        this.thumbnailUrl = thumbnailUrl;
    }
        
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
     public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
