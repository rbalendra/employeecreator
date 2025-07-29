import { Link, useNavigate } from 'react-router'
import { Button } from './Button'
import {
	MdDashboard,
	MdPeople,
	MdPersonAdd,
	MdBusiness,
	MdClose,
	MdMenu,
} from 'react-icons/md'
import { useState } from 'react'

//which page is currently active (to highlight the correct button)
interface NavbarProps {
	currentPage?: string
}

export const Navbar = ({ currentPage = 'dashboard' }: NavbarProps) => {
	const navigate = useNavigate() // Hook for programmatic navigation
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

	// NAVIGATION ITEMS: Now with URL paths instead of page IDs
	const navItems = [
		{
			id: 'dashboard',
			label: 'Dashboard',
			icon: <MdDashboard />,
			path: '/dashboard',
		},
		{
			id: 'employees',
			label: 'Employees',
			icon: <MdPeople />,
			path: '/employees',
		},
		{
			id: 'add-employee',
			label: 'Add Employee',
			icon: <MdPersonAdd />,
			path: '/add-employee',
		},
	]

	// call navigate with the given path when a nav item is clicked
	const handleNavClick = (path: string) => {
		navigate(path)
		setIsMobileMenuOpen(false) // Close mobile menu after navigation
	}

	const toggleMobileMenu = () => {
		setIsMobileMenuOpen(!isMobileMenuOpen)
	}

	return (
		// Navigation bar container: sticky top, white background, subtle shadow
		<nav className='bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50'>
			<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
				<div className='flex justify-between h-16'>
					{/* Logo: links back to dashboard */}
					<div className='flex items-center'>
						<Link
							to='/dashboard'
							className='flex-shrink-0 flex items-center hover:opacity-80 transition-opacity'>
							<div className='text-2xl mr-3 text-rose-500'>
								<MdBusiness />
							</div>
							<div>
								<h1 className='text-xl font-bold text-gray-900'>
									Talent Forge
								</h1>
								<p className='text-xs text-gray-500 font-medium'>
									Employee Management Hub
								</p>
							</div>
						</Link>
					</div>

					{/* Desktop Nav menu: hidden on mobile */}
					<div className='hidden md:flex items-center space-x-1 gap-3'>
						{navItems.map((item) => (
							<Button
								key={item.id}
								variant='secondary'
								size='md'
								isActive={currentPage === item.id}
								onClick={() => handleNavClick(item.path)}>
								<span className='text-lg'>{item.icon}</span>
								<span>{item.label}</span>
							</Button>
						))}
					</div>

					{/* Mobile hamburger button: only visible on mobile */}
					<div className='md:hidden flex items-center'>
						<button
							onClick={toggleMobileMenu}
							className='inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors'
							aria-expanded={isMobileMenuOpen}
							aria-label='Toggle navigation menu'>
							{isMobileMenuOpen ? (
								<MdClose className='h-6 w-6' />
							) : (
								<MdMenu className='h-6 w-6' />
							)}
						</button>
					</div>
				</div>

				{/* Mobile menu: slides down when hamburger is clicked */}
				{isMobileMenuOpen && (
					<div className='md:hidden border-t border-gray-200 bg-white'>
						<div className='px-2 pt-2 pb-3 space-y-1'>
							{navItems.map((item) => (
								<button
									key={item.id}
									onClick={() => handleNavClick(item.path)}
									className={`w-full text-left flex items-center px-3 py-2 rounded-md text-base font-medium transition-colors ${
										currentPage === item.id
											? 'bg-rose-100 text-rose-700 border-l-4 border-rose-500'
											: 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
									}`}>
									<span className='text-xl mr-3'>{item.icon}</span>
									<span>{item.label}</span>
								</button>
							))}
						</div>
					</div>
				)}
			</div>
		</nav>
	)
}
