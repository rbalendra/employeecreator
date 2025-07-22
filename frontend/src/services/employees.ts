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

// Interface for creating new employees (matches CreateEmployeeDTO)
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

// Interface for updating employees (matches UpdateEmployeeDTO)
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

/* ------------------------ SEARCH/FILTER INTERFACE ----------------------- */
export interface EmployeeSearchParams {
	firstName?: string
	lastName?: string
	email?: string
	contractType?: string
	employmentBasis?: string
	sortBy?: string
	sortDirection?: string
	searchTerm?: string
}

/* ---------------------------- GET ALL EMPLOYEES --------------------------- */
// Fetch all employees from the backend
export const getAllEmployees = async (): Promise<Employee[]> => {
	try {
		const response = await fetch(`${API_BASE_URL}/employees`)
		console.log('Response status:', response.status)
		if (!response.ok) {
			throw new Error(`HTTP ${response.status}: Failed to fetch employees`)
		}

		const data = await response.json()
		return data
	} catch (error) {
		console.error('💥 Error in getAllEmployees:', error)
		throw error
	}
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
	}
}

/* ------------------------ SEARCH EMPLOYEES WITH BACKEND ------------------- */
// Search employees with various filters
export const searchEmployees = async (
	params: EmployeeSearchParams
): Promise<Employee[]> => {
	// Build query parameters
	const searchParams = new URLSearchParams()

	// Handle search term - only search by name now
	if (params.searchTerm && params.searchTerm.trim()) {
		const term = params.searchTerm.trim()
		searchParams.append('firstName', term) // Backend uses firstName param for name search
	}

	// Add dropdown filters
	if (params.contractType && params.contractType !== 'ALL') {
		searchParams.append('contractType', params.contractType)
	}
	if (params.employmentBasis && params.employmentBasis !== 'ALL') {
		searchParams.append('employmentBasis', params.employmentBasis)
	}

	// Add sorting
	if (params.sortBy) {
		searchParams.append('sortBy', params.sortBy)
	}
	if (params.sortDirection) {
		searchParams.append('sortDirection', params.sortDirection)
	}

	const url = `${API_BASE_URL}/employees/search?${searchParams.toString()}`

	try {
		const response = await fetch(url)

		if (!response.ok) {
			console.error(
				'❌ Search response not ok:',
				response.status,
				response.statusText
			)
			throw new Error(`HTTP ${response.status}: Failed to search employees`)
		}

		const data = await response.json()
		console.log('Search results count:', data.length)
		return data
	} catch (error) {
		console.error('Error in searchEmployees:', error)
		throw error
	}
}
