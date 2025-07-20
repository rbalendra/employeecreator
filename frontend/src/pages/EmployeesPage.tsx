import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { Button } from '../components/Button'
import { EmployeeCard } from '../components/EmployeeCard'
import { EmployeeDetailsModal } from '../components/EmployeeDetailsModal'
import {
	getAllEmployees,
	deleteEmployee,
	type Employee,
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
	const [employees, setEmployees] = useState<Employee[]>([]) // All employees from API
	const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([]) // search/filter/sort
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)
	const [searchTerm, setSearchTerm] = useState('')
	const [contractFilter, setContractFilter] = useState<string>('ALL') // contract type filter
	const [employmentFilter, setEmploymentFilter] = useState<string>('ALL') // employment basis filter
	const [sortBy, setSortBy] = useState<string>('name') // field to sort by

	// Modal state
	const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
		null
	)
	const [isModalOpen, setIsModalOpen] = useState(false)

	/* -------------------------------------------------------------------------- */
	// Fetch all employees on component mount
	useEffect(() => {
		const fetchEmployees = async () => {
			try {
				setLoading(true)
				console.log('🔄 Loading employees...')
				const employeeData = await getAllEmployees() // API call
				setEmployees(employeeData) // save full list
				setFilteredEmployees(employeeData) // initialise filtered list
				console.log('✅ Employees loaded successfully:', employeeData.length)
			} catch (err) {
				console.error('❌ Error loading employees:', err)
				setError('Failed to load employees')
			} finally {
				setLoading(false)
			}
		}

		fetchEmployees()
	}, [])
	/* -------------------------------------------------------------------------- */
	// Filter and sort employees when filters change
	useEffect(() => {
		let filtered = [...employees] // copy into filtered variable

		// Apply search filter
		if (searchTerm) {
			filtered = filtered.filter(
				(emp) =>
					emp.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
					emp.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
					emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
					emp.mobileNumber.includes(searchTerm)
			)
		}

		// Apply contract type filter
		if (contractFilter !== 'ALL') {
			filtered = filtered.filter((emp) => emp.contractType === contractFilter)
		}

		// Apply employment basis filter
		if (employmentFilter !== 'ALL') {
			filtered = filtered.filter(
				(emp) => emp.employmentBasis === employmentFilter
			)
		}

		// Apply sorting
		filtered.sort((a, b) => {
			switch (sortBy) {
				case 'name':
					return `${a.firstName} ${a.lastName}`.localeCompare(
						`${b.firstName} ${b.lastName}`
					)
				case 'email':
					return a.email.localeCompare(b.email)
				case 'startDate':
					return (
						new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
					)
				case 'contractType':
					return a.contractType.localeCompare(b.contractType)
				default:
					return 0
			}
		})

		setFilteredEmployees(filtered) //update UI list
	}, [employees, searchTerm, contractFilter, employmentFilter, sortBy])
	/* -------------------------------------------------------------------------- */

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
				await deleteEmployee(employeeId) //update db

				// Update local state by removing the deleted employee
				const updatedEmployees = employees.filter(
					(emp) => emp.id !== employeeId
				)
				setEmployees(updatedEmployees)

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
		// For now, we'll navigate to add employee page
		// In a real app, you'd create an EditEmployeePage
		console.log('✏️ Edit employee:', employee)
		alert(
			`Edit functionality for ${employee.firstName} ${employee.lastName} coming soon!`
		)
		// navigate(`/edit-employee/${employee.id}`)
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
		setSortBy('name')
	}

	// Show loading state
	if (loading) {
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
						<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4'>
							{/* Search Bar */}
							<div className='lg:col-span-2'>
								<div className='relative'>
									<div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
										<MdSearch className='h-4 w-4 text-gray-400' />
									</div>
									<input
										type='text'
										value={searchTerm}
										onChange={(e) => setSearchTerm(e.target.value)}
										className='block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm'
										placeholder='Search employees...'
									/>
								</div>
							</div>

							{/* Contract Type Filter */}
							<div>
								<select
									value={contractFilter}
									onChange={(e) => setContractFilter(e.target.value)}
									className='block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm'>
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
									className='block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm'>
									<option value='ALL'>All Employment Types</option>
									<option value='FULL_TIME'>Full Time</option>
									<option value='PART_TIME'>Part Time</option>
								</select>
							</div>

							{/* Sort By */}
							<div>
								<select
									value={sortBy}
									onChange={(e) => setSortBy(e.target.value)}
									className='block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm'>
									<option value='name'>Sort by Name</option>
									<option value='email'>Sort by Email</option>
									<option value='startDate'>Sort by Start Date</option>
									<option value='contractType'>Sort by Contract Type</option>
								</select>
							</div>
						</div>

						{/* Filter Summary and Reset */}
						<div className='flex items-center justify-between mt-4'>
							<div className='text-sm text-gray-600'>
								Showing {filteredEmployees.length} of {employees.length}{' '}
								employees
							</div>
							{(searchTerm ||
								contractFilter !== 'ALL' ||
								employmentFilter !== 'ALL' ||
								sortBy !== 'name') && (
								<Button variant='ghost' size='sm' onClick={resetFilters}>
									<MdFilterList />
									Reset Filters
								</Button>
							)}
						</div>
					</div>
				</div>

				{/* Employees Grid */}
				{filteredEmployees.length > 0 ? (
					<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
						{filteredEmployees.map((employee) => (
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
							{employees.length === 0
								? 'No employees found'
								: 'No employees match your filters'}
						</h3>
						<p className='text-gray-600 mb-6'>
							{employees.length === 0
								? 'Get started by adding your first employee to the system'
								: 'Try adjusting your search criteria or filters'}
						</p>
						<div className='flex justify-center space-x-3'>
							{employees.length === 0 ? (
								<Button
									variant='secondary'
									onClick={() => navigate('/add-employee')}>
									<MdPersonAdd />
									Add First Employee
								</Button>
							) : (
								<Button variant='ghost' onClick={resetFilters}>
									<MdFilterList />
									Clear Filters
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
