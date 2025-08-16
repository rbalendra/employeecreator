import { useNavigate, useParams } from 'react-router'
import { useEffect, useState, useTransition } from 'react'
import { employeeSchema, type EmployeeFormData } from './schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'
import {
	createEmployee,
	updateEmployee,
	getEmployeeById,
	type CreateEmployeeDTO,
	type UpdateEmployeeDTO,
} from '../services/employees'
import {
	MdArrowBack,
	MdPersonAdd,
	MdSave,
	MdEdit,
	MdRefresh,
} from 'react-icons/md'
import { ImMagicWand } from 'react-icons/im'
import { Button } from '../components/Button/Button'

//Cloudinary import for profile images
import { uploadUrl, uploadPreset, cloudName } from '../config/cloudinary'

//modal that generates AI headshot and returns the image blob
import AIImageModal from '../components/AIImageModal/AIImageModal'

export const AddEmployeePage = () => {
	// Extract navigation function and route parameters
	const navigate = useNavigate()
	const { id } = useParams<{ id: string }>() // Get employee ID from URL if editing
	const isEditing = Boolean(id) // Determine if we're in edit mode based on ID presence

	// Loading state for async operations (fetching employee data for editing)
	const [loading, setLoading] = useState(false)

	//AI modal open/close + a transition to keep UI responsive while uploading AI image
	const [isAIModalOpen, setIsAIModalOpen] = useState(false)
	const [isUploadPending, startUploadTransition] = useTransition()

	/**
	 * React Hook Form Configuration
	 *
	 * Sets up form handling with:
	 * - Zod schema validation for type safety and validation rules
	 * - Default values for all form fields
	 * - Form state management (errors, submission state, etc.)
	 */
	const {
		register, // connects inputs to the form state
		handleSubmit, // wraps submit handler with validation
		formState: { errors, isSubmitting }, //validation errors and submission state
		reset, // replace all form values with new data
		watch, // read live values from the form
		setValue, // add setValue to destructuring
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
			role: 'EMPLOYEE',
		},
	})

	/**
	 * Image Upload State Management
	 *
	 * These state variables handle the Cloudinary image upload process:
	 * - uploading: Shows loading indicator during upload
	 * - previewUrl: Stores the image URL for preview display
	 */
	const [uploading, setUploading] = useState(false)
	const [previewUrl, setPreviewUrl] = useState<string | null>(null)

	/**
	 * When the AI modal returns a blog, we upload that file to clodinary
	 * if upload succeeeds, we store the return ULR into the form ('thumbnailUrl') and show a preview
	 */
	const handleAIImageSelect = async (imageBlob: Blob) => {
		startUploadTransition(async () => {
			try {
				console.log('Uploading AI generated image to Cloudinary...')

				//build form-data required for clodinary upload
				const formData = new FormData()
				formData.append('file', imageBlob, 'ai-generated-profile.jpg') // add the blob with a filename
				formData.append('upload_preset', uploadPreset) // your unsigned upload preset
				formData.append('cloud_name', cloudName) // your Cloudinary cloud name
				formData.append('resource_type', 'image') // specify this is an image upload

				//upload to cloudinary
				const response = await fetch(uploadUrl, {
					method: 'POST',
					body: formData,
				})

				if (!response.ok) {
					const errorData = await response.json()
					console.error('Cloudinary upload failed:', errorData)
					toast.error('Failed to upload AI image. Please try again.')
					return
				}

				const data = await response.json()
				console.log('Cloudinary response:', data)

				if (data.secure_url) {
					setValue('thumbnailUrl', data.secure_url) // update form with the image URL
					setPreviewUrl(data.secure_url) // set preview URL for immediate display
					toast.success('AI profile image uploaded successfully!')
				} else {
					throw new Error('No secure_url in response')
				}
			} catch (error) {
				console.error('Error uploading AI image:', error)
				toast.error('Failed to upload AI image. Please try again.')
			}
		})
	}

	/**
	 * Handle profile photo upload to Cloudinary
	 *
	 * This function takes a file selected by the user, uploads it to Cloudinary
	 * using their REST API, and updates the form with the resulting secure URL.
	 * The upload uses an unsigned preset for security without exposing API secrets.
	 *
	 */
	const uploadImage = async (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0]
		console.log(file)
		if (!file) return

		// Validate file type - only allow image files
		if (!file.type.startsWith('image/')) {
			toast.error('Please select a valid image file (JPG, PNG, GIF, etc.)')
			console.error('❌ Invalid file type:', file.type)
			return
		}

		// Validate file size - limit to 5MB to prevent large uploads
		const maxSize = 5 * 1024 * 1024 // 5MB in bytes
		if (file.size > maxSize) {
			toast.error('Image file size must be less than 5MB')
			console.error('❌ File too large:', file.size, 'bytes')
			return
		}

		setUploading(true) // Show loading indicator to user
		console.log('📤 Starting upload to Cloudinary...')

		try {
			// Create a FormData object with the file and upload configuration
			// This matches Cloudinary's expected format for unsigned uploads
			const formData = new FormData()
			formData.append('file', file) // The actual image file
			formData.append('upload_preset', uploadPreset) // Your unsigned upload preset
			formData.append('cloud_name', cloudName)
			formData.append('resource_type', 'image') // Specify this is an image upload

			// Parse the response from Cloudinary
			const response = await fetch(uploadUrl, {
				method: 'POST',
				body: formData,
			})

			const data = await response.json()
			console.log('📊 Response data:', data)

			// Check if the upload was successful
			if (response.ok && data.secure_url) {
				console.log('✅ Upload successful! Image URL:', data.secure_url)

				// Update the form field with the secure URL from Cloudinary
				// This URL points to the uploaded image on Cloudinary's CDN
				reset((prevData) => ({
					...prevData,
					thumbnailUrl: data.secure_url, // cloudinary URL stored in form
				}))

				// Set preview URL for immediate visual feedback
				setPreviewUrl(data.secure_url)

				toast.success('Profile photo uploaded successfully!')
				console.log('✅ Image uploaded to Cloudinary:', data.secure_url)
			} else {
				// Handle upload errors from Cloudinary with specific error messages
				console.error('❌ Upload failed. Response:', data)

				let errorMessage = 'Upload failed'
				if (data.error?.message) {
					errorMessage = data.error.message

					// Provide specific guidance for common errors
					if (data.error.message.includes('Upload preset')) {
						errorMessage +=
							'\n\n🔧 Solution: Create an upload preset named "employee_profile" in your Cloudinary dashboard with "Unsigned" signing mode.'
					} else if (data.error.message.includes('whitelisted')) {
						errorMessage +=
							'\n\n🔧 Solution: Make sure your upload preset is set to "Unsigned" mode in your Cloudinary dashboard.'
					} else if (data.error.message.includes('Invalid')) {
						errorMessage +=
							'\n\n🔧 Solution: Check your cloud name and upload preset name in the .env file.'
					}
				}

				throw new Error(errorMessage)
			}
		} catch (error) {
			console.error('❌ Error uploading image to Cloudinary:', error)
			toast.error('Failed to upload image. Please try again.')
		} finally {
			setUploading(false) // Hide loading indicator
			console.log('🏁 Upload process completed')
		}
	}

	/**
	 * Load Employee Data for Editing
	 *
	 * This effect runs when the component mounts and determines if we're in edit mode.
	 * If editing an existing employee, it fetches the employee data and populates
	 * the form fields with the current values, including setting up the image preview.
	 */
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
					role: employee.role,
					startDate: employee.startDate,
					finishDate: employee.finishDate || '',
					ongoing: employee.ongoing,
					hoursPerWeek: employee.hoursPerWeek || 40,
					thumbnailUrl: employee.thumbnailUrl || '',
				})

				// Set preview URL if employee has a profile photo
				if (employee.thumbnailUrl) {
					setPreviewUrl(employee.thumbnailUrl)
				}

				console.log('✅ Employee data loaded for editing')
			} catch (error) {
				console.error('❌ Error loading employee data:', error)
				toast.error('Failed to load employee data. Please try again.')
				navigate('/employees') // Redirect back if loading fails
			} finally {
				setLoading(false)
			}
		}

		loadEmployeeData()
	}, [isEditing, id, reset, navigate])

	/**
	 * Dynamic Field Visibility Control
	 *
	 * Watch the 'ongoing' checkbox value to dynamically show/hide the finish date field.
	 * When ongoing is true, the finish date field is hidden since the employment
	 * has no defined end date.
	 */
	const isOngoing = watch('ongoing')

	/**
	 * Form Submission Handler
	 *
	 * This function processes the form data when the user submits the employee form.
	 * It handles both creating new employees and updating existing ones based on
	 * the current mode (determined by the presence of an ID in the URL).
	 */
	const onSubmit = async (data: EmployeeFormData) => {
		try {
			console.log(
				`${isEditing ? 'Updating' : 'Creating'} employee with data:`,
				data
			)
			console.log('Is editing:', isEditing, 'ID:', id)

			if (data.ongoing) {
				console.log('Employee marked as ongoing - clearing finish date')
			} else if (data.finishDate) {
				console.log('Employee finish date:', data.finishDate)
			}

			if (isEditing && id) {
				// UPDATE EXISTING EMPLOYEE
				console.log('Starting employee update...')
				// Transform form data to match the UpdateEmployeeDTO interface
				// Convert empty strings to undefined for optional fields
				const updateData: UpdateEmployeeDTO = {
					...data,
					finishDate: data.ongoing ? undefined : data.finishDate || undefined,
					ongoing: data.ongoing,
					middleName: data.middleName || undefined,
					thumbnailUrl: data.thumbnailUrl || undefined, // This now contains the Cloudinary URL
					hoursPerWeek: data.hoursPerWeek || undefined,
				}

				console.log('Update data being sent:', updateData)
				const result = await updateEmployee(Number(id), updateData)
				console.log('Update result:', result)
				toast.success(
					`${data.firstName} ${data.lastName} updated successfully!`
				)
			} else {
				// CREATE NEW EMPLOYEE
				console.log('Starting employee creation...')
				// Transform form data to match the CreateEmployeeDTO interface
				// Convert empty strings to undefined for optional fields
				const employeeData: CreateEmployeeDTO = {
					...data,
					finishDate: data.ongoing ? undefined : data.finishDate || undefined,
					ongoing: data.ongoing,
					middleName: data.middleName || undefined,
					thumbnailUrl: data.thumbnailUrl || undefined, // This now contains the Cloudinary URL
					hoursPerWeek: data.hoursPerWeek || undefined,
				}

				console.log('Create data being sent:', employeeData)
				const result = await createEmployee(employeeData)
				console.log('Create result:', result)
				toast.success('Employee created successfully!')
				reset() // Only reset form when creating new employee
			}

			// Redirect to employees list page after successful operation
			console.log('Operation successful, navigating to /employees')
			navigate('/employees')
		} catch (error) {
			console.error(
				`Error ${isEditing ? 'updating' : 'creating'} employee:`,
				error
			)

			// More detailed error logging
			if (error instanceof Error) {
				console.error('Error message:', error.message)
				console.error('Error stack:', error.stack)
			}

			toast.error(
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

								{/* PROFILE PHOTO UPLOAD FIELD */}
								<div className='md:col-span-2'>
									<label className='block text-sm font-medium text-gray-700 mb-2'>
										Profile Photo
									</label>

									{/* Image Preview Section */}
									{previewUrl && (
										<div className='mb-4'>
											<div className='relative inline-block'>
												<img
													src={previewUrl}
													alt='Profile preview'
													className='w-32 h-32 object-cover rounded-lg border-2 border-gray-200 shadow-sm'
												/>
												<button
													type='button'
													onClick={() => {
														setPreviewUrl(null)
														reset((prevData) => ({
															...prevData,
															thumbnailUrl: '',
														}))
													}}
													className='absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600 transition-colors'
													title='Remove photo'>
													×
												</button>
											</div>
											<p className='text-sm text-gray-600 mt-2'>
												Current profile photo
											</p>
										</div>
									)}

									{/* File Upload Input */}
									<div className='space-y-2'>
										<input
											type='file'
											accept='image/*'
											onChange={uploadImage}
											disabled={uploading}
											className='block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-1 file:border-gray-300 file:text-sm file:font-medium file:bg-blue-50 file:text-slate-700 hover:file:bg-blue-100 disabled:opacity-50 disabled:cursor-not-allowed'
										/>

										{/* AI Image Generation Button */}
										<div className='flex items-center gap-2 py-3'>
											<button
												type='button'
												onClick={() => setIsAIModalOpen(true)}
												disabled={isUploadPending}
												className='inline-flex items-center gap-2 py-2 px-4 rounded-lg border border-gray-300 text-sm font-medium bg-blue-50 text-slate-700 hover:bg-blue-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'>
												{isUploadPending ? (
													<MdRefresh className='w-4 h-4 animate-spin' />
												) : (
													<ImMagicWand className='w-4 h-4' />
												)}
												{isUploadPending
													? 'Processing...'
													: 'Generate AI Image'}
											</button>
											<span className='text-sm text-gray-500'>
												Generate AI image
											</span>
										</div>

										{/* Upload Status */}
										{uploading && (
											<div className='flex items-center text-sm text-blue-600'>
												<div className='animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent mr-2'></div>
												Uploading image...
											</div>
										)}

										{/* Help Text */}
										<p className='text-xs text-gray-500'>
											Upload a profile photo (JPG, PNG, GIF). Maximum file size:
											5MB.
										</p>
									</div>

									{/* Hidden input to store the URL in the form */}
									<input {...register('thumbnailUrl')} type='hidden' />

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
								{/* ROLE DROPDOWN */}
								<div>
									<label className='block text-sm font-medium text-gray-700 mb-2'>
										Role *
									</label>
									<select
										{...register('role')}
										className={`w-full px-3 py-2 border rounded-lg ${
											errors.role ? 'border-red-500' : 'border-gray-300'
										}`}>
										<option value='EMPLOYEE'>Employee</option>
										<option value='INTERN'>Intern</option>
										<option value='CONTRACTOR'>Contractor</option>
										<option value='MANAGER'>Manager</option>
										<option value='HR'>HR</option>
										<option value='ADMIN'>Admin</option>
									</select>
									{errors.role && (
										<p className='mt-1 text-sm text-red-600'>
											{errors.role.message}
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
								variant='secondary'
								disabled={isSubmitting}
								isActive={true}
								onClick={handleSubmit(onSubmit)}>
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
			<AIImageModal
				isOpen={isAIModalOpen}
				onClose={() => setIsAIModalOpen(false)}
				onImageSelect={handleAIImageSelect}
			/>
		</div>
	)
}
