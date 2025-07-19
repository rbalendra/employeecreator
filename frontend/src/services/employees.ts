const API_BASE_URL = 'http://localhost:8080/api'

export interface Employee {
	id: number
	firstName: string
	middleName?: string
	lastName: string
	email: string
	mobileNumber: string
	residentialAddress: string
	contractType: 'PERMANENT' | 'CONTRACT'
	startDate: string
	finishDate?: string
	ongoing: boolean
	employmentBasis: 'FULL_TIME' | 'PART_TIME'
	hoursPerWeek?: number
	thumbnailUrl?: string
}

// Interface for creating new employees (matches your CreateEmployeeDTO)
export interface CreateEmployeeDTO {
	firstName: string
	middleName?: string
	lastName: string
	email: string
	mobileNumber: string
	residentialAddress: string
	contractType: 'PERMANENT' | 'CONTRACT'
	startDate: string
	finishDate?: string
	ongoing: boolean
	employmentBasis: 'FULL_TIME' | 'PART_TIME'
	hoursPerWeek?: number
	thumbnailUrl?: string
}

// Interface for updating employees (matches your UpdateEmployeeDTO)
export interface UpdateEmployeeDTO {
	firstName?: string
	middleName?: string
	lastName?: string
	email?: string
	mobileNumber?: string
	residentialAddress?: string
	contractType?: 'PERMANENT' | 'CONTRACT'
	startDate?: string
	finishDate?: string
	ongoing?: boolean
	employmentBasis?: 'FULL_TIME' | 'PART_TIME'
	hoursPerWeek?: number
	thumbnailUrl?: string
}

/* ---------------------------- GET ALL EMPLOYEES --------------------------- */
export const getAllEmployees = async (): Promise<Employee[]> => {
	const response = await fetch(`${API_BASE_URL}/employees`)
	if (!response.ok) {
		throw new Error('Failed to fetch employees')
	}
	return response.json()
}

/* ------------------------ GET SINGLE EMPLOYEE BY ID ----------------------- */
export const getEmployeeById = async (id: number): Promise<Employee> => {
	const response = await fetch(`${API_BASE_URL}/employees/${id}`)
	if (!response.ok) {
		throw new Error(`failed to fetch employee ${id}`)
	}
	return response.json()
}

/* --------------------------- CREATE NEW EMPLOYEE -------------------------- */
export const createEmployee = async (
	employeeData: CreateEmployeeDTO
): Promise<Employee> => {
	const response = await fetch(`${API_BASE_URL}/employees`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(employeeData),
	})
	if (!response.ok) {
		throw new Error('Failed to create employee')
	}
	return response.json()
}

/* ------------------------ UPDATE EXISITING EMPLOYEE ----------------------- */
export const updateEmployee = async (
	id: number,
	updateData: UpdateEmployeeDTO
): Promise<Employee> => {
	const response = await fetch(`${API_BASE_URL}/employees/${id}`, {
		method: 'PUT',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(updateData),
	})
	if (!response.ok) {
		throw new Error(`Failed to update employee ${id}`)
	}
	return response.json()
}

/* ----------------------------- DELETE EMPLOYEE ---------------------------- */
export const deleteEmployee = async (id: number): Promise<void> => {
	const response = await fetch(`${API_BASE_URL}/employees/${id}`, {
		method: 'DELETE',
	})
	if (!response.ok) {
		throw new Error(`Failed to delete employee ${id}`)
	}
}

/* --------------------------- FOR DASHBOARD STATS -------------------------- */
export const getDashboardStats = async () => {
	const employees = await getAllEmployees()
	return {
		totalEmployees: employees.length,
		fullTimeCount: employees.filter(
			(emp) => emp.employmentBasis === 'FULL_TIME'
		).length,
		partTimeCount: employees.filter(
			(emp) => emp.employmentBasis === 'PART_TIME'
		).length,
		permanentCount: employees.filter((emp) => emp.contractType === 'PERMANENT')
			.length,
		contractCount: employees.filter((emp) => emp.contractType === 'CONTRACT')
			.length,
		ongoingCount: employees.filter((emp) => emp.ongoing).length,
	}
}
