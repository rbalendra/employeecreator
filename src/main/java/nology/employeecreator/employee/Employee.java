package nology.employeecreator.employee;

import java.time.LocalDate;



import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

@Entity
@Table(name="employees")
public class Employee {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /* -------------------------- personal information -------------------------- */
    @NotBlank @Size(max=200)
    private String firstName;

    @Size(max = 200)// optional
    private String middleName;

    @NotBlank @Size(max=200)
    private String lastName;

    /* ----------------------------- image thumbnail ---------------------------- */

    @Size(max=500)
    private String thumbnailUrl;


    /* ----------------------------- contact details ---------------------------- */
    
    @Email
    @NotBlank
    @Size(max = 200)
    @Column(unique=true)
    private String email;

    @Pattern(regexp="^(\\+?61|0)4\\d{8}$",
             message = "Must be a valid Australian mobile number")
    private String mobileNumber;

    @Size(max=255)
    private String residentialAddress;

    /* ---------------------------- Employment Status --------------------------- */
    @Enumerated(EnumType.STRING)
    @NotNull
    private ContractType contractType;

    private LocalDate startDate;

    private LocalDate finishDate;   // null if ongoing

    private boolean ongoing; // true = no end date
    
    @Enumerated(EnumType.STRING)
    @NotNull
    private EmploymentBasis employmentBasis; // full time / part time
    
    @Positive @Max(168)  // just to be sure
    private Integer hoursPerWeek;

 

    /* ------------------------------ Constructors ------------------------------ */
    //
    public Employee() {
        
    }

    public Employee(String firstName,String middleName,String lastName,String email,String mobileNumber,String residentialAddress,ContractType contractType, LocalDate startDate,
            LocalDate finishDate, boolean ongoing, EmploymentBasis employmentBasis, Integer hoursPerWeek) {
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


    /* --------------------------- getters and setters -------------------------- */

    public Long getId() {
        return id;
    }

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

    public LocalDate getFinishDate() {
        return finishDate;
    }

    public void setFinishDate(LocalDate finishDate) {
        this.finishDate = finishDate;
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


