import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button } from './Button'
import { describe, expect, test, vi } from 'vitest'
import '@testing-library/jest-dom'

describe('Button Component', () => {
	test('renders button with children text', () => {
		// Arrange: Set up the component with test data
		render(<Button>Click me</Button>)

		// Act & Assert: Check if the button text appears in the document
		expect(
			screen.getByRole('button', { name: /click me/i })
		).toBeInTheDocument()
	})

	/* ---- This test checks if the button doesn't call onClick when disabled --- */
	test('does not call onClick when disabled', async () => {
		const mockClick = vi.fn()
		const user = userEvent.setup()

		render(
			<Button onClick={mockClick} disabled>
				Disabled
			</Button>
		)
		const button = screen.getByRole('button')

		// Check that disabled styles are applied
		expect(button).toHaveClass('opacity-50', 'cursor-not-allowed')
		// Try to click the disabled button
		await user.click(button)
		// Verify onClick was NOT called
		expect(mockClick).not.toHaveBeenCalled()
	})

	test('handles click events correctly', async () => {
		// Create a mock function to track if onClick was called
		const mockClick = vi.fn()
		const user = userEvent.setup()

		render(<Button onClick={mockClick}>Click me</Button>)

		// Simulate user clicking the button
		await user.click(screen.getByRole('button'))

		// Verify the onClick function was called exactly once
		expect(mockClick).toHaveBeenCalledTimes(1)
	})
})
