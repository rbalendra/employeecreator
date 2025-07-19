import { Button } from './Button' // Import our updated Button component
import { MdDashboard, MdPeople, MdPersonAdd, MdBusiness } from 'react-icons/md' // Modern icons

interface NavbarProps {
	currentPage?: string
	onNavigate?: (page: string) => void // Add navigation callback
}

export const Navbar = ({
	currentPage = 'dashboard',
	onNavigate,
}: NavbarProps) => {
	// Navigation menu items with React Icons
	const navItems = [
		{ id: 'dashboard', label: 'Dashboard', icon: <MdDashboard /> },
		{ id: 'employees', label: 'Employees', icon: <MdPeople /> },
		{ id: 'add-employee', label: 'Add Employee', icon: <MdPersonAdd /> },
	]

	// Handle navigation click - this function gets passed to each Button
	const handleNavClick = (pageId: string) => {
		if (onNavigate) {
			onNavigate(pageId)
		}
	}

	return (
		<nav className='bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50'>
			<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
				<div className='flex justify-between h-16'>
					{/* Logo and Brand */}
					<div className='flex items-center'>
						<div className='flex-shrink-0 flex items-center'>
							<div className='text-2xl mr-3 text-orange-500'>
								<MdBusiness />
							</div>
							<div>
								<h1 className='text-xl font-bold text-gray-900'>
									Employee Creator
								</h1>
								<p className='text-xs text-gray-500 font-medium'>
									CRM Dashboard
								</p>
							</div>
						</div>
					</div>

					{/* Navigation Menu - Now using our modern Button component */}
					<div className='flex items-center space-x-1 gap-3'>
						{navItems.map((item) => (
							<Button
								key={item.id}
								variant='secondary' // Use secondary variant for navigation
								size='sm' // Medium size buttons
								isActive={currentPage === item.id} // Pass active state - Button will style itself accordingly
								onClick={() => handleNavClick(item.id)} // Pass click handler - Button will call this when clicked
							>
								{/* Button content - icon and label */}
								<span className='text-lg'>{item.icon}</span>
								<span>{item.label}</span>
							</Button>
						))}
					</div>
				</div>
			</div>
		</nav>
	)
}
