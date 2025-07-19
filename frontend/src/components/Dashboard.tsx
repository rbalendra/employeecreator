import { useState, useEffect } from 'react'
import { StatCard } from './StatCard'
import { EmployeeCard } from './EmployeeCard'
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
	MdCheckCircle,
	MdRefresh,
	MdPersonAdd,
	MdArrowForward,
} from 'react-icons/md'

export const Dashboard = () => {
	// State for dashboard data
	const [stats, setStats] = useState({
		totalEmployees: 0,
		fullTimeCount: 0,
		partTimeCount: 0,
		permanentCount: 0,
		contractCount: 0,
		ongoingCount: 0,
	})

	const [recentEmployees, setRecentEmployees] = useState<Employee[]>([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

	// Fetch dashboard data on component mount
	useEffect(() => {
		const fetchDashboardData = async () => {
			try {
				setLoading(true)
				console.log('🔄 Loading dashboard data...')

				// Fetch statistics and recent employees in parallel
				const [dashboardStats, allEmployees] = await Promise.all([
					getDashboardStats(),
					getAllEmployees(),
				])

				// Set statistics
				setStats(dashboardStats)

				// Get 6 most recent employees (by ID for now)
				const recent = allEmployees.sort((a, b) => b.id - a.id).slice(0, 6)
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

	// Show loading state with modern spinner
	if (loading) {
		return (
			<div className='min-h-screen bg-gray-50 flex items-center justify-center'>
				<div className='text-center'>
					<div className='inline-block animate-spin rounded-full h-8 w-8 border-2 border-orange-500 border-t-transparent mb-4'></div>
					<p className='text-gray-600 text-sm font-medium'>
						Loading dashboard...
					</p>
				</div>
			</div>
		)
	}

	// Show error state with modern styling
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
								Dashboard
							</h1>
							<p className='text-gray-600'>
								Overview of your team and organization
							</p>
						</div>
						<div className='text-right'>
							<p className='text-sm text-gray-500 mb-1'>Last updated</p>
							<p className='text-sm font-medium text-gray-900'>
								{new Date().toLocaleTimeString()}
							</p>
						</div>
					</div>
				</div>
			</div>

			{/* Main Dashboard Content */}
			<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
				{/* Modern Statistics Cards Grid */}
				<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8 '>
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
					<StatCard
						title='Active'
						value={stats.ongoingCount}
						icon={<MdCheckCircle />}
						bgColor='border-teal-500 border-2'
						textColor='text-black'
					/>
				</div>

				{/* Modern Recent Employees Section */}
				<div className='bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden'>
					<div className='px-6 py-4 border-b border-gray-200'>
						<div className='flex items-center justify-between'>
							<h2 className='text-lg font-semibold text-gray-900'>
								Recent Employees
							</h2>
							<Button variant='ghost' size='sm'>
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
										onView={(emp) => console.log('View employee:', emp)}
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
		</div>
	)
}
