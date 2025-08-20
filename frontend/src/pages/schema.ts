import { z } from 'zod'

// define a validation schema for employee form data
export const employeeSchema = z
	.object({
		firstName: z.string().min(2, 'First name must be at least 2 characters'),
		lastName: z.string().min(2, 'Last name must be at least 2 characters'),
		email: z.string().email('Please enter a valid email address'),
		mobileNumber: z
			.string()
			.regex(
				/^\d{10,}$/,
				'Mobile number must contain only digits and be at least 10 characters'
			),
		residentialAddress: z.string().min(5, 'Please enter a valid address'),
		middleName: z.string().optional(),
		contractType: z.enum(['PERMANENT', 'CONTRACT'], {
			message: 'Please select a contract type',
		}),
		employmentBasis: z.enum(['FULL_TIME', 'PART_TIME'], {
			message: 'Please select employment basis',
		}),
		startDate: z
			.string()
			.min(1, 'Start date is required')
			.refine(
				(date) => {
					// Check if date is in valid format (DD-MM-YYYY)
					const dateRegex = /^\d{2}-\d{2}-\d{4}$/
					if (!dateRegex.test(date)) return false

					// Check if it's a valid date
					const parsedDate = new Date(date)
					return !isNaN(parsedDate.getTime())
				},
				{
					message: 'Please enter a valid date',
				}
			),
		finishDate: z.string().optional(),
		ongoing: z.boolean(),
		role: z.enum(
			['ADMIN', 'HR', 'MANAGER', 'EMPLOYEE', 'INTERN', 'CONTRACTOR'],
			{
				message: 'Please select a role',
			}
		),
		hoursPerWeek: z
			.number()
			.min(1, 'Hours per week must be at least 1')
			.max(168, 'Hours per week cannot exceed 168')
			.optional(),
		// Thumbnail URL: must be a valid URL if provided,
		// OR can be an empty string if user hasn’t uploaded anything
		thumbnailUrl: z.string().url().optional().or(z.literal('')),
	})
	.refine(
		(data) => {
			// Only validate finish date if ongoing is false and finishDate is provided
			if (!data.ongoing && data.finishDate && data.finishDate.trim() !== '') {
				// Ensure both dates are valid before comparison
				const startDate = new Date(data.startDate)
				const finishDate = new Date(data.finishDate)

				// Check if dates are valid
				if (isNaN(startDate.getTime()) || isNaN(finishDate.getTime())) {
					return false
				}
				// End date must be later than start date
				return finishDate > startDate
			}
			return true
		},
		{
			message: 'End date must be after the start date',
			path: ['finishDate'], // This will show the error on the finishDate field
		}
	)

// This line creates a TypeScript type based on the schema above.
// So EmployeeFormData will have the same structure and validation as employeeSchema.
export type EmployeeFormData = z.infer<typeof employeeSchema>
