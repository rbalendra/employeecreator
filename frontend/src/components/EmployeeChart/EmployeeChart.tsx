import {
	PieChart,
	Pie,
	Cell,
	Tooltip,
	Legend,
	ResponsiveContainer,
	BarChart,
	Bar,
	XAxis,
	YAxis,
	CartesianGrid,
} from 'recharts' // Recharts library components for building responsive charts

// define the shape of the props our chart expects
interface EmployeeChartProps {
	stats: {
		activeCount: number
		inactiveCount: number
		totalEmployees: number
		fullTimeCount: number
		partTimeCount: number
		permanentCount: number
		contractCount: number
		adminCount: number
		hrCount: number
		managerCount: number
		employeeCount: number
		internCount: number
		contractorCount: number
		// New combined stats for the intersection chart
		activeFullTimeCount: number
		activePartTimeCount: number
		inactiveFullTimeCount: number
		inactivePartTimeCount: number
	}
}

// functional react component / destructuring the stats prop
export const EmployeeChart = ({ stats }: EmployeeChartProps) => {
	// Data for role distribution pie chart
	const roleData = [
		{ name: 'Admin', value: stats.adminCount, color: '#EF4444' },
		{ name: 'HR', value: stats.hrCount, color: '#EC4899' },
		{ name: 'Manager', value: stats.managerCount, color: '#6366F1' },
		{ name: 'Employee', value: stats.employeeCount, color: '#6B7280' },
		{ name: 'Intern', value: stats.internCount, color: '#F59E0B' },
		{ name: 'Contractor', value: stats.contractorCount, color: '#06B6D4' },
	]

	// Data for contract type pie chart
	const contractTypeData = [
		{ name: 'Permanent', value: stats.permanentCount, color: '#8B5CF6' },
		{ name: 'Contract', value: stats.contractCount, color: '#F59E0B' },
	]

	// Data for stacked bar chart showing employment type and status
	const stackedBarData = [
		{
			name: 'Full Time',
			active: stats.activeFullTimeCount,
			inactive: stats.inactiveFullTimeCount,
		},
		{
			name: 'Part Time',
			active: stats.activePartTimeCount,
			inactive: stats.inactivePartTimeCount,
		},
	]

	return (
		<div className='grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8'>
			{/* Stacked Bar Chart: Employment Type & Status */}
			<div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6'>
				<h3 className='text-lg font-semibold text-gray-900 mb-4'>
					Employment Status by Type
				</h3>
				<ResponsiveContainer width='100%' height={250}>
					<BarChart
						data={stackedBarData}
						margin={{
							top: 20,
							right: 30,
							left: 20,
							bottom: 5,
						}}>
						<CartesianGrid strokeDasharray='3 3' />
						<XAxis dataKey='name' />
						<YAxis />
						<Tooltip />
						<Legend />
						<Bar dataKey='active' stackId='a' fill='#10B981' name='Active' />
						<Bar
							dataKey='inactive'
							stackId='a'
							fill='#EF4444'
							name='Inactive'
						/>
					</BarChart>
				</ResponsiveContainer>
			</div>

			{/* Role Distribution Pie Chart */}
			<div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6'>
				<h3 className='text-lg font-semibold text-gray-900 mb-4'>
					Role Distribution
				</h3>
				<ResponsiveContainer width='100%' height={250}>
					<PieChart>
						<Pie
							data={roleData}
							cx='50%'
							cy='50%'
							innerRadius={60}
							outerRadius={100}
							paddingAngle={2}
							dataKey='value'>
							{roleData.map((entry, index) => (
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
							paddingAngle={2}
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
		</div>
	)
}
