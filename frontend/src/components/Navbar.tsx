import { Link, useNavigate } from 'react-router' // Import React Router hooks
import { Button } from './Button'
import { MdDashboard, MdPeople, MdPersonAdd, MdBusiness } from 'react-icons/md'

interface NavbarProps {
	currentPage?: string
}

export const Navbar = ({ currentPage = 'dashboard' }: NavbarProps) => {
	const navigate = useNavigate() // Hook for programmatic navigation

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

	// NAVIGATION HANDLER: Use React Router's navigate function
	const handleNavClick = (path: string) => {
		navigate(path)
	}

	return (
		<nav className='bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50'>
			<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
				<div className='flex justify-between h-16'>
					<div className='flex items-center'>
						<Link
							to='/dashboard'
							className='flex-shrink-0 flex items-center hover:opacity-80 transition-opacity'>
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
						</Link>
					</div>

					{/* NAVIGATION MENU: Using Router navigation */}
					<div className='flex items-center space-x-1 gap-3'>
						{navItems.map((item) => (
							<Button
								key={item.id}
								variant='secondary'
								size='md'
								isActive={currentPage === item.id} // Still check current page for active state
								onClick={() => handleNavClick(item.path)} // Navigate to the path
							>
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
