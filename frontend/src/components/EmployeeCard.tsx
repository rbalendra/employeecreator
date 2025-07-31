import { MdDelete, MdEdit, MdVisibility } from 'react-icons/md'
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
	// Helper function: build initials from first and last names
	const getInitials = (firstName: string, lastName: string) => {
		return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
	}

	// Helper function to determine if the employee is new (created within last hour)
	const getEmployeeTag = () => {
		if (employee.createdAt) {
			const createdDate = new Date(employee.createdAt)
			const now = new Date()
			const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000) // 1 hour ago

			// Show NEW if created in last hour
			if (createdDate > oneHourAgo) {
				return { type: 'NEW', color: 'bg-green-500 text-white' }
			}
		}

		return null
	}
	const employeeTag = getEmployeeTag()

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

	// Helper function to determine if employee is active
	// BUSINESS LOGIC: ACTIVE = contract not expired, INACTIVE = contract expired
	const getEmployeeStatus = () => {
		const now = new Date()
		const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())

		// If there's a finish date, check if contract has expired
		if (employee.finishDate) {
			const finishDate = new Date(employee.finishDate)
			const finishDateOnly = new Date(
				finishDate.getFullYear(),
				finishDate.getMonth(),
				finishDate.getDate()
			)

			// Contract expired = INACTIVE, Contract still valid = ACTIVE
			return finishDateOnly < today
				? { isActive: false, label: 'INACTIVE' }
				: { isActive: true, label: 'ACTIVE' }
		}

		// No finish date = ongoing contract = ACTIVE
		return { isActive: true, label: 'ACTIVE' }
	}

	// Helper function to check if end date has elapsed
	const isEndDateElapsed = () => {
		if (!employee.finishDate) return false

		const now = new Date()
		const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
		const finishDate = new Date(employee.finishDate)
		const finishDateOnly = new Date(
			finishDate.getFullYear(),
			finishDate.getMonth(),
			finishDate.getDate()
		)

		return finishDateOnly < today
	}

	const employeeStatus = getEmployeeStatus()

	// Helper function to get card styling based on employee status
	const getCardStyling = () => {
		return employeeStatus.isActive
			? 'bg-white border-lime-400 hover:shadow-md hover:border-lime-600'
			: 'bg-gray-50 border-red-400 hover:shadow-sm hover:border-red-600'
	}

	return (
		<div
			className={`relative rounded-lg shadow-sm border p-6 transition-shadow ${getCardStyling()}`}>
			{employeeTag && (
				<div
					className={`absolute -top-2 -right-2 ${employeeTag.color} text-xs font-bold px-2 py-1 rounded-full shadow-lg z-10`}>
					{employeeTag.type}
				</div>
			)}
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
					<span
						className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
							employeeStatus.isActive
								? 'bg-green-100 text-green-800 border-green-800 border-1'
								: 'bg-red-800 text-white border-red-800 border-1'
						}`}>
						{employeeStatus.label}
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
						<p className={isEndDateElapsed() ? 'text-red-600 font-medium' : ''}>
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
							className='flex items-center gap-1.5 px-3 py-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md transition-colors text-sm font-medium'>
							<MdVisibility className='w-4 h-4' />
							View
						</button>
					)}
					{onEdit && (
						<button
							onClick={() => onEdit(employee)}
							className='flex items-center gap-1.5 px-3 py-1.5 text-green-600 hover:text-green-800 hover:bg-green-50 rounded-md transition-colors text-sm font-medium'>
							<MdEdit className='w-4 h-4' />
							Update
						</button>
					)}
					{onDelete && (
						<button
							onClick={() => onDelete(employee.id)}
							className='flex items-center gap-1.5 px-3 py-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md transition-colors text-sm font-medium'>
							<MdDelete className='w-4 h-4' />
							Delete
						</button>
					)}
				</div>
			)}
		</div>
	)
}
