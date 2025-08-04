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
	createdAt?: string
	updatedAt?: string
	role: 'ADMIN' | 'HR' | 'MANAGER' | 'EMPLOYEE' | 'INTERN' | 'CONTRACTOR'
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
	role: 'ADMIN' | 'HR' | 'MANAGER' | 'EMPLOYEE' | 'INTERN' | 'CONTRACTOR'
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
	role?: 'ADMIN' | 'HR' | 'MANAGER' | 'EMPLOYEE' | 'INTERN' | 'CONTRACTOR'
}

/* ------------------------ NEW: PAGINATION INTERFACES ----------------------- */
export interface PagedResponse<T> {
	content: T[] // Array of items for current page
	totalElements: number // Total number of items across all pages
	totalPages: number // Total number of pages
	number: number // Current page number (0-based)
	size: number // Number of items per page
	first: boolean // Is this the first page?
	last: boolean // Is this the last page?
	numberOfElements: number // Number of items in current page
}

/* ------------------------ SEARCH/FILTER INTERFACE ----------------------- */
export interface SearchParams {
	firstName?: string
	lastName?: string
	email?: string
	contractType?: string
	employmentBasis?: string
	status?: string
	sortBy?: string
	sortDirection?: string
	searchTerm?: string
	page?: number // Page number (0-based)
	size?: number // Items per page
}

// Alias for backward compatibility
export type EmployeeSearchParams = SearchParams

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

	// Helper function to determine if employee is active
	const isEmployeeActive = (employee: Employee) => {
		if (employee.ongoing) return true
		if (!employee.finishDate) return employee.ongoing

		const finishDate = new Date(employee.finishDate)
		const today = new Date()
		return finishDate >= today
	}

	return {
		totalEmployees: employees.length,
		// Basic counts
		activeCount: employees.filter(isEmployeeActive).length,
		inactiveCount: employees.filter((emp) => !isEmployeeActive(emp)).length,
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
		// Role counts
		adminCount: employees.filter((emp) => emp.role === 'ADMIN').length,
		hrCount: employees.filter((emp) => emp.role === 'HR').length,
		managerCount: employees.filter((emp) => emp.role === 'MANAGER').length,
		employeeCount: employees.filter((emp) => emp.role === 'EMPLOYEE').length,
		internCount: employees.filter((emp) => emp.role === 'INTERN').length,
		contractorCount: employees.filter((emp) => emp.role === 'CONTRACTOR')
			.length,
		// Combined employment type + status counts
		activeFullTimeCount: employees.filter(
			(emp) => isEmployeeActive(emp) && emp.employmentBasis === 'FULL_TIME'
		).length,
		activePartTimeCount: employees.filter(
			(emp) => isEmployeeActive(emp) && emp.employmentBasis === 'PART_TIME'
		).length,
		inactiveFullTimeCount: employees.filter(
			(emp) => !isEmployeeActive(emp) && emp.employmentBasis === 'FULL_TIME'
		).length,
		inactivePartTimeCount: employees.filter(
			(emp) => !isEmployeeActive(emp) && emp.employmentBasis === 'PART_TIME'
		).length,
	}
}

/* ------------------------ UPDATED: PAGINATED SEARCH ------------------- */
export const searchEmployees = async (
	params: SearchParams
): Promise<PagedResponse<Employee>> => {
	// Build query parameters including pagination
	const searchParams = new URLSearchParams()

	// Handle search term - search by name
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

	// Add status filter - send ongoing parameter to backend
	// Backend logic:
	// - ACTIVE (ongoing=true): employees with ongoing=true AND (no finish date OR finish date >= today)
	// - INACTIVE (ongoing=false): employees with ongoing=false OR finish date < today
	if (params.status && params.status !== 'ALL') {
		if (params.status === 'ACTIVE') {
			searchParams.append('ongoing', 'true') // Active employees
		} else if (params.status === 'INACTIVE') {
			searchParams.append('ongoing', 'false') // Inactive employees
		}
	}

	// Add sorting parameters
	if (params.sortBy) {
		searchParams.append('sortBy', params.sortBy)
	}
	if (params.sortDirection) {
		searchParams.append('sortDirection', params.sortDirection)
	}

	// Add pagination parameters (with defaults)
	searchParams.append('page', String(params.page || 0))
	searchParams.append('size', String(params.size || 10))

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

		const data: PagedResponse<Employee> = await response.json()
		console.log(
			'📄 Search results - Page:',
			data.number + 1,
			'of',
			data.totalPages,
			'| Items:',
			data.numberOfElements,
			'of',
			data.totalElements
		)
		return data
	} catch (error) {
		console.error('Error in searchEmployees:', error)
		throw error
	}
}

/* ----------------------- SIMPLE SEARCH (NO PAGINATION) ------------------- */
// This function returns Employee[] for backward compatibility with current frontend
export const searchEmployeesSimple = async (
	params: EmployeeSearchParams
): Promise<Employee[]> => {
	// Build query parameters
	const searchParams = new URLSearchParams()

	// Handle search term - search by name
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

	// Add status filter - send ongoing parameter to backend
	// Backend logic:
	// - ACTIVE (ongoing=true): employees with ongoing=true AND (no finish date OR finish date >= today)
	// - INACTIVE (ongoing=false): employees with ongoing=false OR finish date < today
	if (params.status && params.status !== 'ALL') {
		if (params.status === 'ACTIVE') {
			searchParams.append('ongoing', 'true') // Active employees
		} else if (params.status === 'INACTIVE') {
			searchParams.append('ongoing', 'false') // Inactive employees
		}
	}

	// Add sorting parameters
	if (params.sortBy) {
		searchParams.append('sortBy', params.sortBy)
	}
	if (params.sortDirection) {
		searchParams.append('sortDirection', params.sortDirection)
	}

	searchParams.append('page', '0')
	searchParams.append('size', '100')

	const url = `${API_BASE_URL}/employees/search?${searchParams.toString()}`
	console.log('🔍 Searching with URL:', url)

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

		const data: PagedResponse<Employee> = await response.json()
		console.log('✅ Search successful, found', data.content.length, 'employees')

		// Return just the content array for backward compatibility
		return data.content
	} catch (error) {
		console.error('💥 Error in searchEmployeesSimple:', error)
		throw error
	}
}
