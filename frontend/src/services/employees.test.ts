import { describe, it, expect, vi, beforeEach, afterEach, test } from 'vitest'
import {
	getAllEmployees,
	getEmployeeById,
	createEmployee,
	updateEmployee,
	deleteEmployee,
	searchEmployees,
	getDashboardStats,
	type Employee,
	type CreateEmployeeDTO,
	type UpdateEmployeeDTO,
	type PagedResponse,
} from './employees'

// Mock the global fetch function before any tests run
// This allows us to control what fetch returns in our tests
const mockFetch = vi.fn()
globalThis.fetch = mockFetch

// Sample test data that we'll use across multiple tests
const mockEmployee: Employee = {
	id: 1,
	firstName: 'John',
	middleName: 'Michael',
	lastName: 'Doe',
	email: 'john.doe@company.com',
	mobileNumber: '0412345678',
	residentialAddress: '123 Main St, Sydney NSW 2000',
	contractType: 'PERMANENT',
	startDate: '2024-01-15',
	finishDate: undefined,
	ongoing: true,
	employmentBasis: 'FULL_TIME',
	hoursPerWeek: 40,
	thumbnailUrl: 'https://example.com/avatar.jpg',
}

// Sample data for creating a new employee (without ID)
const mockCreateEmployeeDTO: CreateEmployeeDTO = {
	firstName: 'Jane',
	lastName: 'Smith',
	email: 'jane.smith@company.com',
	mobileNumber: '0498765432',
	residentialAddress: '456 Oak Ave, Melbourne VIC 3000',
	contractType: 'CONTRACT',
	startDate: '2024-02-01',
	finishDate: '2024-12-31',
	ongoing: false,
	employmentBasis: 'PART_TIME',
	hoursPerWeek: 25,
}

describe('Employee API Service', () => {
	// Run before each individual test
	beforeEach(() => {
		// Clear all previous mock calls and reset mock state
		// This ensures each test starts with a clean slate
		vi.clearAllMocks()
	})

	// Run after each individual test
	afterEach(() => {
		// Additional cleanup if needed
		vi.clearAllMocks()
	})

	/* ========================== GET ALL EMPLOYEES ========================== */
	describe('getAllEmployees', () => {
		test('should fetch all employees successfully', async () => {
			// ARRANGE: Set up our mock response
			const mockEmployees = [
				mockEmployee,
				{ ...mockEmployee, id: 2, firstName: 'Jane' },
			]

			// Mock fetch to resolve with a successful response
			// mockResolvedValueOnce means this mock will only apply to the next fetch call
			mockFetch.mockResolvedValueOnce({
				ok: true, // HTTP status 200-299
				status: 200,
				json: async () => mockEmployees, // What response.json() should return
			})

			// ACT: Call the function we're testing
			const result = await getAllEmployees()

			// ASSERT: Check that everything worked as expected
			// Verify fetch was called with correct URL
			expect(mockFetch).toHaveBeenCalledWith(
				'http://localhost:8080/api/employees'
			)
			// Verify fetch was called exactly once
			expect(mockFetch).toHaveBeenCalledTimes(1)
			// Verify the function returns the expected data
			expect(result).toEqual(mockEmployees)
			expect(result).toHaveLength(2)
		})

		test('should throw error when fetch fails', async () => {
			// ARRANGE: Mock a failed HTTP response
			mockFetch.mockResolvedValueOnce({
				ok: false, // HTTP status 400-599
				status: 500,
				json: async () => ({ error: 'Internal Server Error' }),
			})

			// ACT & ASSERT: Expect the function to throw an error
			await expect(getAllEmployees()).rejects.toThrow(
				'HTTP 500: Failed to fetch employees'
			)

			// Verify fetch was still called (the error happened after the call)
			expect(mockFetch).toHaveBeenCalledTimes(1)
		})

		test('should throw error when network request fails', async () => {
			// ARRANGE: Mock a network error (no internet, server down, etc.)
			mockFetch.mockRejectedValueOnce(new Error('Network error'))

			// ACT & ASSERT: Function should throw an error (any error)
			await expect(getAllEmployees()).rejects.toThrow()
			expect(mockFetch).toHaveBeenCalledTimes(1)
		})
	}) // <- This closing parenthesis was missing!

	/* -------------------------------------------------------------------------- */
})
