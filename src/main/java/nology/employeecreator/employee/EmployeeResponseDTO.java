package nology.employeecreator.employee;

import java.time.LocalDate;

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

    public EmployeeResponseDTO(Long id, String firstName, String middleName,
    String lastName, String email, String mobileNumber,
    String residentialAddress, ContractType contractType,
    LocalDate startDate, LocalDate finishDate, boolean ongoing,
    EmploymentBasis employmentBasis, Integer hoursPerWeek) {

        this.id = id;
        this.firstName = firstName;
        this.middleName = middleName;
        this.lastName = lastName;
        this.email = email;
        this.mobileNumber = mobileNumber;
        this.residentialAddress = residentialAddress;
        this.contractType = contractType;
        this.startDate = startDate;
        this.finishDate = finishDate;
        this.ongoing = ongoing;
        this.employmentBasis = employmentBasis;
        this.hoursPerWeek = hoursPerWeek;
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

        

}
