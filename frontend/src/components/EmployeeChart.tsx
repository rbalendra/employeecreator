import {
	PieChart,
	Pie,
	Cell,
	Tooltip,
	Legend,
	ResponsiveContainer,
} from 'recharts'

interface EmployeeChartProps {
	stats: {
		activeCount: number
		inactiveCount: number
		totalEmployees: number
		fullTimeCount: number
		partTimeCount: number
		permanentCount: number
		contractCount: number
	}
}

export const EmployeeChart = ({ stats }: EmployeeChartProps) => {
	// Data for employment type pie chart
	const employmentTypeData = [
		{ name: 'Full Time', value: stats.fullTimeCount, color: '#10B981' },
		{ name: 'Part Time', value: stats.partTimeCount, color: '#6366F1' },
	]

	// Data for contract type pie chart
	const contractTypeData = [
		{ name: 'Permanent', value: stats.permanentCount, color: '#8B5CF6' },
		{ name: 'Contract', value: stats.contractCount, color: '#F59E0B' },
	]

	// Data for employee status pie chart
	const statusData = [
		{ name: 'Active', value: stats.activeCount, color: '#22C55E' },
		{ name: 'Inactive', value: stats.inactiveCount, color: '#EF4444' },
	]

	return (
		<div className='grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8'>
			{/* Employment Type Pie Chart */}
			<div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6'>
				<h3 className='text-lg font-semibold text-gray-900 mb-4'>
					Employment Type Distribution
				</h3>
				<ResponsiveContainer width='100%' height={250}>
					<PieChart>
						<Pie
							data={employmentTypeData}
							cx='50%'
							cy='50%'
							innerRadius={60}
							outerRadius={100}
							paddingAngle={5}
							dataKey='value'>
							{employmentTypeData.map((entry, index) => (
								<Cell key={`cell-${index}`} fill={entry.color} />
							))}
						</Pie>
						<Tooltip />
						<Legend />
					</PieChart>
				</ResponsiveContainer>
			</div>

			{/* Contract Type Pie Chart */}
			<div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6'>
				<h3 className='text-lg font-semibold text-gray-900 mb-4'>
					Contract Type Distribution
				</h3>
				<ResponsiveContainer width='100%' height={250}>
					<PieChart>
						<Pie
							data={contractTypeData}
							cx='50%'
							cy='50%'
							innerRadius={60}
							outerRadius={100}
							paddingAngle={5}
							dataKey='value'>
							{contractTypeData.map((entry, index) => (
								<Cell key={`cell-${index}`} fill={entry.color} />
							))}
						</Pie>
						<Tooltip />
						<Legend />
					</PieChart>
				</ResponsiveContainer>
			</div>

			{/* Employee Status Pie Chart */}
			<div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6'>
				<h3 className='text-lg font-semibold text-gray-900 mb-4'>
					Employee Status Distribution
				</h3>
				<ResponsiveContainer width='100%' height={250}>
					<PieChart>
						<Pie
							data={statusData}
							cx='50%'
							cy='50%'
							innerRadius={60}
							outerRadius={100}
							paddingAngle={5}
							dataKey='value'>
							{statusData.map((entry, index) => (
								<Cell key={`cell-${index}`} fill={entry.color} />
							))}
						</Pie>
						<Tooltip />
						<Legend />
					</PieChart>
				</ResponsiveContainer>
			</div>
		</div>
	)
}
