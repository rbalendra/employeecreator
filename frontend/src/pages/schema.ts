import { z } from 'zod'

export const employeeSchema = z.object({
	firstName: z.string().min(2, 'First name must be at least 2 characters'),
	lastName: z.string().min(2, 'Last name must be at least 2 characters'),
	email: z.string().email('Please enter a valid email address'),
	mobileNumber: z.string().min(10, 'Mobile number must be at least 10 digits'),
	residentialAddress: z.string().min(5, 'Please enter a valid address'),
	middleName: z.string().optional(),
	contractType: z.enum(['PERMANENT', 'CONTRACT'], {
		errorMap: () => ({ message: 'Please select a contract type' }),
	}),
	employmentBasis: z.enum(['FULL_TIME', 'PART_TIME'], {
		errorMap: () => ({ message: 'Please select employment basis' }),
	}),
	startDate: z.string().min(1, 'Start date is required'),
	finishDate: z.string().optional(),
	ongoing: z.boolean(),
	hoursPerWeek: z.number().min(1).max(168).optional(),
	thumbnailUrl: z.string().url().optional().or(z.literal('')),
})

export type EmployeeFormData = z.infer<typeof employeeSchema>
