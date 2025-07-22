import { useNavigate, useParams } from 'react-router'
import { useEffect, useState } from 'react'
import { employeeSchema, type EmployeeFormData } from './schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import {
	createEmployee,
	updateEmployee,
	getEmployeeById,
	type CreateEmployeeDTO,
	type UpdateEmployeeDTO,
} from '../services/employees'
import { MdArrowBack, MdPersonAdd, MdSave, MdEdit } from 'react-icons/md'
import { Button } from '../components/Button'

export const AddEmployeePage = () => {
	const navigate = useNavigate()
	const { id } = useParams<{ id: string }>() // Get employee ID from URL if editing
	const isEditing = Boolean(id) // Check if we're in edit mode
	const [loading, setLoading] = useState(false)

	// FORM SETUP: Initialize React Hook Form with validation and default values
	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
		reset,
		watch,
	} = useForm<EmployeeFormData>({
		resolver: zodResolver(employeeSchema),
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

	// LOAD EMPLOYEE DATA: If editing, fetch and populate the form
	useEffect(() => {
		const loadEmployeeData = async () => {
			if (!isEditing || !id) return

			try {
				setLoading(true)
				console.log('Loading employee data for editing:', id)
				const employee = await getEmployeeById(Number(id))

				// Populate form with existing employee data
				reset({
					firstName: employee.firstName,
					middleName: employee.middleName || '',
					lastName: employee.lastName,
					email: employee.email,
					mobileNumber: employee.mobileNumber,
					residentialAddress: employee.residentialAddress,
					contractType: employee.contractType,
					employmentBasis: employee.employmentBasis,
					startDate: employee.startDate,
					finishDate: employee.finishDate || '',
					ongoing: employee.ongoing,
					hoursPerWeek: employee.hoursPerWeek || 40,
					thumbnailUrl: employee.thumbnailUrl || '',
				})

				console.log('✅ Employee data loaded for editing')
			} catch (error) {
				console.error('❌ Error loading employee data:', error)
				alert('Failed to load employee data. Please try again.')
				navigate('/employees') // Redirect back if loading fails
			} finally {
				setLoading(false)
			}
		}

		loadEmployeeData()
	}, [isEditing, id, reset, navigate])

	// DYNAMIC FIELD VISIBILITY: Watch the 'ongoing' checkbox to show/hide finish date
	const isOngoing = watch('ongoing')

	// FORM SUBMISSION HANDLER: This runs when the user submits the form
	const onSubmit = async (data: EmployeeFormData) => {
		try {
			console.log(
				`${isEditing ? 'Updating' : 'Creating'} employee with data:`,
				data
			)

			if (isEditing && id) {
				// UPDATE EXISTING EMPLOYEE
				const updateData: UpdateEmployeeDTO = {
					...data,
					finishDate: data.ongoing ? undefined : data.finishDate,
					middleName: data.middleName || undefined,
					thumbnailUrl: data.thumbnailUrl || undefined,
					hoursPerWeek: data.hoursPerWeek || undefined,
				}

				await updateEmployee(Number(id), updateData)
				alert('Employee updated successfully!')
			} else {
				// CREATE NEW EMPLOYEE
				const employeeData: CreateEmployeeDTO = {
					...data,
					finishDate: data.ongoing ? undefined : data.finishDate,
					middleName: data.middleName || undefined,
					thumbnailUrl: data.thumbnailUrl || undefined,
					hoursPerWeek: data.hoursPerWeek || undefined,
				}

				await createEmployee(employeeData)
				alert('Employee created successfully!')
				reset() // Only reset form when creating new employee
			}

			navigate('/employees') // Redirect to employees page
		} catch (error) {
			console.error(
				`Error ${isEditing ? 'updating' : 'creating'} employee:`,
				error
			)
			alert(
				`Failed to ${
					isEditing ? 'update' : 'create'
				} employee. Please try again.`
			)
		}
	}

	// Show loading state while fetching employee data for editing
	if (loading) {
		return (
			<div className='min-h-screen bg-gray-50 flex items-center justify-center'>
				<div className='text-center'>
					<div className='inline-block animate-spin rounded-full h-8 w-8 border-2 border-orange-500 border-t-transparent mb-4'></div>
					<p className='text-gray-600 text-sm font-medium'>
						Loading employee data...
					</p>
				</div>
			</div>
		)
	}

	return (
		<div className='min-h-screen bg-gray-50 py-8'>
			<div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8'>
				{/* FORM HEADER SECTION */}
				<div className='bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden'>
					<div className='px-6 py-4 border-b border-gray-200 bg-slate-100'>
						<div className='flex items-center justify-between'>
							<div className='flex items-center space-x-3'>
								<div className='text-2xl text-rose-500'>
									{isEditing ? <MdEdit /> : <MdPersonAdd />}
								</div>
								<div>
									<h1 className='text-xl font-semibold text-gray-900'>
										{isEditing ? 'Edit Employee' : 'Add New Employee'}
									</h1>
									<p className='text-sm text-gray-600'>
										{isEditing
											? 'Update employee information'
											: 'Fill in all required information to create a new employee record'}
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
										className={`w-full px-3 py-2 border rounded-lg ${
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
										className='w-full px-3 py-2 border border-gray-300 rounded-lg '
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
										className={`w-full px-3 py-2 border rounded-lg  ${
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
										className={`w-full px-3 py-2 border rounded-lg  ${
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
										className={`w-full px-3 py-2 border rounded-lg  ${
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
										className={`w-full px-3 py-2 border rounded-lg  ${
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
									className={`w-full px-3 py-2 border rounded-lg  ${
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
										className={`w-full px-3 py-2 border rounded-lg  ${
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
										className={`w-full px-3 py-2 border rounded-lg  ${
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
										className={`w-full px-3 py-2 border rounded-lg  ${
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
										className='w-full px-3 py-2 border border-gray-300 rounded-lg '
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
										className='h-4 w-4 border-gray-300 rounded'
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
										className={`w-full px-3 py-2 border rounded-lg  ${
											errors.finishDate ? 'border-red-500' : 'border-gray-300'
										}`}
									/>
									{errors.finishDate && (
										<p className='mt-1 text-sm text-red-600'>
											{errors.finishDate.message}
										</p>
									)}
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
										{isEditing
											? 'Updating Employee...'
											: 'Creating Employee...'}
									</>
								) : (
									<>
										<MdSave className='mr-3' />
										{isEditing ? 'Update Employee' : 'Create Employee'}
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
