import { useState, useEffect } from 'react'
import { StatCard } from './StatCard'
import { EmployeeCard } from './EmployeeCard'
import { EmployeeDetailsModal } from './EmployeeDetailsModal'
import { Button } from './Button'
import {
	getDashboardStats,
	getAllEmployees,
	type Employee,
} from '../services/employees'
import {
	MdPeople,
	MdWork,
	MdSchedule,
	MdBusiness,
	MdDescription,
	MdRefresh,
	MdPersonAdd,
	MdArrowForward,
} from 'react-icons/md'
import { useNavigate } from 'react-router'
import { EmployeeChart } from './EmployeeChart'

export const Dashboard = () => {
	// State for dashboard data
	const [stats, setStats] = useState({
		totalEmployees: 0,
		fullTimeCount: 0,
		partTimeCount: 0,
		permanentCount: 0,
		contractCount: 0,
		activeCount: 0,
		inactiveCount: 0,
	})

	const [recentEmployees, setRecentEmployees] = useState<Employee[]>([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

	// Modal state
	const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
		null
	)
	const [isModalOpen, setIsModalOpen] = useState(false)
	const navigate = useNavigate()
	/* ---------------  Fetch dashboard data on component mount --------------- */
	useEffect(() => {
		const fetchDashboardData = async () => {
			try {
				setLoading(true)
				console.log('🔄 Loading dashboard data...')

				const [dashboardStats, allEmployees] = await Promise.all([
					getDashboardStats(),
					getAllEmployees(),
				])

				// Calculate active/inactive counts
				const isEmployeeActive = (employee: Employee) => {
					const now = new Date()
					const today = new Date(
						now.getFullYear(),
						now.getMonth(),
						now.getDate()
					)

					if (employee.finishDate) {
						const finishDate = new Date(employee.finishDate)
						const finishDateOnly = new Date(
							finishDate.getFullYear(),
							finishDate.getMonth(),
							finishDate.getDate()
						)
						return finishDateOnly >= today
					}
					return true
				}

				const activeEmployees = allEmployees.filter(isEmployeeActive)
				const inactiveEmployees = allEmployees.filter(
					(emp) => !isEmployeeActive(emp)
				)

				// Update stats with calculated active/inactive counts
				setStats({
					...dashboardStats,
					activeCount: activeEmployees.length,
					inactiveCount: inactiveEmployees.length,
				})

				// Sort employees: UPDATED/NEW first, then by most recent
				const sortedEmployees = allEmployees.sort((a, b) => {
					// Helper to check if employee has NEW or UPDATED tag
					const getTagPriority = (employee: Employee) => {
						if (!employee.createdAt || !employee.updatedAt) return 3

						const createdDate = new Date(employee.createdAt)
						const updatedDate = new Date(employee.updatedAt)
						const now = new Date()
						const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000) // 1 hour ago
						const timeDifferenceMs =
							updatedDate.getTime() - createdDate.getTime()

						console.log('🔍 Dashboard Tag Priority Debug:', {
							id: employee.id,
							firstName: employee.firstName,
							createdAt: employee.createdAt,
							updatedAt: employee.updatedAt,
							oneHourAgo: oneHourAgo.toISOString(),
							timeDifferenceMs: timeDifferenceMs,
							isUpdatedRecent: updatedDate > oneHourAgo,
							isCreatedRecent: createdDate > oneHourAgo,
						})

						// UPDATED employees (highest priority) - updated within last hour AND has time difference
						if (updatedDate > oneHourAgo && timeDifferenceMs > 1000) {
							// 1 second minimum difference
							console.log('✅ Dashboard: Employee is UPDATED')
							return 1
						}
						// NEW employees (second priority) - created within last hour AND no significant updates
						if (createdDate > oneHourAgo && timeDifferenceMs <= 1000) {
							// Less than 1 second difference
							console.log('✅ Dashboard: Employee is NEW')
							return 2
						}
						// Regular employees (lowest priority)
						console.log('❌ Dashboard: No tag assigned')
						return 3
					}

					const priorityA = getTagPriority(a)
					const priorityB = getTagPriority(b)

					// If priorities are different, sort by priority
					if (priorityA !== priorityB) {
						return priorityA - priorityB
					}

					// If same priority, sort by most recent update/creation
					const updatedA = a.updatedAt ? new Date(a.updatedAt).getTime() : 0
					const updatedB = b.updatedAt ? new Date(b.updatedAt).getTime() : 0
					return updatedB - updatedA
				})

				// Take top 6 for recent employees
				const recent = sortedEmployees.slice(0, 6)
				setRecentEmployees(recent)

				console.log('✅ Dashboard data loaded successfully')
			} catch (err) {
				console.error('❌ Error loading dashboard data:', err)
				setError('Failed to load dashboard data')
			} finally {
				setLoading(false)
			}
		}

		fetchDashboardData()
	}, [])

	/* ------------------ Handle employee viewing (show modal) ------------------ */
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

	/* ----------------------------- Loading status ----------------------------- */
	if (loading) {
		return (
			<div className='min-h-screen bg-gray-50 flex items-center justify-center'>
				<div className='text-center'>
					<div className='inline-block animate-spin rounded-full h-8 w-8 border-2 border-rose-500 border-t-transparent mb-4'></div>
					<p className='text-gray-600 text-sm font-medium'>
						Loading dashboard...
					</p>
				</div>
			</div>
		)
	}

	/* --------------------------- Fetch error status --------------------------- */
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
		<div className='min-h-screen bg-gray-50'>
			{/* Modern Dashboard Header */}
			<div className='bg-white border-b border-gray-200'>
				<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
					<div className='flex items-center justify-between'>
						<div>
							<h1 className='text-3xl font-bold text-gray-900 mb-2'>
								DASHBOARD
							</h1>
							<p className='text-gray-600'>
								Overview of your team and organisation
							</p>
						</div>
						<div className='text-right'>
							<p className='text-sm text-gray-500 mb-1'>Last updated</p>
							<p className='text-sm font-medium text-gray-900'>
								{new Date().toLocaleDateString('en-AU', {
									day: '2-digit',
									month: '2-digit',
									year: 'numeric',
								})}{' '}
								at{' '}
								{new Date().toLocaleTimeString('en-AU', {
									hour: '2-digit',
									minute: '2-digit',
									hour12: true,
								})}
							</p>
						</div>
					</div>
				</div>
			</div>

			{/* Main Dashboard Content */}
			<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
				{/* Modern Statistics Cards Grid */}
				<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-8 '>
					<StatCard
						title='Total Employees'
						value={stats.totalEmployees}
						icon={<MdPeople />}
						bgColor='border-orange-500 border-2 '
						textColor='text-black'
					/>
					<StatCard
						title='Full Time'
						value={stats.fullTimeCount}
						icon={<MdWork />}
						bgColor='border-green-500 border-2 '
						textColor='text-black'
					/>
					<StatCard
						title='Part Time'
						value={stats.partTimeCount}
						icon={<MdSchedule />}
						bgColor='border-indigo-500 border-2'
						textColor='text-black'
					/>
					<StatCard
						title='Permanent'
						value={stats.permanentCount}
						icon={<MdBusiness />}
						bgColor='border-purple-500 border-2'
						textColor='text-black'
					/>
					<StatCard
						title='Contract'
						value={stats.contractCount}
						icon={<MdDescription />}
						bgColor='border-yellow-500 border-2'
						textColor='text-black'
					/>
				</div>
				{/* Charts Section */}
				<EmployeeChart stats={stats} />

				{/* Modern Recent Employees Section */}
				<div className='bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden'>
					<div className='px-6 py-4 border-b border-gray-200'>
						<div className='flex items-center justify-between'>
							<h2 className='text-lg font-semibold text-gray-900'>
								New and recently updated employees
							</h2>
							<Button
								variant='ghost'
								size='sm'
								onClick={() => navigate('/employees')}>
								<span>View All</span>
								<MdArrowForward />
							</Button>
						</div>
					</div>

					<div className='p-6'>
						{/* Recent Employees Grid */}
						{recentEmployees.length > 0 ? (
							<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
								{recentEmployees.map((employee) => (
									<EmployeeCard
										key={employee.id}
										employee={employee}
										onView={handleViewEmployee}
									/>
								))}
							</div>
						) : (
							<div className='text-center py-12'>
								<div className='text-gray-400 text-5xl mb-4'>
									<MdPeople />
								</div>
								<h3 className='text-lg font-semibold text-gray-900 mb-2'>
									No employees yet
								</h3>
								<p className='text-gray-600 mb-6'>
									Get started by adding your first employee to the system
								</p>
								<Button variant='primary' size='lg'>
									<MdPersonAdd />
									Add First Employee
								</Button>
							</div>
						)}
					</div>
				</div>
			</div>

			{/* Employee Details Modal When an Employee is Selected */}
			<EmployeeDetailsModal
				employee={selectedEmployee}
				isOpen={isModalOpen}
				onClose={handleCloseModal}
			/>
		</div>
	)
}
