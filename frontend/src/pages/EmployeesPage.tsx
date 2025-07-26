import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router'
import { Button } from '../components/Button'
import { EmployeeCard } from '../components/EmployeeCard'
import { EmployeeDetailsModal } from '../components/EmployeeDetailsModal'

import {
	getAllEmployees,
	searchEmployeesSimple,
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
	const [contractFilter, setContractFilter] = useState<string>('ALL') //filter contract type
	const [employmentFilter, setEmploymentFilter] = useState<string>('ALL') //filter full/part time
	const [statusFilter, setStatusFilter] = useState<string>('ALL') // filter active/inactive
	const [sortBy, setSortBy] = useState<string>('firstName') // field to sort by
	const [sortDirection, setSortDirection] = useState<string>('asc') // asc & desc

	// Modal state
	const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
		null
	)
	const [isModalOpen, setIsModalOpen] = useState(false)

	/* ---------------------------- SEARCH EMPLOYEES ---------------------------- */
	// performSearch: a stable function to fetch and apply filters/sorting
	// useCallback ensures the function reference changes only when its dependencies (filters, searchTerm, etc.) change
	const performSearch = useCallback(async () => {
		try {
			setLoading(true)
			setError(null) // Clear any previous errors

			// If no filters are applied, get all employees
			if (
				!searchTerm &&
				contractFilter === 'ALL' &&
				employmentFilter === 'ALL' &&
				statusFilter === 'ALL'
			) {
				console.log('Getting all employees...')
				const allEmployees = await getAllEmployees()
				setEmployees(allEmployees)
			} else {
				// Use backend search with current filters
				const searchParams: EmployeeSearchParams = {
					contractType: contractFilter !== 'ALL' ? contractFilter : undefined,
					employmentBasis:
						employmentFilter !== 'ALL' ? employmentFilter : undefined,
					status: statusFilter !== 'ALL' ? statusFilter : undefined,
					sortBy: sortBy,
					sortDirection: sortDirection,
				}

				// Add search term if provided
				if (searchTerm && searchTerm.trim()) {
					searchParams.searchTerm = searchTerm.trim()
				}
				const searchResults = await searchEmployeesSimple(searchParams)
				setEmployees(searchResults)
			}
		} catch (err) {
			console.error('Error searching employees:', err)
			setError(
				`Failed to search employees: ${
					err instanceof Error ? err.message : 'Unknown error'
				}`
			)
		} finally {
			console.log('Setting loading to false')
			setLoading(false)
		}
	}, [
		searchTerm,
		contractFilter,
		employmentFilter,
		sortBy,
		sortDirection,
		statusFilter,
	])
	// Dependencies array: only create a new version of this function if any of these values change,

	/* --------------------------- INITIAL DATA LOAD ---------------------------- */
	// On first mount, trigger performSearch once
	useEffect(() => {
		performSearch()
	}, []) //excluded dependancy to avoid inifite loops

	/* -------------------------- SEARCH WHEN FILTERS CHANGE ------------------- */
	// Debounce search calls: wait 300ms after last filter/searchTerm update
	// This prevents rapid API calls while the user types or toggles filters
	// if user type "john" without debounce it would trigger 4 API calls (j, jo, joh, john)
	useEffect(() => {
		console.log('🔄 Filters changed, scheduling search...')
		const timer = setTimeout(() => {
			performSearch()
		}, 300) // 300ms debounce: meaning search only triggers if the user stops typing for 300 secs

		return () => {
			console.log('Cleaning up search timer')
			clearTimeout(timer)
		}
	}, [
		searchTerm,
		contractFilter,
		employmentFilter,
		sortBy,
		sortDirection,
		statusFilter,
	])

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
				await performSearch()
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
		navigate(`/edit-employee/${employee.id}`)
	}

	// Handle employee viewing (show modal)
	const handleViewEmployee = (employee: Employee) => {
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
		setStatusFilter('ALL')
		setSortBy('firstName')
		setSortDirection('asc')
	}

	// Map display sort options to backend field names
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
					<div className='px-6 py-4 border-b border-gray-200 bg-slate-100'>
						<div className='flex items-center justify-between'>
							<div className='flex items-center space-x-3'>
								<div className='text-2xl text-rose-500'>
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
						<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4'>
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
							{/* Status Filter (Active/Inactive) */}
							<div>
								<select
									value={statusFilter}
									onChange={(e) => setStatusFilter(e.target.value)}
									className='block w-full px-3 py-2 border border-gray-300 rounded-lg text-sm'>
									<option value='ALL'>All Status Types</option>
									<option value='ACTIVE'>Active Only</option>
									<option value='INACTIVE'>Inactive Only</option>
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
									statusFilter !== 'ALL' ||
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
							employmentFilter !== 'ALL' ||
							statusFilter !== 'ALL'
								? 'Try adjusting your search criteria or filters'
								: 'Get started by adding your first employee to the system'}
						</p>
						<div className='flex justify-center space-x-3'>
							{searchTerm ||
							contractFilter !== 'ALL' ||
							employmentFilter !== 'ALL' ||
							statusFilter !== 'ALL' ? (
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
