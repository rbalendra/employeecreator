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
	})

	/* ======================== GET EMPLOYEE BY ID ======================== */
	describe('getEmployeeById', () => {
		test('should fetch single employee by id successfully', async () => {
			// ARRANGE: Mock successful response for specific employee
			mockFetch.mockResolvedValueOnce({
				ok: true,
				status: 200,
				json: async () => mockEmployee,
			})

			// ACT: Call function with specific ID
			const result = await getEmployeeById(1)

			// ASSERT: Check correct API call and response
			expect(mockFetch).toHaveBeenCalledWith(
				'http://localhost:8080/api/employees/1'
			)
			expect(result).toEqual(mockEmployee)
			expect(result.id).toBe(1)
		})

		it('should throw error for non-existent employee', async () => {
			// ARRANGE: Mock 404 response (employee not found)
			mockFetch.mockResolvedValueOnce({
				ok: false,
				status: 404,
				json: async () => ({ error: 'Employee not found' }),
			})

			// ACT & ASSERT: Should throw error for missing employee
			await expect(getEmployeeById(999)).rejects.toThrow(
				'failed to fetch employee 999'
			)
			expect(mockFetch).toHaveBeenCalledWith(
				'http://localhost:8080/api/employees/999'
			)
		})
	})

	/* ========================== CREATE EMPLOYEE ========================== */
	describe('createEmployee', () => {
		test('should create new employee successfully', async () => {
			// ARRANGE: Mock successful creation response
			const createdEmployee = { ...mockCreateEmployeeDTO, id: 3 }
			mockFetch.mockResolvedValueOnce({
				ok: true,
				status: 201, // Created status
				json: async () => createdEmployee,
			})

			// ACT: Create new employee
			const result = await createEmployee(mockCreateEmployeeDTO)

			// ASSERT: Check POST request was made correctly
			expect(mockFetch).toHaveBeenCalledWith(
				'http://localhost:8080/api/employees',
				{
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(mockCreateEmployeeDTO),
				}
			)
			expect(result).toEqual(createdEmployee)
			expect(result.id).toBe(3) // Should have new ID assigned
		})

		test('should handle validation errors during creation', async () => {
			// ARRANGE: Mock validation error response (400 Bad Request)
			mockFetch.mockResolvedValueOnce({
				ok: false,
				status: 400,
				json: async () => ({
					error: 'Validation failed',
					details: ['Email is required', 'Invalid phone number'],
				}),
			})

			// ACT & ASSERT: Should throw error for invalid data
			await expect(createEmployee(mockCreateEmployeeDTO)).rejects.toThrow(
				'Failed to create employee'
			)
		})
	})

	/* ========================== UPDATE EMPLOYEE ========================== */
	describe('updateEmployee', () => {
		test('should update employee successfully', async () => {
			// ARRANGE: Mock successful update
			const updateData: UpdateEmployeeDTO = {
				firstName: 'Johnny',
				email: 'johnny.doe@company.com',
			}
			const updatedEmployee = { ...mockEmployee, ...updateData }

			mockFetch.mockResolvedValueOnce({
				ok: true,
				status: 200,
				json: async () => updatedEmployee,
			})

			// ACT: Update existing employee
			const result = await updateEmployee(1, updateData)

			// ASSERT: Check PUT request with partial data
			expect(mockFetch).toHaveBeenCalledWith(
				'http://localhost:8080/api/employees/1',
				{
					method: 'PUT',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(updateData),
				}
			)
			expect(result.firstName).toBe('Johnny')
			expect(result.email).toBe('johnny.doe@company.com')
		})

		test('should handle update of non-existent employee', async () => {
			// ARRANGE: Mock 404 for employee that doesn't exist
			mockFetch.mockResolvedValueOnce({
				ok: false,
				status: 404,
			})

			// ACT & ASSERT: Should throw error for missing employee
			await expect(updateEmployee(999, { firstName: 'Test' })).rejects.toThrow(
				'Failed to update employee 999'
			)
		})
	})

	/* ========================== DELETE EMPLOYEE ========================== */
	describe('deleteEmployee', () => {
		it('should delete employee successfully', async () => {
			// ARRANGE: Mock successful deletion (204 No Content)
			mockFetch.mockResolvedValueOnce({
				ok: true,
				status: 204, // No content - successful deletion
			})

			// ACT: Delete employee (no return value expected)
			await deleteEmployee(1)

			// ASSERT: Check DELETE request was made
			expect(mockFetch).toHaveBeenCalledWith(
				'http://localhost:8080/api/employees/1',
				{
					method: 'DELETE',
				}
			)
			expect(mockFetch).toHaveBeenCalledTimes(1)
		})

		test('should handle deletion of non-existent employee', async () => {
			// ARRANGE: Mock 404 for employee that doesn't exist
			mockFetch.mockResolvedValueOnce({
				ok: false,
				status: 404,
			})

			// ACT & ASSERT: Should throw error
			await expect(deleteEmployee(999)).rejects.toThrow(
				'Failed to delete employee 999'
			)
		})
	})
})
