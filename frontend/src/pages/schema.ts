import { z } from 'zod'

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
		startDate: z.date({ message: 'Start date is required' }),
		finishDate: z.date().optional(),
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
		thumbnailUrl: z.string().url().optional().or(z.literal('')),
	})
	.refine(
		(data) => {
			// Only validate finish date if ongoing is false and finishDate is provided
			if (!data.ongoing && data.finishDate) {
				const startDate = new Date(data.startDate)
				const finishDate = new Date(data.finishDate)
				return finishDate > startDate
			}
			return true
		},
		{
			message: 'End date must be after the start date',
			path: ['finishDate'], // This will show the error on the finishDate field
		}
	)

export type EmployeeFormData = z.infer<typeof employeeSchema>
