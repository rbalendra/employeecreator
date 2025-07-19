import React from 'react'

interface ButtonProps {
	children: React.ReactNode // content inside the button (text, icon etc)
	variant?: 'primary' | 'secondary' | 'ghost' | 'success' | 'warning' | 'danger'
	size?: 'sm' | 'md' | 'lg'

	// state prop
	isActive?: boolean
	disabled?: boolean

	//behaviour prop
	onClick?: () => void //Function to call when button is clicked

	//Styling props (if additional css classes to apply)
	className?: string
}

/* -------------------------------------------------------------------------- */

export const Button = ({
	children,
	variant = 'secondary',
	size = 'md',
	isActive = false,
	disabled = false,
	onClick,
	className = '',
}: ButtonProps) => {
	// Base styles that apply to all buttons - modern, clean design
	const baseStyles =
		'flex items-center justify-center space-x-2 font-medium transition-all duration-150 focus:outline-none border-1  cursor-pointer'

	// Size variations - clean, minimal padding
	const sizeStyles = {
		sm: 'px-3 py-1.5 text-sm rounded-lg',
		md: 'px-4 py-2 text-sm rounded-lg',
		lg: 'px-6 py-3 text-base rounded-lg',
	}

	// Modern variant styles - orange theme with clean aesthetics
	const variantStyles = {
		// Primary: Bright orange for main actions
		primary: isActive
			? 'bg-orange-500 text-white border-orange-500 shadow-sm'
			: 'bg-orange-500 hover:bg-orange-600 text-white border-orange-500 hover:border-orange-600 shadow-sm hover:shadow-md',

		secondary: isActive
			? 'bg-rose-500 text-white border-slate-800 shadow-sm hover:bg-rose-700'
			: 'bg-white hover:bg-gray-50 text-gray-700 border-gray-300 hover:border-gray-400',

		// Ghost: Minimal for subtle actions
		ghost:
			'bg-transparent hover:bg-gray-50 text-gray-600 hover:text-gray-900 border-transparent hover:border-gray-200',

		// Success: Green for positive actions
		success: isActive
			? 'bg-green-500 text-white border-green-500 shadow-sm'
			: 'bg-green-500 hover:bg-green-600 text-white border-green-500 hover:border-green-600 shadow-sm hover:shadow-md',

		// Warning: Yellow/orange for warnings
		warning: isActive
			? 'bg-yellow-500 text-white border-yellow-500 shadow-sm'
			: 'bg-yellow-500 hover:bg-yellow-600 text-white border-yellow-500 hover:border-yellow-600 shadow-sm hover:shadow-md',

		// Danger: Red for destructive actions
		danger: isActive
			? 'bg-red-500 text-white border-red-500 shadow-sm'
			: 'bg-red-500 hover:bg-red-600 text-white border-red-500 hover:border-red-600 shadow-sm hover:shadow-md',
	}

	// Disabled styles override other styles when button is disabled
	const disabledStyles =
		'opacity-50 cursor-not-allowed hover:bg-current hover:border-current hover:shadow-none'

	// Combine all styles based on props
	const buttonClasses = `
        ${baseStyles}
        ${sizeStyles[size]}
        ${disabled ? disabledStyles : variantStyles[variant]}
        ${className}
    `.trim()

	// Handle click events - only call onClick if button is not disabled
	const handleClick = () => {
		if (!disabled && onClick) {
			onClick()
		}
	}

	return (
		<button
			className={buttonClasses}
			onClick={handleClick}
			disabled={disabled}
			aria-pressed={isActive}
			type='button' // Prevent form submission if used inside forms
		>
			{children}
		</button>
	)
}
