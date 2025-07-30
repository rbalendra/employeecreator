import { useEffect } from 'react'
import type { Employee } from '../services/employees'
import {
	MdEmail,
	MdPhone,
	MdHome,
	MdWork,
	MdSchedule,
	MdCalendarToday,
	MdClose,
} from 'react-icons/md'

interface EmployeeDetailsModalProps {
	employee: Employee | null
	isOpen: boolean
	onClose: () => void
}

export const EmployeeDetailsModal = ({
	employee,
	isOpen,
	onClose,
}: EmployeeDetailsModalProps) => {
	// Close modal on escape key press
	useEffect(() => {
		const handleEscape = (event: KeyboardEvent) => {
			if (event.key === 'Escape') {
				// if ESC pressed, call onClose
				onClose()
			}
		}

		if (isOpen) {
			document.addEventListener('keydown', handleEscape) // listen for key presses
			document.body.style.overflow = 'hidden' // Prevent background scrolling
		}

		return () => {
			document.removeEventListener('keydown', handleEscape) //clean up listener
			document.body.style.overflow = 'unset' // restore scrolling
		}
	}, [isOpen, onClose])

	if (!isOpen || !employee) return null //if modal close or no emp, render nothing

	/* -------------------------------------------------------------------------- */
	// Helper function to get initials for image avatar fallback
	const getInitials = (firstName: string, lastName: string) => {
		return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
	}

	// Helper function to get contract type badge color
	const getContractTypeColor = (contractType: string) => {
		return contractType === 'PERMANENT'
			? 'bg-green-100 text-green-800 border border-green-200'
			: 'bg-blue-100 text-blue-800 border border-blue-200'
	}

	// Helper function to get employment basis badge color
	const getEmploymentBasisColor = (basis: string) => {
		return basis === 'FULL_TIME'
			? 'bg-purple-100 text-purple-800 border border-purple-200'
			: 'bg-orange-100 text-orange-800 border border-orange-200'
	}

	return (
		<div className='fixed inset-0 z-50 overflow-y-auto'>
			{/* Backdrop */}
			<div
				className='fixed inset-0 bg-black bg-opacity-50 transition-opacity'
				onClick={onClose}
			/>

			{/* Modal Content */}
			<div className='flex min-h-full items-center justify-center p-4'>
				<div className='relative bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto'>
					{/* Header */}
					<div className='flex items-center justify-between p-6 border-b border-gray-200'>
						<h2 className='text-xl font-semibold text-gray-900'>
							Employee Details
						</h2>
						<button
							onClick={onClose}
							className='text-gray-400 hover:text-gray-600 text-2xl'>
							<MdClose />
						</button>
					</div>

					{/* Content */}
					<div className='p-6 space-y-6'>
						{/* Employee Header */}
						<div className='flex items-center space-x-4 pb-4 border-b border-gray-200'>
							{/* Employee Avatar */}
							<div className='flex-shrink-0'>
								{employee.thumbnailUrl ? (
									<img
										className='h-60 w-60 rounded-full object-cover border-2 border-gray-200'
										src={employee.thumbnailUrl}
										alt={`${employee.firstName} ${employee.lastName}`}
									/>
								) : (
									<div className='h-16 w-16 rounded-full bg-gray-300 flex items-center justify-center text-gray-700 font-medium text-lg border-2 border-gray-200'>
										{getInitials(employee.firstName, employee.lastName)}
									</div>
								)}
							</div>

							{/* Employee Name */}
							<div className='flex-1'>
								<h3 className='text-2xl font-bold text-gray-900'>
									{employee.firstName}{' '}
									{employee.middleName && `${employee.middleName} `}
									{employee.lastName}
								</h3>
								<div className='flex space-x-2 mt-2'>
									<span
										className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getContractTypeColor(
											employee.contractType
										)}`}>
										{employee.contractType}
									</span>
									<span
										className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getEmploymentBasisColor(
											employee.employmentBasis
										)}`}>
										{employee.employmentBasis.replace('_', '-')}
									</span>
									{employee.ongoing && (
										<span className='inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 border border-green-200'>
											ACTIVE
										</span>
									)}
								</div>
							</div>
						</div>

						{/* Contact Information */}
						<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
							<div className='space-y-4'>
								<h4 className='text-lg font-semibold text-gray-900 mb-3'>
									Contact Information
								</h4>

								<div className='flex items-center space-x-3 text-gray-700'>
									<MdEmail className='text-rose-500 text-xl' />
									<div>
										<p className='text-sm text-gray-500'>Email</p>
										<p className='font-medium'>{employee.email}</p>
									</div>
								</div>

								<div className='flex items-center space-x-3 text-gray-700'>
									<MdPhone className='text-rose-500 text-xl' />
									<div>
										<p className='text-sm text-gray-500'>Mobile Number</p>
										<p className='font-medium'>{employee.mobileNumber}</p>
									</div>
								</div>

								<div className='flex items-start space-x-3 text-gray-700'>
									<MdHome className='text-rose-500 text-xl mt-1' />
									<div>
										<p className='text-sm text-gray-500'>Address</p>
										<p className='font-medium'>{employee.residentialAddress}</p>
									</div>
								</div>
							</div>

							<div className='space-y-4'>
								<h4 className='text-lg font-semibold text-gray-900 mb-3'>
									Employment Details
								</h4>

								<div className='flex items-center space-x-3 text-gray-700'>
									<MdWork className='text-rose-500 text-xl' />
									<div>
										<p className='text-sm text-gray-500'>Contract Type</p>
										<p className='font-medium'>{employee.contractType}</p>
									</div>
								</div>

								<div className='flex items-center space-x-3 text-gray-700'>
									<MdSchedule className='text-rose-500 text-xl' />
									<div>
										<p className='text-sm text-gray-500'>Employment Basis</p>
										<p className='font-medium'>
											{employee.employmentBasis.replace('_', ' ')}
										</p>
									</div>
								</div>

								<div className='flex items-center space-x-3 text-gray-700'>
									<MdCalendarToday className='text-rose-500 text-xl' />
									<div>
										<p className='text-sm text-gray-500'>Start Date</p>
										<p className='font-medium'>
											{new Date(employee.startDate).toLocaleDateString('en-AU')}
										</p>
									</div>
								</div>

								{employee.finishDate && (
									<div className='flex items-center space-x-3 text-gray-700'>
										<MdCalendarToday className='text-rose-500 text-xl' />
										<div>
											<p className='text-sm text-gray-500'>End Date</p>
											<p className='font-medium'>
												{new Date(employee.finishDate).toLocaleDateString(
													'en-AU'
												)}
											</p>
										</div>
									</div>
								)}

								{employee.hoursPerWeek && (
									<div className='flex items-center space-x-3 text-gray-700'>
										<MdSchedule className='text-rose-500 text-xl' />
										<div>
											<p className='text-sm text-gray-500'>Hours Per Week</p>
											<p className='font-medium'>{employee.hoursPerWeek}</p>
										</div>
									</div>
								)}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
