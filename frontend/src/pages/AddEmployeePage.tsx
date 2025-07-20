import { useNavigate } from 'react-router'
import { employeeSchema, type EmployeeFormData } from './schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { createEmployee, type CreateEmployeeDTO } from '../services/employees'
import { MdArrowBack, MdPersonAdd, MdSave } from 'react-icons/md'
import { Button } from '../components/Button'

export const AddEmployeePage = () => {
	const navigate = useNavigate() // Hook to navigate to other pages

	// FORM SETUP: Initialize React Hook Form with validation and default values
	const {
		register, // connects form inputs to react-hook-form
		handleSubmit, // Function to handle form submission
		formState: { errors, isSubmitting }, // Current form state and any validation errors
		reset, // Function to clear the form fields
		watch, // Function to watch field values for dynamic behavior
	} = useForm<EmployeeFormData>({
		resolver: zodResolver(employeeSchema), // Use our Zod schema for validation
		defaultValues: {
			firstName: '',
			middleName: '',
			lastName: '',
			email: '',
			mobileNumber: '',
			residentialAddress: '',
			contractType: 'PERMANENT',
			employmentBasis: 'FULL_TIME',
			startDate: '',
			finishDate: '',
			ongoing: true,
			hoursPerWeek: 40,
			thumbnailUrl: '',
		},
	})

	// DYNAMIC FIELD VISIBILITY: Watch the 'ongoing' checkbox to show/hide finish date
	const isOngoing = watch('ongoing')

	// FORM SUBMISSION HANDLER: This runs when the user submits the form
	const onSubmit = async (data: EmployeeFormData) => {
		try {
			console.log('Creating new employee with data:', data)

			// TRANSFORM DATA: Convert form data to match API requirements
			const employeeData: CreateEmployeeDTO = {
				...data, // Copy all form fields
				// If ongoing is true, don't send finishDate
				finishDate: data.ongoing ? undefined : data.finishDate,
				// Convert empty string to undefined for optional fields
				middleName: data.middleName || undefined,
				thumbnailUrl: data.thumbnailUrl || undefined,
				hoursPerWeek: data.hoursPerWeek || undefined,
			}

			// API CALL: Send employee data to backend to create employee
			await createEmployee(employeeData)

			// SUCCESS HANDLING
			alert('Employee created successfully!')
			reset() // Clear the form fields
			navigate('/employees') // redirect to employees page
		} catch (error) {
			console.error('Error creating employee:', error)
			alert('Failed to create employee. Please try again.')
		}
	}

	return (
		<div className='min-h-screen bg-gray-50 py-8'>
			<div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8'>
				{/* FORM HEADER SECTION */}
				<div className='bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden'>
					<div className='px-6 py-4 border-b border-gray-200 bg-orange-50'>
						<div className='flex items-center justify-between'>
							<div className='flex items-center space-x-3'>
								<div className='text-2xl text-orange-500'>
									<MdPersonAdd />
								</div>
								<div>
									<h1 className='text-xl font-semibold text-gray-900'>
										Add New Employee
									</h1>
									<p className='text-sm text-gray-600'>
										Fill in all required information to create a new employee
										record
									</p>
								</div>
							</div>
							<Button variant='ghost' onClick={() => navigate('/employees')}>
								<MdArrowBack />
								Back to Employees
							</Button>
						</div>
					</div>

					{/* MAIN FORM SECTION */}
					<form onSubmit={handleSubmit(onSubmit)} className='p-6 space-y-8'>
						{/* PERSONAL INFORMATION SECTION */}
						<div className='bg-gray-50 rounded-lg p-6'>
							<h3 className='text-lg font-medium text-gray-900 mb-4'>
								Personal Information
							</h3>
							<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
								{/* FIRST NAME FIELD */}
								<div>
									<label className='block text-sm font-medium text-gray-700 mb-2'>
										First Name *
									</label>
									<input
										{...register('firstName')}
										type='text'
										className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
											errors.firstName ? 'border-red-500' : 'border-gray-300'
										}`}
										placeholder='Enter first name'
									/>
									{errors.firstName && (
										<p className='mt-1 text-sm text-red-600'>
											{errors.firstName.message}
										</p>
									)}
								</div>

								{/* MIDDLE NAME FIELD (OPTIONAL) */}
								<div>
									<label className='block text-sm font-medium text-gray-700 mb-2'>
										Middle Name
									</label>
									<input
										{...register('middleName')}
										type='text'
										className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500'
										placeholder='Enter middle name (optional)'
									/>
								</div>

								{/* LAST NAME FIELD */}
								<div>
									<label className='block text-sm font-medium text-gray-700 mb-2'>
										Last Name *
									</label>
									<input
										{...register('lastName')}
										type='text'
										className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
											errors.lastName ? 'border-red-500' : 'border-gray-300'
										}`}
										placeholder='Enter last name'
									/>
									{errors.lastName && (
										<p className='mt-1 text-sm text-red-600'>
											{errors.lastName.message}
										</p>
									)}
								</div>

								{/* PROFILE PHOTO URL FIELD (OPTIONAL) */}
								<div>
									<label className='block text-sm font-medium text-gray-700 mb-2'>
										Profile Photo URL
									</label>
									<input
										{...register('thumbnailUrl')}
										type='url'
										className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
											errors.thumbnailUrl ? 'border-red-500' : 'border-gray-300'
										}`}
										placeholder='https://example.com/photo.jpg'
									/>
									{errors.thumbnailUrl && (
										<p className='mt-1 text-sm text-red-600'>
											{errors.thumbnailUrl.message}
										</p>
									)}
								</div>
							</div>
						</div>

						{/* CONTACT INFORMATION SECTION */}
						<div className='bg-gray-50 rounded-lg p-6'>
							<h3 className='text-lg font-medium text-gray-900 mb-4'>
								Contact Information
							</h3>
							<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
								{/* EMAIL FIELD */}
								<div>
									<label className='block text-sm font-medium text-gray-700 mb-2'>
										Email Address *
									</label>
									<input
										{...register('email')}
										type='email'
										className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
											errors.email ? 'border-red-500' : 'border-gray-300'
										}`}
										placeholder='Enter email address'
									/>
									{errors.email && (
										<p className='mt-1 text-sm text-red-600'>
											{errors.email.message}
										</p>
									)}
								</div>

								{/* MOBILE NUMBER FIELD */}
								<div>
									<label className='block text-sm font-medium text-gray-700 mb-2'>
										Mobile Number *
									</label>
									<input
										{...register('mobileNumber')}
										type='tel'
										className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
											errors.mobileNumber ? 'border-red-500' : 'border-gray-300'
										}`}
										placeholder='Enter mobile number'
									/>
									{errors.mobileNumber && (
										<p className='mt-1 text-sm text-red-600'>
											{errors.mobileNumber.message}
										</p>
									)}
								</div>
							</div>

							{/* RESIDENTIAL ADDRESS FIELD (FULL WIDTH) */}
							<div className='mt-4'>
								<label className='block text-sm font-medium text-gray-700 mb-2'>
									Residential Address *
								</label>
								<textarea
									{...register('residentialAddress')}
									rows={3}
									className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
										errors.residentialAddress
											? 'border-red-500'
											: 'border-gray-300'
									}`}
									placeholder='Enter full residential address'
								/>
								{errors.residentialAddress && (
									<p className='mt-1 text-sm text-red-600'>
										{errors.residentialAddress.message}
									</p>
								)}
							</div>
						</div>

						{/* EMPLOYMENT DETAILS SECTION */}
						<div className='bg-gray-50 rounded-lg p-6'>
							<h3 className='text-lg font-medium text-gray-900 mb-4'>
								Employment Details
							</h3>
							<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
								{/* CONTRACT TYPE DROPDOWN */}
								<div>
									<label className='block text-sm font-medium text-gray-700 mb-2'>
										Contract Type *
									</label>
									<select
										{...register('contractType')}
										className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
											errors.contractType ? 'border-red-500' : 'border-gray-300'
										}`}>
										<option value='PERMANENT'>Permanent</option>
										<option value='CONTRACT'>Contract</option>
									</select>
									{errors.contractType && (
										<p className='mt-1 text-sm text-red-600'>
											{errors.contractType.message}
										</p>
									)}
								</div>

								{/* EMPLOYMENT BASIS DROPDOWN */}
								<div>
									<label className='block text-sm font-medium text-gray-700 mb-2'>
										Employment Basis *
									</label>
									<select
										{...register('employmentBasis')}
										className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
											errors.employmentBasis
												? 'border-red-500'
												: 'border-gray-300'
										}`}>
										<option value='FULL_TIME'>Full Time</option>
										<option value='PART_TIME'>Part Time</option>
									</select>
									{errors.employmentBasis && (
										<p className='mt-1 text-sm text-red-600'>
											{errors.employmentBasis.message}
										</p>
									)}
								</div>

								{/* START DATE FIELD */}
								<div>
									<label className='block text-sm font-medium text-gray-700 mb-2'>
										Start Date *
									</label>
									<input
										{...register('startDate')}
										type='date'
										className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
											errors.startDate ? 'border-red-500' : 'border-gray-300'
										}`}
									/>
									{errors.startDate && (
										<p className='mt-1 text-sm text-red-600'>
											{errors.startDate.message}
										</p>
									)}
								</div>

								{/* HOURS PER WEEK FIELD */}
								<div>
									<label className='block text-sm font-medium text-gray-700 mb-2'>
										Hours Per Week
									</label>
									<input
										{...register('hoursPerWeek', { valueAsNumber: true })}
										type='number'
										min='1'
										max='168'
										className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500'
										placeholder='40'
									/>
								</div>
							</div>

							{/* ONGOING EMPLOYMENT CHECKBOX */}
							<div className='mt-4'>
								<div className='flex items-center'>
									<input
										{...register('ongoing')}
										type='checkbox'
										className='h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded'
									/>
									<label className='ml-2 block text-sm text-gray-900'>
										This is an ongoing employment (no end date)
									</label>
								</div>
							</div>

							{/* FINISH DATE FIELD (ONLY SHOWN IF NOT ONGOING) */}
							{!isOngoing && (
								<div className='mt-4'>
									<label className='block text-sm font-medium text-gray-700 mb-2'>
										Finish Date
									</label>
									<input
										{...register('finishDate')}
										type='date'
										className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500'
									/>
								</div>
							)}
						</div>

						{/* FORM SUBMISSION BUTTONS */}
						<div className='flex justify-end space-x-3 pt-6 border-t border-gray-100 gap-4'>
							<Button variant='ghost' onClick={() => navigate('/employees')}>
								Cancel
							</Button>
							<Button
								onClick={handleSubmit(onSubmit)}
								variant='secondary'
								disabled={isSubmitting}
								isActive={true}>
								{isSubmitting ? (
									<>
										<div className='animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent '></div>
										Creating Employee...
									</>
								) : (
									<>
										<MdSave className='mr-3' />
										Create Employee
									</>
								)}
							</Button>
						</div>
					</form>
				</div>
			</div>
		</div>
	)
}
