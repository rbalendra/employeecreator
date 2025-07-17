package nology.employeecreator.employee;

import java.time.LocalDate;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

public class CreateEmployeeDTO {
    
    @NotBlank @Size(max = 200)
    private String firstName;

    @Size(max = 200)
    private String middleName;

    @NotBlank @Size(max = 200)
    private String lastName;

    @Email @NotBlank @Size(max = 200)
    private String email;

    @Pattern(regexp = "^(\\+?61|0)4\\d{8}$",
    message = "Must be a valid Australian mobile number")
    private String mobileNumber;

    @Size(max = 255)
    private String residentialAddress;

    @NotNull
    private ContractType contractType;

    @NotNull
    private LocalDate startDate;

    private LocalDate endDate; 

    private boolean ongoing;

    @NotNull
    private EmploymentBasis employmentBasis;

    @Positive @Max(168)
    private Integer hoursPerWeek;

    @Size(max = 500)
    private String thumbnailUrl;


/* --------------------------- getters and setters -------------------------- */

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getMiddleName() {
        return middleName;
    }

    public void setMiddleName(String middleName) {
        this.middleName = middleName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getMobileNumber() {
        return mobileNumber;
    }

    public void setMobileNumber(String mobileNumber) {
        this.mobileNumber = mobileNumber;
    }

    public String getResidentialAddress() {
        return residentialAddress;
    }

    public void setResidentialAddress(String residentialAddress) {
        this.residentialAddress = residentialAddress;
    }

    public ContractType getContractType() {
        return contractType;
    }

    public void setContractType(ContractType contractType) {
        this.contractType = contractType;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }

    public boolean isOngoing() {
        return ongoing;
    }

    public void setOngoing(boolean ongoing) {
        this.ongoing = ongoing;
    }

    public EmploymentBasis getEmploymentBasis() {
        return employmentBasis;
    }

    public void setEmploymentBasis(EmploymentBasis employmentBasis) {
        this.employmentBasis = employmentBasis;
    }

    public Integer getHoursPerWeek() {
        return hoursPerWeek;
    }

    public void setHoursPerWeek(Integer hoursPerWeek) {
        this.hoursPerWeek = hoursPerWeek;
    }

      public String getThumbnailUrl() {
        return thumbnailUrl;
    }

       public void setThumbnailUrl(String thumbnailUrl) {
        this.thumbnailUrl = thumbnailUrl;
    }
    

}
