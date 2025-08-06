import { useEffect } from 'react'
import type { Employee } from '../../services/employees'
import {
	MdEmail,
	MdPhone,
	MdHome,
	MdWork,
	MdSchedule,
	MdCalendarToday,
	MdClose,
	MdUpdate,
	MdAdd,
	MdAdminPanelSettings,
	MdGroup,
	MdManageAccounts,
	MdBusiness,
	MdSchool,
	MdEngineering,
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
	// Close modal on escape key press and manage body scroll
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

	// Don't render anything if modal is closed or no employee data
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

	// Helper function to get role badge color
	const getRoleColor = (role: string) => {
		switch (role) {
			case 'ADMIN':
				return 'bg-red-100 text-red-800 border border-red-200'
			case 'HR':
				return 'bg-pink-100 text-pink-800 border border-pink-200'
			case 'MANAGER':
				return 'bg-indigo-100 text-indigo-800 border border-indigo-200'
			case 'EMPLOYEE':
				return 'bg-gray-100 text-gray-800 border border-gray-200'
			case 'INTERN':
				return 'bg-yellow-100 text-yellow-800 border border-yellow-200'
			case 'CONTRACTOR':
				return 'bg-cyan-100 text-cyan-800 border border-cyan-200'
			default:
				return 'bg-gray-100 text-gray-800 border border-gray-200'
		}
	}

	return (
		<div className='fixed inset-0 z-50 overflow-y-auto'>
			{/* Backdrop */}
			<div
				className='fixed inset-0 bg-black bg-opacity-50 transition-opacity'
				onClick={onClose}
			/>

			{/* Modal container - responsive sizing */}
			<div className='flex min-h-full items-center justify-center p-2 sm:p-4'>
				<div className='relative bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[95vh] overflow-y-auto mx-2 sm:mx-4'>
					{/* Modal header with close button */}
					<div className='flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 bg-gradient-to-r from-rose-50 to-orange-50'>
						<h2 className='text-lg sm:text-xl font-semibold text-gray-900'>
							Employee Details
						</h2>
						<button
							onClick={onClose}
							className='text-gray-400 hover:text-gray-600 text-2xl p-1 rounded-full hover:bg-white/50 transition-colors'>
							<MdClose />
						</button>
					</div>

					{/* Main content area */}
					<div className='p-4 sm:p-6 space-y-6'>
						{/* Driver's License Style Card */}
						<div className='bg-gradient-to-br from-blue-50 via-white to-purple-50 border-1 border-gray-300 rounded-xl shadow-lg overflow-hidden'>
							{/* Card header with company branding */}
							<div className='bg-gradient-to-r from-rose-500 to-slate-300 text-white p-3 sm:p-4'>
								<div className='flex items-center justify-between'>
									<div>
										<h3 className='text-xl font-bold'>TALENT FORGE</h3>
										<p className='text-s opacity-90'>Employee ID Card</p>
									</div>
									<div className='text-right'>
										<p className='text-xs font-bold text-slate-900 opacity-90'>
											{employee.ongoing ? 'ACTIVE' : 'INACTIVE'}
										</p>
									</div>
								</div>
							</div>

							{/* Main card content - driver's license layout */}
							<div className='p-4 sm:p-6'>
								<div className='flex flex-col sm:flex-row gap-4 sm:gap-6'>
									{/* Left side - Photo */}
									<div className='flex-shrink-0 text-center sm:text-left'>
										{employee.thumbnailUrl ? (
											<img
												className='w-40 h-62 sm:w-42 sm:h-50 object-cover rounded-lg mx-auto sm:mx-0'
												src={employee.thumbnailUrl}
												alt={`${employee.firstName} ${employee.lastName}`}
											/>
										) : (
											<div className='w-24 h-32 sm:w-32 sm:h-40 bg-gray-300 flex items-center justify-center text-gray-700 font-bold text-lg sm:text-xl rounded-lg border-2 border-gray-300 mx-auto sm:mx-0'>
												{getInitials(employee.firstName, employee.lastName)}
											</div>
										)}
									</div>

									{/* Right side - Employee information in driver's license format */}
									<div className='flex-1 space-y-3 sm:space-y-4'>
										{/* Employee name - large and prominent */}
										<div>
											<h3 className='text-xl sm:text-2xl font-bold text-gray-900 text-center sm:text-left'>
												{employee.firstName.toUpperCase()}{' '}
												{employee.middleName &&
													`${employee.middleName.toUpperCase()} `}
												{employee.lastName.toUpperCase()}
											</h3>
										</div>

										{/* Personal details in compact rows */}
										<div className='grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 text-sm'>
											{/* Email */}
											<div className='flex items-center gap-2'>
												<MdEmail className='text-rose-500 text-base flex-shrink-0' />
												<div className='min-w-0'>
													<p className='text-xs text-gray-500 uppercase tracking-wide'>
														Email
													</p>
													<p className='font-medium truncate'>
														{employee.email}
													</p>
												</div>
											</div>

											{/* Phone */}
											<div className='flex items-center gap-2'>
												<MdPhone className='text-rose-500 text-base flex-shrink-0' />
												<div>
													<p className='text-xs text-gray-500 uppercase tracking-wide'>
														Phone
													</p>
													<p className='font-medium'>{employee.mobileNumber}</p>
												</div>
											</div>

											{/* Contract Type */}
											<div className='flex items-center gap-2'>
												<MdWork className='text-rose-500 text-base flex-shrink-0' />
												<div>
													<p className='text-xs text-gray-500 uppercase tracking-wide'>
														Contract
													</p>
													<p className='font-medium'>{employee.contractType}</p>
												</div>
											</div>

											{/* Employment Type */}
											<div className='flex items-center gap-2'>
												<MdSchedule className='text-rose-500 text-base flex-shrink-0' />
												<div>
													<p className='text-xs text-gray-500 uppercase tracking-wide'>
														Type
													</p>
													<p className='font-medium'>
														{employee.employmentBasis.replace('_', ' ')}
													</p>
												</div>
											</div>

											{/* Start Date */}
											<div className='flex items-center gap-2'>
												<MdCalendarToday className='text-rose-500 text-base flex-shrink-0' />
												<div>
													<p className='text-xs text-gray-500 uppercase tracking-wide'>
														Start Date
													</p>
													<p className='font-medium'>
														{new Date(employee.startDate).toLocaleDateString(
															'en-AU'
														)}
													</p>
												</div>
											</div>

											{/* Hours per week (if available) */}
											{employee.hoursPerWeek && (
												<div className='flex items-center gap-2'>
													<MdSchedule className='text-rose-500 text-base flex-shrink-0' />
													<div>
														<p className='text-xs text-gray-500 uppercase tracking-wide'>
															Hours/Week
														</p>
														<p className='font-medium'>
															{employee.hoursPerWeek}
														</p>
													</div>
												</div>
											)}
										</div>

										{/* Status badges */}
										<div className='flex flex-wrap gap-2 justify-center sm:justify-start'>
											<span
												className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getContractTypeColor(
													employee.contractType
												)}`}>
												{employee.contractType}
											</span>
											<span
												className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getEmploymentBasisColor(
													employee.employmentBasis
												)}`}>
												{employee.employmentBasis.replace('_', '-')}
											</span>
											<span
												className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(
													employee.role
												)}`}>
												{employee.role}
											</span>
											{employee.ongoing && (
												<span className='inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200'>
													ACTIVE
												</span>
											)}
										</div>
									</div>
								</div>

								{/* Address section - full width below the main info */}
								<div className='mt-4 pt-4 border-t border-gray-200'>
									<div className='flex items-start gap-2'>
										<MdHome className='text-rose-500 text-base mt-1 flex-shrink-0' />
										<div className='min-w-0'>
											<p className='text-xs text-gray-500 uppercase tracking-wide mb-1'>
												Residential Address
											</p>
											<p className='font-medium text-sm leading-relaxed'>
												{employee.residentialAddress}
											</p>
										</div>
									</div>
								</div>

								{/* End date if applicable */}
								{employee.finishDate && (
									<div className='mt-4 pt-4 border-t border-gray-200'>
										<div className='flex items-center gap-2'>
											<MdCalendarToday className='text-red-500 text-base flex-shrink-0' />
											<div>
												<p className='text-xs text-gray-500 uppercase tracking-wide'>
													End Date
												</p>
												<p className='font-medium text-red-600'>
													{new Date(employee.finishDate).toLocaleDateString(
														'en-AU'
													)}
												</p>
											</div>
										</div>
									</div>
								)}
							</div>
						</div>

						{/* Record Information Section - moved to bottom */}
						<div className='bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-4 sm:p-6'>
							<h4 className='text-base sm:text-lg font-semibold text-gray-900 mb-4 flex items-center'>
								<MdUpdate className='text-yellow-600 text-xl mr-2' />
								Record Information
							</h4>

							{/* Responsive grid for record timestamps */}
							<div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
								{/* Created timestamp */}
								{employee.createdAt && (
									<div className='flex items-center space-x-3'>
										<MdAdd className='text-green-600 text-xl flex-shrink-0' />
										<div>
											<p className='text-sm text-gray-600 font-medium'>
												Created
											</p>
											<p className='text-sm text-gray-800'>
												{new Date(employee.createdAt).toLocaleString('en-AU', {
													year: 'numeric',
													month: 'long',
													day: 'numeric',
													hour: '2-digit',
													minute: '2-digit',
													hour12: true,
												})}
											</p>
										</div>
									</div>
								)}

								{/* Last updated timestamp */}
								{employee.updatedAt && (
									<div className='flex items-center space-x-3'>
										<MdUpdate className='text-blue-600 text-xl flex-shrink-0' />
										<div>
											<p className='text-sm text-gray-600 font-medium'>
												Last Updated
											</p>
											<p className='text-sm text-gray-800'>
												{new Date(employee.updatedAt).toLocaleString('en-AU', {
													year: 'numeric',
													month: 'long',
													day: 'numeric',
													hour: '2-digit',
													minute: '2-digit',
													hour12: true,
												})}
											</p>
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
