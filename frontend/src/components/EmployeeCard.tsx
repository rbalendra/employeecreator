import type { Employee } from '../services/employees'

//props accepted by Employeecards
interface EmployeeCardProps {
	employee: Employee // Employee data to display
	onEdit?: (employee: Employee) => void
	onDelete?: (id: number) => void
	onView?: (employee: Employee) => void
}

export const EmployeeCard = ({
	employee,
	onEdit,
	onDelete,
	onView,
}: EmployeeCardProps) => {
	// Helper function to get initials for avatar fallback
	const getInitials = (firstName: string, lastName: string) => {
		return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
	}

	// Helper function to get contract type badge color
	const getContractTypeColor = (contractType: string) => {
		return contractType === 'PERMANENT'
			? 'bg-green-100 text-green-800 border'
			: 'bg-blue-100 text-blue-800 border'
	}

	// Helper function to get employment basis badge color
	const getEmploymentBasisColor = (basis: string) => {
		return basis === 'FULL_TIME'
			? 'bg-purple-100 text-purple-800 border'
			: 'bg-orange-100 text-orange-800 border'
	}

	return (
		<div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow'>
			{/* Employee Header - Photo and Basic Info */}
			<div className='flex items-start space-x-4'>
				{/* Employee Avatar */}
				<div className='flex-shrink-0'>
					{employee.thumbnailUrl ? (
						<img
							className='h-12 w-12 rounded-full object-cover'
							src={employee.thumbnailUrl}
							alt={`${employee.firstName} ${employee.lastName}`}
						/>
					) : (
						<div className='h-12 w-12 rounded-full bg-gray-300 flex items-center justify-center text-gray-700 font-medium'>
							{getInitials(employee.firstName, employee.lastName)}
						</div>
					)}
				</div>

				{/* Employee Name and Email */}
				<div className='flex-1 min-w-0'>
					<h3 className='text-lg font-semibold text-gray-900 truncate'>
						{employee.firstName}{' '}
						{employee.middleName && `${employee.middleName} `}
						{employee.lastName}
					</h3>
					<p className='text-sm text-gray-600 truncate'>{employee.email}</p>
					<p className='text-sm text-gray-500'>{employee.mobileNumber}</p>
				</div>
			</div>

			{/* Employee Details */}
			<div className='mt-4 space-y-2'>
				{/* Contract and Employment Type Badges */}
				<div className='flex space-x-2'>
					<span
						className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getContractTypeColor(
							employee.contractType
						)}`}>
						{employee.contractType}
					</span>
					<span
						className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getEmploymentBasisColor(
							employee.employmentBasis
						)}`}>
						{employee.employmentBasis.replace('_', '-')}
					</span>
				</div>

				{/* Additional Info */}
				<div className='text-sm text-gray-600'>
					<p>
						Start Date:{' '}
						{new Date(employee.startDate).toLocaleDateString('en-AU')}
					</p>
					{employee.hoursPerWeek && <p>Hours/Week: {employee.hoursPerWeek}</p>}
					{employee.finishDate && (
						<p>
							End Date:{' '}
							{new Date(employee.finishDate).toLocaleDateString('en-AU')}
						</p>
					)}
				</div>
			</div>

			{/* Action Buttons */}
			{(onView || onEdit || onDelete) && (
				<div className='mt-4 flex space-x-2 gap-2 cursor-pointer text-m'>
					{onView && (
						<button
							onClick={() => onView(employee)}
							className='text-blue-600 hover:text-blue-800 text-sm font-medium'>
							View
						</button>
					)}
					{onEdit && (
						<button
							onClick={() => onEdit(employee)}
							className='text-green-600 hover:text-green-800 text-sm font-medium'>
							Edit
						</button>
					)}
					{onDelete && (
						<button
							onClick={() => onDelete(employee.id)}
							className='text-red-600 hover:text-red-800 text-sm font-medium '>
							Delete
						</button>
					)}
				</div>
			)}
		</div>
	)
}
