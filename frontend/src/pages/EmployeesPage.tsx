import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router'
import { Button } from '../components/Button'
import { EmployeeCard } from '../components/EmployeeCard'
import { EmployeeDetailsModal } from '../components/EmployeeDetailsModal'
import {
	getAllEmployees,
	searchEmployees,
	deleteEmployee,
	type Employee,
	type EmployeeSearchParams,
} from '../services/employees'
import {
	MdPeople,
	MdPersonAdd,
	MdRefresh,
	MdSearch,
	MdFilterList,
} from 'react-icons/md'

export const EmployeesPage = () => {
	const navigate = useNavigate()

	// State management
	const [employees, setEmployees] = useState<Employee[]>([]) // Current displayed employees
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)
	const [searchTerm, setSearchTerm] = useState('')
	const [contractFilter, setContractFilter] = useState<string>('ALL')
	const [employmentFilter, setEmploymentFilter] = useState<string>('ALL')
	const [sortBy, setSortBy] = useState<string>('firstName') // Changed to match backend field
	const [sortDirection, setSortDirection] = useState<string>('asc')

	// Modal state
	const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
		null
	)
	const [isModalOpen, setIsModalOpen] = useState(false)

	/* ---------------------------- SEARCH EMPLOYEES ---------------------------- */
	// Debounced search function to avoid too many API calls
	const performSearch = useCallback(async () => {
		try {
			setLoading(true)
			setError(null) // Clear any previous errors
			console.log('🔍 Performing backend search...')
			console.log('Current state:', {
				searchTerm,
				contractFilter,
				employmentFilter,
				sortBy,
				sortDirection,
			})

			// If no filters are applied, get all employees
			if (
				!searchTerm &&
				contractFilter === 'ALL' &&
				employmentFilter === 'ALL'
			) {
				console.log('📋 Getting all employees...')
				const allEmployees = await getAllEmployees()
				console.log('✅ Got all employees:', allEmployees.length)
				setEmployees(allEmployees)
			} else {
				// Use backend search with current filters
				console.log('🔍 Using backend search with filters')

				const searchParams: EmployeeSearchParams = {
					contractType: contractFilter !== 'ALL' ? contractFilter : undefined,
					employmentBasis:
						employmentFilter !== 'ALL' ? employmentFilter : undefined,
					sortBy: sortBy,
					sortDirection: sortDirection,
				}

				// Add search term if provided
				if (searchTerm && searchTerm.trim()) {
					searchParams.searchTerm = searchTerm.trim()
				}

				console.log('📤 Sending search params:', searchParams)
				const searchResults = await searchEmployees(searchParams)
				console.log('✅ Got search results:', searchResults.length)
				setEmployees(searchResults)
			}

			console.log('✅ Search completed successfully')
		} catch (err) {
			console.error('❌ Error searching employees:', err)
			setError(
				`Failed to search employees: ${
					err instanceof Error ? err.message : 'Unknown error'
				}`
			)
		} finally {
			console.log('🔄 Setting loading to false')
			setLoading(false)
		}
	}, [searchTerm, contractFilter, employmentFilter, sortBy, sortDirection])

	/* --------------------------- INITIAL DATA LOAD ---------------------------- */
	// Load employees when component mounts
	useEffect(() => {
		console.log('🚀 Component mounted, triggering initial search')
		performSearch()
	}, []) // Remove performSearch from dependencies to avoid infinite loop

	/* -------------------------- SEARCH WHEN FILTERS CHANGE ------------------- */
	// Trigger search when filters change (with debounce)
	useEffect(() => {
		console.log('🔄 Filters changed, scheduling search...')
		const timer = setTimeout(() => {
			performSearch()
		}, 300) // 300ms debounce

		return () => {
			console.log('🧹 Cleaning up search timer')
			clearTimeout(timer)
		}
	}, [searchTerm, contractFilter, employmentFilter, sortBy, sortDirection])

	/* ----------------------------- HANDLER FUNCTIONS ----------------------------- */
	// Handle employee deletion
	const handleDeleteEmployee = async (employeeId: number) => {
		const employee = employees.find((emp) => emp.id === employeeId)
		if (!employee) return

		const confirmDelete = confirm(
			`Are you sure you want to delete ${employee.firstName} ${employee.lastName}? This action cannot be undone.`
		)

		if (confirmDelete) {
			try {
				console.log('Deleting employee:', employeeId)
				await deleteEmployee(employeeId)

				// Refresh the search results after deletion
				performSearch()

				console.log('✅ Employee deleted successfully')
				alert('Employee deleted successfully!')
			} catch (err) {
				console.error('❌ Error deleting employee:', err)
				alert('Failed to delete employee. Please try again.')
			}
		}
	}

	// Handle employee editing (navigate to edit page)
	const handleEditEmployee = (employee: Employee) => {
		console.log('✏️ Edit employee:', employee)
		navigate(`/edit-employee/${employee.id}`)
	}

	// Handle employee viewing (show modal)
	const handleViewEmployee = (employee: Employee) => {
		console.log('👁️ View employee details:', employee)
		setSelectedEmployee(employee)
		setIsModalOpen(true)
	}

	// Close modal
	const handleCloseModal = () => {
		setIsModalOpen(false)
		setSelectedEmployee(null)
	}

	// Reset all filters
	const resetFilters = () => {
		setSearchTerm('')
		setContractFilter('ALL')
		setEmploymentFilter('ALL')
		setSortBy('firstName')
		setSortDirection('asc')
	}

	// Convert sortBy display value to backend field name
	const getSortFieldName = (displayValue: string): string => {
		switch (displayValue) {
			case 'name':
				return 'firstName'
			case 'email':
				return 'email'
			case 'startDate':
				return 'startDate'
			default:
				return 'firstName'
		}
	}

	// Handle sort change
	const handleSortChange = (newSortBy: string) => {
		const fieldName = getSortFieldName(newSortBy)
		setSortBy(fieldName)
		// Keep current direction when changing sort field
	}

	// Toggle sort direction
	const toggleSortDirection = () => {
		setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
	}

	/* ------------------------------- RENDER UI -------------------------------- */
	// Show loading state
	if (loading && employees.length === 0) {
		return (
			<div className='min-h-screen bg-gray-50 flex items-center justify-center'>
				<div className='text-center'>
					<div className='inline-block animate-spin rounded-full h-8 w-8 border-2 border-orange-500 border-t-transparent mb-4'></div>
					<p className='text-gray-600 text-sm font-medium'>
						Loading employees...
					</p>
				</div>
			</div>
		)
	}

	// Show error state
	if (error) {
		return (
			<div className='min-h-screen bg-gray-50 flex items-center justify-center'>
				<div className='bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center max-w-md'>
					<div className='text-red-500 text-4xl mb-4'>
						<MdRefresh />
					</div>
					<h3 className='text-lg font-semibold text-gray-900 mb-2'>
						Something went wrong
					</h3>
					<p className='text-gray-600 mb-6'>{error}</p>
					<Button variant='primary' onClick={() => window.location.reload()}>
						<MdRefresh />
						Try Again
					</Button>
				</div>
			</div>
		)
	}

	return (
		<div className='min-h-screen bg-gray-50 py-8'>
			<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
				{/* Page Header */}
				<div className='bg-white rounded-lg shadow-sm border border-gray-200 mb-6'>
					<div className='px-6 py-4 border-b border-gray-200 bg-orange-50'>
						<div className='flex items-center justify-between'>
							<div className='flex items-center space-x-3'>
								<div className='text-2xl text-orange-500'>
									<MdPeople />
								</div>
								<div>
									<h1 className='text-xl font-semibold text-gray-900'>
										All Employees
									</h1>
									<p className='text-sm text-gray-600'>
										Manage your team members and their information
									</p>
								</div>
							</div>
							<div className='flex space-x-3'>
								<Button variant='ghost' onClick={() => navigate('/dashboard')}>
									← Back to Dashboard
								</Button>
								<Button
									className='gap-2'
									variant='secondary'
									onClick={() => navigate('/add-employee')}>
									<MdPersonAdd />
									Add Employee
								</Button>
							</div>
						</div>
					</div>

					{/* Filters and Search */}
					<div className='p-6 bg-gray-50 border-b border-gray-200'>
						<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
							{/* Search Bar */}
							<div className='lg:col-span-1'>
								<div className='relative'>
									<div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
										<MdSearch className='h-4 w-4 text-gray-400' />
									</div>
									<input
										type='text'
										value={searchTerm}
										onChange={(e) => setSearchTerm(e.target.value)}
										className='block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm'
										placeholder='Search by name...'
									/>
								</div>
							</div>

							{/* Contract Type Filter */}
							<div>
								<select
									value={contractFilter}
									onChange={(e) => setContractFilter(e.target.value)}
									className='block w-full px-3 py-2 border border-gray-300 rounded-lg text-sm'>
									<option value='ALL'>All Contract Types</option>
									<option value='PERMANENT'>Permanent</option>
									<option value='CONTRACT'>Contract</option>
								</select>
							</div>

							{/* Employment Basis Filter */}
							<div>
								<select
									value={employmentFilter}
									onChange={(e) => setEmploymentFilter(e.target.value)}
									className='block w-full px-3 py-2 border border-gray-300 rounded-lg text-sm'>
									<option value='ALL'>All Employment Types</option>
									<option value='FULL_TIME'>Full Time</option>
									<option value='PART_TIME'>Part Time</option>
								</select>
							</div>

							{/* Sort By */}
							<div>
								<select
									value={sortBy === 'firstName' ? 'name' : sortBy}
									onChange={(e) => handleSortChange(e.target.value)}
									className='block w-full px-3 py-2 border border-gray-300 rounded-lg text-sm'>
									<option value='name'>Sort by Name</option>
									<option value='email'>Sort by Email</option>
									<option value='startDate'>Sort by Start Date</option>
								</select>
							</div>
						</div>

						{/* Filter Summary and Controls */}
						<div className='flex items-center justify-between mt-4'>
							<div className='text-sm text-gray-600'>
								{loading ? (
									<span className='flex items-center gap-2'>
										<div className='animate-spin rounded-full h-4 w-4 border-2 border-orange-500 border-t-transparent'></div>
										Searching...
									</span>
								) : (
									`Showing ${employees.length} employees`
								)}
							</div>
							<div className='flex items-center space-x-3'>
								{/* Sort Direction Toggle */}
								<Button variant='ghost' size='sm' onClick={toggleSortDirection}>
									{sortDirection === 'asc' ? '↑ Ascending' : '↓ Descending'}
								</Button>

								{/* Reset Filters */}
								{(searchTerm ||
									contractFilter !== 'ALL' ||
									employmentFilter !== 'ALL' ||
									sortBy !== 'firstName') && (
									<Button variant='ghost' size='sm' onClick={resetFilters}>
										<MdFilterList />
										Reset Filters
									</Button>
								)}
							</div>
						</div>
					</div>
				</div>

				{/* Employees Grid */}
				{employees.length > 0 ? (
					<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
						{employees.map((employee) => (
							<EmployeeCard
								key={employee.id}
								employee={employee}
								onView={handleViewEmployee}
								onEdit={handleEditEmployee}
								onDelete={handleDeleteEmployee}
							/>
						))}
					</div>
				) : (
					/* Empty State */
					<div className='bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center'>
						<div className='text-6xl mb-6 text-gray-400'>
							<MdPeople />
						</div>
						<h3 className='text-xl font-semibold text-gray-900 mb-2'>
							No employees found
						</h3>
						<p className='text-gray-600 mb-6'>
							{searchTerm ||
							contractFilter !== 'ALL' ||
							employmentFilter !== 'ALL'
								? 'Try adjusting your search criteria or filters'
								: 'Get started by adding your first employee to the system'}
						</p>
						<div className='flex justify-center space-x-3'>
							{searchTerm ||
							contractFilter !== 'ALL' ||
							employmentFilter !== 'ALL' ? (
								<Button variant='ghost' onClick={resetFilters}>
									<MdFilterList />
									Clear Filters
								</Button>
							) : (
								<Button
									variant='secondary'
									onClick={() => navigate('/add-employee')}>
									<MdPersonAdd />
									Add First Employee
								</Button>
							)}
						</div>
					</div>
				)}
			</div>

			{/* Employee Details Modal */}
			<EmployeeDetailsModal
				employee={selectedEmployee}
				isOpen={isModalOpen}
				onClose={handleCloseModal}
			/>
		</div>
	)
}
